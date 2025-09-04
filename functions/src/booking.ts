
import * as admin from "firebase-admin";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { FieldValue } from "firebase-admin/firestore";

const db = admin.firestore();

// A helper function to generate time slots
const generateSlots = (start: string, end: string, duration: number, interval: number): string[] => {
    const slots = [];
    let currentTime = new Date(`1970-01-01T${start}:00`);
    const endTime = new Date(`1970-01-01T${end}:00`);

    while (currentTime < endTime) {
        slots.push(currentTime.toTimeString().substring(0, 5));
        currentTime = new Date(currentTime.getTime() + interval * 60000);
    }
    return slots;
};

export const createBooking = onCall(async (request) => {
    const { data } = request;
    const uid = request.auth?.uid;

    if (!uid) {
        throw new HttpsError("unauthenticated", "You must be logged in to book.");
    }

    const { services: serviceIds, date, time, notes } = data;
    if (!Array.isArray(serviceIds) || serviceIds.length === 0 || !date || !time) {
        throw new HttpsError("invalid-argument", "Missing required booking information.");
    }
    
    try {
        const services = await Promise.all(serviceIds.map(id => db.collection('services').doc(id).get()));
        if (services.some(s => !s.exists)) {
            throw new HttpsError('not-found', 'One or more selected services do not exist.');
        }

        const serviceData = services.map(s => s.data() as any);
        const totalDuration = serviceData.reduce((acc, s) => acc + s.duration + (s.bufferMinutes || 0), 0);
        const totalPrice = serviceData.reduce((acc, s) => acc + s.price, 0);

        const requiredSlotsCount = Math.ceil(totalDuration / 30);
        const startTime = new Date(`${date}T${time}`);
        const requiredSlots = Array.from({ length: requiredSlotsCount }, (_, i) => {
            const slotTime = new Date(startTime.getTime() + i * 30 * 60000);
            return slotTime.toTimeString().substring(0, 5);
        });

        // Firestore Transaction
        return await db.runTransaction(async (transaction) => {
            const availabilityRef = db.collection('availability').doc(date);
            const availabilityDoc = await transaction.get(availabilityRef);
            
            if (!availabilityDoc.exists) {
                throw new HttpsError('failed-precondition', 'No availability for the selected date.');
            }

            const availableSlots = availabilityDoc.data()?.slots || [];
            const hasAllSlots = requiredSlots.every(slot => availableSlots.includes(slot));

            if (!hasAllSlots) {
                throw new HttpsError('failed-precondition', 'The selected time slot is no longer available.');
            }

            // Remove the booked slots from availability
            const newSlots = availableSlots.filter((slot: string) => !requiredSlots.includes(slot));
            transaction.update(availabilityRef, { slots: newSlots });

            // Create the booking document
            const bookingRef = db.collection('bookings').doc();
            const clientDoc = await db.collection('clients').doc(uid).get();
            const clientData = clientDoc.data();

            const bookingData = {
                clientId: uid,
                clientName: clientData?.name,
                clientEmail: clientData?.email,
                services: serviceData.map(s => ({ id: s.id, name: s.name, price: s.price, duration: s.duration })),
                bookingDate: date,
                bookingTime: time,
                totalPrice,
                totalDuration,
                styleRequests: notes || null,
                status: 'confirmed',
                createdAt: FieldValue.serverTimestamp(),
                updatedAt: FieldValue.serverTimestamp(),
            };
            transaction.set(bookingRef, bookingData);

            return { success: true, bookingId: bookingRef.id };
        });

    } catch (error) {
        if (error instanceof HttpsError) {
            throw error;
        }
        console.error("Error creating booking:", error);
        throw new HttpsError('internal', 'An unexpected error occurred while creating the booking.');
    }
});


export const cancelBooking = onCall(async (request) => {
    const { bookingId } = request.data;
    const uid = request.auth?.uid;

    if (!uid) {
        throw new HttpsError("unauthenticated", "You must be logged in.");
    }
    if (!bookingId) {
        throw new HttpsError("invalid-argument", "Booking ID is required.");
    }

    const bookingRef = db.collection('bookings').doc(bookingId);

    return db.runTransaction(async (transaction) => {
        const bookingDoc = await transaction.get(bookingRef);
        if (!bookingDoc.exists) {
            throw new HttpsError("not-found", "Booking not found.");
        }

        const bookingData = bookingDoc.data() as any;
        if (bookingData.clientId !== uid) {
            // Check for admin role would go here in a real app
            throw new HttpsError("permission-denied", "You cannot cancel this booking.");
        }

        // Update booking status
        transaction.update(bookingRef, { status: 'cancelled', updatedAt: FieldValue.serverTimestamp() });

        // Restore availability slots
        const availabilityRef = db.collection('availability').doc(bookingData.bookingDate);
        const requiredSlotsCount = Math.ceil(bookingData.totalDuration / 30);
        const startTime = new Date(`${bookingData.bookingDate}T${bookingData.bookingTime}`);
        const slotsToRestore = Array.from({ length: requiredSlotsCount }, (_, i) => {
            const slotTime = new Date(startTime.getTime() + i * 30 * 60000);
            return slotTime.toTimeString().substring(0, 5);
        });

        transaction.update(availabilityRef, {
            slots: FieldValue.arrayUnion(...slotsToRestore)
        });
        
        return { success: true };
    });
});
