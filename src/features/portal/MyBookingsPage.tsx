
import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../hooks/useAuth';
import { Booking } from '../../types';
import Spinner from '../../components/ui/Spinner';

const MyBookingsPage: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    const bookingsRef = collection(db, 'bookings');
    const q = query(
      bookingsRef, 
      where('clientId', '==', user.uid),
      orderBy('bookingDate', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const userBookings = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
      setBookings(userBookings);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching bookings: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return <div className="flex justify-center p-8"><Spinner /></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary">My Bookings</h1>
      {bookings.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-xl shadow-soft">
          <p className="text-gray-500">You have no bookings yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map(booking => (
            <div key={booking.id} className="p-6 bg-white rounded-xl shadow-soft">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-lg">{new Date(booking.bookingDate).toDateString()} at {booking.bookingTime}</p>
                  <ul className="list-disc list-inside text-gray-600 mt-2">
                    {booking.services.map(s => <li key={s.id}>{s.name}</li>)}
                  </ul>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.status}
                  </span>
                  <p className="font-bold text-lg mt-2">${booking.totalPrice.toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
