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
          label="Total Residents" 
          value={stats?.totalStudents || 0} 
          color="primary"
          subtitle={`${stats?.verifiedStudents || 0} verified • ${stats?.pendingVerifications || 0} pending`}
        />
        <StatsCard 
          label="Total Rooms" 
          value={stats?.totalRooms || 0} 
          color="success"
          subtitle={`${stats?.vacantRooms || 0} vacant • ${stats?.fullRooms || 0} completely full`}
        />
        <StatsCard 
          label="Pending Complaints" 
          value={(stats?.openComplaints || 0) + (stats?.inProgressComplaints || 0)} 
          color="warning"
          subtitle={`${stats?.openComplaints || 0} open • ${stats?.inProgressComplaints || 0} in progress`}
        />
      </div>
    </div>
  );
}
