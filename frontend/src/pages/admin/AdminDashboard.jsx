import { useEffect, useState } from 'react';
import { PageHeader, StatsCard, LoadingSpinner } from '../../components/UI';
import { adminService } from '../../services';
import { Users, Building2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const statsRes = await adminService.getDashboardStats();
      setStats(statsRes.data.data);
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

  const totalRooms = stats?.totalRooms || 1;
  const vacantPct = Math.round(((stats?.vacantRooms || 0) / totalRooms) * 100);
  const fullPct   = Math.round(((stats?.fullRooms   || 0) / totalRooms) * 100);

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader 
        title="Admin Control Center" 
        subtitle="Monitor occupancy, complaints, and resident status at a glance." 
      />

      {/* Stats Grid — 3 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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
          color="warning"
          subtitle={`${stats?.openComplaints || 0} open • ${stats?.inProgressComplaints || 0} in progress`}
        />
      </div>

      {/* Room Occupancy Card */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary-400" />
          Room Occupancy Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Vacant bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm font-medium">Vacant Rooms</span>
              <span className="text-emerald-400 font-bold text-lg">{stats?.vacantRooms || 0} <span className="text-xs text-gray-500">/ {stats?.totalRooms || 0}</span></span>
            </div>
            <div className="w-full bg-dark-900 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-3 rounded-full transition-all duration-700"
                style={{ width: `${vacantPct}%` }}
              />
            </div>
            <p className="text-gray-600 text-xs mt-1">{vacantPct}% of total rooms</p>
          </div>

          {/* Full bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm font-medium">Full Rooms</span>
              <span className="text-red-400 font-bold text-lg">{stats?.fullRooms || 0} <span className="text-xs text-gray-500">/ {stats?.totalRooms || 0}</span></span>
            </div>
            <div className="w-full bg-dark-900 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-red-500 to-rose-400 h-3 rounded-full transition-all duration-700"
                style={{ width: `${fullPct}%` }}
              />
            </div>
            <p className="text-gray-600 text-xs mt-1">{fullPct}% of total rooms</p>
          </div>
        </div>
      </div>
    </div>
  );
}
