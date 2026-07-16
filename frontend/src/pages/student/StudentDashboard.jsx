import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PageHeader, StatsCard, LoadingSpinner, EmptyState, StatusBadge } from '../../components/UI';
import { complaintService, messService } from '../../services';
import { AlertCircle, Utensils, Home, Bell, CreditCard } from 'lucide-react';
import { format } from 'date-fns';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    recentComplaints: [],
    todayMeals: {}
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [complaintsRes, messRes] = await Promise.all([
          complaintService.getMyComplaints(),
          messService.getCurrentMenu()
        ]);

        const todayName = format(new Date(), 'EEEE').toUpperCase();
        const menuItems = messRes?.data?.data ?? [];
        const todayMeals = menuItems.reduce((acc, item) => {
          if (item.dayOfWeek === todayName) {
            acc[item.mealType] = item.menuItems;
          }
          return acc;
        }, {});

        setData({
          recentComplaints: complaintsRes?.data?.data?.slice(0, 3) ?? [],
          todayMeals
        });
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title={`Welcome, ${user?.name}`}
        subtitle={`Login ID: ${user?.username} • Room: ${user?.roomNumber || 'Not Assigned'} • Status: ${user?.status}`}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          icon={Home}
          label="My Room"
          value={user?.roomNumber ? `Room ${user.roomNumber}` : 'Not Assigned'}
          color="primary"
          subtitle={`Floor: ${user?.floor || 'N/A'} • Type: ${user?.roomType || 'N/A'}`}
        />
        <StatsCard
          icon={CreditCard}
          label="Rent Status"
          value={user?.rentStatus || 'Pending'}
          color={user?.rentStatus === 'Paid' ? 'success' : 'warning'}
          subtitle={user?.rentStatus === 'Paid' ? 'All dues cleared' : 'Payment due'}
        />
        <StatsCard
          icon={AlertCircle}
          label="My Complaints"
          value={data.recentComplaints.filter(c => c.status !== 'RESOLVED' && c.status !== 'CLOSED').length}
          color="info"
          subtitle="Unresolved complaints"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Mess Menu */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <Utensils className="w-5 h-5 text-primary-400" />
            <h2 className="text-xl font-bold text-white">Today's Mess Menu</h2>
            <span className="ml-auto text-xs text-gray-500">{format(new Date(), 'EEEE, dd MMM')}</span>
          </div>
          <div className="space-y-4">
            {['BREAKFAST', 'LUNCH', 'DINNER'].map((meal) => (
              <div key={meal} className="flex justify-between items-start py-3 border-b border-white/5 last:border-0">
                <div>
                  <span className="text-xs font-semibold text-primary-400 uppercase tracking-wider block mb-1">
                    {meal}
                  </span>
                  <p className="text-gray-200">
                    {data.todayMeals[meal] || <span className="text-gray-500 italic">Menu not set</span>}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Complaints */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <AlertCircle className="w-5 h-5 text-primary-400" />
            <h2 className="text-xl font-bold text-white">Recent Complaints</h2>
          </div>
          {data.recentComplaints.length === 0 ? (
            <EmptyState title="No complaints raised" description="If you face any issues, feel free to report them." />
          ) : (
            <div className="space-y-4">
              {data.recentComplaints.map((c) => (
                <div key={c.id} className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-white">{c.category}</span>
                    <StatusBadge status={c.status} type="complaint" />
                  </div>
                  <p className="text-gray-400 text-sm line-clamp-2 mb-2">{c.description}</p>
                  <p className="text-gray-500 text-xs">{format(new Date(c.createdAt), 'dd MMM yyyy, hh:mm a')}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
