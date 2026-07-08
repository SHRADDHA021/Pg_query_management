import { useEffect, useState } from 'react';
import { PageHeader, StatsCard, LoadingSpinner, EmptyState, StatusBadge } from '../../components/UI';
import { adminService } from '../../services';
import { Users, Building2, AlertCircle, CreditCard, Clock, Bell, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [statsRes, pendingRes] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getPendingStudents()
      ]);
      setStats(statsRes.data.data);
      setPending(pendingRes.data.data.slice(0, 5));
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader 
        title="Admin Control Center" 
        subtitle="Real-time occupancy status, registration queue, complaints statistics and fee overview." 
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          icon={Users} 
          label="Total Residents" 
          value={stats?.totalStudents || 0} 
          color="primary"
          subtitle={`${stats?.verifiedStudents || 0} verified • ${stats?.pendingVerifications || 0} pending`}
        />
        <StatsCard 
          icon={Building2} 
          label="Total Rooms" 
          value={stats?.totalRooms || 0} 
          color="success"
          subtitle={`${stats?.vacantRooms || 0} vacant • ${stats?.fullRooms || 0} completely full`}
        />
        <StatsCard 
          icon={AlertCircle} 
          label="Pending Complaints" 
          value={(stats?.openComplaints || 0) + (stats?.inProgressComplaints || 0)} 
          color="info"
          subtitle={`${stats?.openComplaints || 0} open • ${stats?.inProgressComplaints || 0} in progress`}
        />
        <StatsCard 
          icon={CreditCard} 
          label="Outstanding Fee Bills" 
          value={(stats?.unpaidFees || 0) + (stats?.overdueFees || 0)} 
          color="warning"
          subtitle={`${stats?.overdueFees || 0} overdue invoices`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pending Verification Queue */}
        <div className="glass-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-bold text-white">Pending Onboarding Requests</h2>
            </div>
            <Link 
              to="/admin/students" 
              className="text-primary-400 hover:text-primary-300 text-xs font-semibold hover:underline"
            >
              Manage Queue
            </Link>
          </div>

          {pending.length === 0 ? (
            <EmptyState 
              icon={Clock} 
              title="All caught up!" 
              description="No students waiting in the onboarding queue." 
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Email Address</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pending.map((p) => (
                    <tr key={p.id}>
                      <td className="font-semibold text-white">{p.name}</td>
                      <td>{p.email}</td>
                      <td>
                        <StatusBadge status={p.status} type="user" />
                      </td>
                      <td>
                        <Link 
                          to="/admin/students"
                          className="text-primary-400 hover:text-primary-300 text-sm font-semibold"
                        >
                          Verify & Allocate Room
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Help / Overview Summary */}
        <div className="glass-card p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Operations Overview</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Use this dashboard to coordinate operations. You can verify new student sign-ups, assign available room slots, log rent updates, change the weekly mess menu, and address complaints.
            </p>
          </div>
          <div className="p-4 bg-white/5 border border-white/5 rounded-xl text-xs text-gray-500 space-y-2">
            <p className="font-semibold text-gray-400">System Information:</p>
            <p>• Automated Rent checks run daily at 8:00 AM</p>
            <p>• Reminder emails are dispatched on the 1st of every month</p>
          </div>
        </div>
      </div>
    </div>
  );
}
