import { useEffect, useState } from 'react';
import { PageHeader, StatsCard, LoadingSpinner } from '../../components/UI';
import { adminService, noticeService, electricityService } from '../../services';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [notices, setNotices] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [statsRes, noticesRes, schedulesRes] = await Promise.all([
        adminService.getDashboardStats(),
        noticeService.getAllNotices(),
        electricityService.getAllSchedules()
      ]);
      setStats(statsRes.data.data);
      setNotices(noticesRes.data.data.slice(0, 3)); // show top 3
      setSchedules(schedulesRes.data.data.slice(0, 3)); // show top 3
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

      {/* 2-Column Section for Notices & Schedules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Notice Board */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-6">Recent Notices</h2>
          {notices.length === 0 ? (
            <p className="text-gray-500 italic text-sm">No notices published.</p>
          ) : (
            <div className="space-y-4">
              {notices.map((n) => (
                <div key={n.id} className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-white">{n.title}</span>
                    {n.pinned && (
                      <span className="text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                        Pinned
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm line-clamp-3 mb-2">{n.content}</p>
                  <p className="text-gray-500 text-xs">
                    {n.createdAt ? format(new Date(n.createdAt), 'dd MMM yyyy, hh:mm a') : 'N/A'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Electricity Shutdown Schedules */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-6">Electricity Schedules</h2>
          {schedules.length === 0 ? (
            <p className="text-gray-500 italic text-sm">No upcoming shutdowns scheduled.</p>
          ) : (
            <div className="space-y-4">
              {schedules.map((s) => (
                <div key={s.id} className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <span className="font-semibold text-white block mb-2">{s.title}</span>
                  <p className="text-gray-400 text-sm mb-2">{s.description}</p>
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>
                      <strong>Time:</strong> {s.startTime ? format(new Date(s.startTime), 'dd MMM, hh:mm a') : 'N/A'} - {s.endTime ? format(new Date(s.endTime), 'hh:mm a') : 'N/A'}
                    </p>
                    {s.affectedAreas && (
                      <p>
                        <strong>Areas:</strong> <span className="text-amber-400/80">{s.affectedAreas}</span>
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
