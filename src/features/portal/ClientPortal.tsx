
import React from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { auth } from '../../lib/firebase';
import Button from '../../components/ui/Button';
import BookingPage from './BookingPage';
import MyBookingsPage from './MyBookingsPage';

const ClientPortal: React.FC = () => {
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await auth.signOut();
        navigate('/login');
    };

    const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
        `px-4 py-2 rounded-md text-sm font-medium ${
        isActive ? 'bg-secondary text-primary' : 'text-gray-600 hover:bg-gray-100'
        }`;

    return (
        <div className="min-h-screen bg-background">
            <header className="bg-white shadow-soft sticky top-0 z-10">
                <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <span className="font-bold text-xl text-primary">Who Cares</span>
                            <div className="hidden md:block ml-10">
                                <div className="flex items-baseline space-x-4">
                                    <NavLink to="/" end className={navLinkClasses}>Book</NavLink>
                                    <NavLink to="/my-bookings" className={navLinkClasses}>My Bookings</NavLink>
                                </div>
                            </div>
                        </div>
                        <div>
                            <Button onClick={handleSignOut} variant="secondary" size="sm">Sign Out</Button>
                        </div>
                    </div>
                </nav>
            </header>
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Routes>
                    <Route index element={<BookingPage />} />
                    <Route path="my-bookings" element={<MyBookingsPage />} />
                </Routes>
            </main>
        </div>
    );
};

export default ClientPortal;
