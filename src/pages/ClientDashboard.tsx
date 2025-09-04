
import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { Booking } from '../types';
import Spinner from '../components/ui/Spinner';

const ClientDashboard: React.FC = () => {
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

  const getStatusChipStyle = (status: Booking['status']) => {
    switch (status) {
        case 'confirmed': return 'bg-green-100 text-green-800';
        case 'completed': return 'bg-blue-100 text-blue-800';
        case 'cancelled': return 'bg-red-100 text-red-800';
        default: return 'bg-yellow-100 text-yellow-800';
    }
  }

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white rounded-xl shadow-soft">
        <h1 className="text-2xl font-bold text-primary">Welcome, {user?.displayName || 'Client'}!</h1>
        <p className="text-gray-600 mt-1">Here are your recent and upcoming appointments.</p>
      </div>

      <h2 className="text-xl font-bold text-primary">My Bookings</h2>
      {loading ? (
         <div className="flex justify-center p-8"><Spinner /></div>
      ) : bookings.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-xl shadow-soft">
          <p className="text-gray-500">You have no bookings yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map(booking => (
            <div key={booking.id} className="p-6 bg-white rounded-xl shadow-soft">
              <div className="flex flex-col sm:flex-row justify-between items-start">
                <div>
                  <p className="font-semibold text-lg">{new Date(booking.bookingDate).toDateString()} at {booking.bookingTime}</p>
                  <ul className="list-disc list-inside text-gray-600 mt-2">
                    {booking.services.map(s => <li key={s.id}>{s.name}</li>)}
                  </ul>
                </div>
                <div className="text-left sm:text-right mt-4 sm:mt-0">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusChipStyle(booking.status)}`}>
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

export default ClientDashboard;
