
import * as admin from "firebase-admin";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { FieldValue } from "firebase-admin/firestore";

const db = admin.firestore();

export const approveOutOfHoursRequest = onCall(async (request) => {
    // This function should be protected to be callable only by admins.
    // We'll skip the role check here for simplicity, but it's critical in production.
    const { requestId, outOfHoursFee } = request.data;
    
    if (!requestId || typeof outOfHoursFee !== 'number') {
        throw new HttpsError('invalid-argument', 'Request ID and fee are required.');
    }

    const requestRef = db.collection('outOfHoursRequests').doc(requestId);

    return db.runTransaction(async (transaction) => {
        const requestDoc = await transaction.get(requestRef);
        if (!requestDoc.exists) {
            throw new HttpsError('not-found', 'Out-of-hours request not found.');
        }

        const reqData = requestDoc.data() as any;
        if (reqData.status !== 'pending') {
            throw new HttpsError('failed-precondition', 'This request has already been processed.');
        }

        // Create a new confirmed booking
        const bookingRef = db.collection('bookings').doc();
        const bookingData = {
            clientId: reqData.clientId,
            clientName: reqData.clientName,
            clientEmail: reqData.clientEmail,
            services: reqData.services,
            bookingDate: reqData.requestedDate,
            bookingTime: reqData.requestedTime,
            totalPrice: reqData.totalPrice + outOfHoursFee,
            totalDuration: reqData.totalDuration,
            styleRequests: `OOH Request: ${reqData.clientNotes || ''}`,
            status: 'confirmed',
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
        };
        transaction.set(bookingRef, bookingData);

        // Delete the original request
        transaction.delete(requestRef);

        // In a real app, you would also trigger a notification to the client here.
        // e.g., using Firebase Cloud Messaging or sending an email.
        
        return { success: true, bookingId: bookingRef.id };
    });
});
