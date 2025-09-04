
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";

admin.initializeApp();

// Import and export functions from other files to keep this file clean.
import { createBooking, cancelBooking } from "./booking";
import { approveOutOfHoursRequest } from "./requests";

export { createBooking, cancelBooking, approveOutOfHoursRequest };

// Example Trigger stub
import { onDocumentWritten } from "firebase-functions/v2/firestore";

export const onBookingWriteAnalytics = onDocumentWritten("bookings/{bookingId}", (event) => {
    logger.info("A booking document was written.", { bookingId: event.params.bookingId });
    // Here you would add logic to update analytics counters
    // For example, incrementing a total bookings count or tracking revenue.
    return;
});
