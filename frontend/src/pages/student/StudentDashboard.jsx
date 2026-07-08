import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { PageHeader, StatsCard, LoadingSpinner, EmptyState, StatusBadge } from '../components/UI';
import { complaintService, feeService, messService } from '../services';
import { AlertCircle, CreditCard, Utensils, Home, Bell } from 'lucide-react';
import { format } from 'date-fns';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    recentComplaints: [],
    recentFees: [],
    todayMeals: {}
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [complaintsRes, feesRes, messRes] = await Promise.all([
          complaintService.getMyComplaints(),
          feeService.getMyFees(),
          messService.getCurrentMenu()
        ]);

        const todayName = format(new Date(), 'EEEE').toUpperCase();
        const todayMeals = messRes.data.data.reduce((acc, item) => {
          if (item.dayOfWeek === todayName) {
            acc[item.mealType] = item.menuItems;
          }
          return acc;
        }, {});

        setData({
          recentComplaints: complaintsRes.data.data.slice(0, 3),
          recentFees: feesRes.data.data.slice(0, 3),
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

  if (user?.status !== 'VERIFIED') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="glass-card p-8 max-w-lg text-center animate-fade-in">
          <div className="w-16 h-16 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Bell className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Verification Pending ⏳</h1>
          <p className="text-gray-400 mb-6">
            Welcome to the PG Management System, <strong>{user?.name}</strong>! Your account has been registered using your email.
            Before you can access the portal features, an Admin must verify your profile and assign you a room.
          </p>
          <div className="bg-white/5 rounded-xl p-4 text-sm text-gray-500">
            Please contact the hostel management team if it takes longer than 24 hours.
          </div>
        </div>
      </div>
    );
  }

  // Calculate unpaid/overdue fees total
  const outstandingAmount = data.recentFees
    .filter(f => f.status !== 'PAID')
    .reduce((sum, f) => sum + f.amount, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader 
        title={`Welcome, ${user.name}`} 
        subtitle={`Room No: ${user.roomNumber || 'Not Assigned'} • Status: ${user.status}`} 
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard 
          icon={Home} 
          label="My Room Status" 
          value={user.roomNumber || 'None'} 
          color="primary"
          subtitle={`Floor: ${user.floor || 'N/A'} • Type: ${user.roomType || 'N/A'}`}
        />
        <StatsCard 
          icon={CreditCard} 
          label="Outstanding Rent" 
          value={`₹${outstandingAmount}`} 
          color={outstandingAmount > 0 ? 'warning' : 'success'}
          subtitle={outstandingAmount > 0 ? 'Pending dues found' : 'All clear!'}
        />
        <StatsCard 
          icon={AlertCircle} 
          label="My Complaints" 
          value={data.recentComplaints.filter(c => c.status !== 'RESOLVED').length} 
          color="info"
          subtitle="Total unresolved complaints"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Mess Menu */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <Utensils className="w-5 h-5 text-primary-400" />
            <h2 className="text-xl font-bold text-white">Today's Mess Menu</h2>
          </div>
          <div className="space-y-4">
            {['BREAKFAST', 'LUNCH', 'DINNER'].map((meal) => (
              <div key={meal} className="flex justify-between items-start py-3 border-b border-white/5 last:border-0">
                <div>
                  <span className="text-xs font-semibold text-primary-400 uppercase tracking-wider block mb-1">
                    {meal}
                  </span>
                  <p className="text-gray-200">
                    {data.todayMeals[meal] || 'No menu available yet'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Complaints */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-primary-400" />
              <h2 className="text-xl font-bold text-white">Recent Complaints</h2>
            </div>
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
