
import React from 'react';

const AdminDashboard: React.FC = () => {
  // Placeholder components for admin sections
  const AdminDashboard = () => <div className="p-6 bg-white rounded-xl shadow-soft">Admin Dashboard Overview - KPIs would go here.</div>;
  const AdminAppointments = () => <div className="p-6 bg-white rounded-xl shadow-soft">Manage Appointments - Upcoming/Completed lists with filters.</div>;
  const AdminServices = () => <div className="p-6 bg-white rounded-xl shadow-soft">Manage Services - CRUD interface for services.</div>;

  return (
    <div className="space-y-6">
       <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AdminDashboard />
          <AdminAppointments />
          <AdminServices />
       </div>
    </div>
  );
};

export default AdminDashboard;
