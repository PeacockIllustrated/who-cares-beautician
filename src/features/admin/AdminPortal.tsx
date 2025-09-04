
import React from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { auth } from '../../lib/firebase';
import Button from '../../components/ui/Button';

// Placeholder components for admin sections
const AdminDashboard = () => <div className="p-6 bg-white rounded-xl shadow-soft">Admin Dashboard Overview - KPIs would go here.</div>;
const AdminAppointments = () => <div className="p-6 bg-white rounded-xl shadow-soft">Manage Appointments - Upcoming/Completed lists with filters.</div>;
const AdminServices = () => <div className="p-6 bg-white rounded-xl shadow-soft">Manage Services - CRUD interface for services.</div>;
const AdminAvailability = () => <div className="p-6 bg-white rounded-xl shadow-soft">Manage Availability - Tools to set weekly patterns and clear ranges.</div>;
const AdminClients = () => <div className="p-6 bg-white rounded-xl shadow-soft">Manage Clients - CRM view with client history and notes.</div>;

const AdminPortal: React.FC = () => {
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await auth.signOut();
        navigate('/login');
    };

    const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
        `block px-3 py-2 rounded-md text-base font-medium ${
        isActive ? 'bg-secondary text-primary' : 'text-gray-600 hover:bg-gray-100'
        }`;

    return (
        <div className="flex h-screen bg-light-gray">
            <aside className="w-64 bg-white shadow-md flex-shrink-0">
                <div className="p-4">
                    <h1 className="text-2xl font-bold text-primary">Admin Panel</h1>
                </div>
                <nav className="mt-5 flex-1 px-2 space-y-1">
                    <NavLink to="/admin" end className={navLinkClasses}>Dashboard</NavLink>
                    <NavLink to="/admin/appointments" className={navLinkClasses}>Appointments</NavLink>
                    <NavLink to="/admin/services" className={navLinkClasses}>Services</NavLink>
                    <NavLink to="/admin/availability" className={navLinkClasses}>Availability</NavLink>
                    <NavLink to="/admin/clients" className={navLinkClasses}>Clients</NavLink>
                </nav>
                <div className="absolute bottom-0 w-64 p-4">
                    <Button onClick={handleSignOut} variant="secondary" className="w-full">Sign Out</Button>
                </div>
            </aside>
            <main className="flex-1 p-8 overflow-y-auto">
                <Routes>
                    <Route index element={<AdminDashboard />} />
                    <Route path="appointments" element={<AdminAppointments />} />
                    <Route path="services" element={<AdminServices />} />
                    <Route path="availability" element={<AdminAvailability />} />
                    <Route path="clients" element={<AdminClients />} />
                </Routes>
            </main>
        </div>
    );
};

export default AdminPortal;
