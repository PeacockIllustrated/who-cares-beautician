
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { auth } from '../lib/firebase';
import Button from '../components/ui/Button';
import AdminDashboard from './AdminDashboard';
import ClientDashboard from './ClientDashboard';

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const { isAdmin } = useAuth();

    const handleSignOut = async () => {
        try {
            await auth.signOut();
            navigate('/login');
        } catch (error) {
            console.error("Failed to sign out:", error);
        }
    };

    return (
        <div className="min-h-screen bg-light-gray">
            <header className="bg-white shadow-soft sticky top-0 z-10">
                <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <span className="font-bold text-xl text-primary">Who Cares</span>
                        </div>
                        <div>
                            <Button onClick={handleSignOut} variant="secondary" size="sm">Sign Out</Button>
                        </div>
                    </div>
                </nav>
            </header>
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {isAdmin ? <AdminDashboard /> : <ClientDashboard />}
            </main>
        </div>
    );
};

export default HomePage;
