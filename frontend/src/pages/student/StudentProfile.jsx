import { useAuth } from '../../context/AuthContext';
import { PageHeader, StatsCard } from '../../components/UI';
import { User, Mail, Phone, MapPin, Calendar, ShieldCheck, Home } from 'lucide-react';
import { format } from 'date-fns';

export default function StudentProfile() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="My Profile" 
        subtitle="Manage your registered account details and contact information." 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Card: Avatar and status */}
        <div className="glass-card p-6 flex flex-col items-center justify-center text-center border border-white/5">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center text-3xl font-extrabold text-white mb-4 shadow-lg shadow-primary-500/20">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <h2 className="text-xl font-bold text-white mb-1">{user?.name}</h2>
          <p className="text-primary-400 text-sm font-medium mb-4">{user?.email}</p>

          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full text-emerald-400 text-sm font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Verified Resident</span>
          </div>
        </div>

        {/* Right Card: Fields */}
        <div className="glass-card p-8 lg:col-span-2 border border-white/5 space-y-6">
          <h3 className="text-lg font-bold text-white border-b border-white/5 pb-3">Personal & PG Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <span className="text-xs text-gray-400 block mb-0.5">Role Type</span>
                <span className="font-semibold text-white">{user?.role}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Home className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <span className="text-xs text-gray-400 block mb-0.5">Assigned Room</span>
                <span className="font-semibold text-white">Room {user?.roomNumber || 'Not Assigned'}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <span className="text-xs text-gray-400 block mb-0.5">Phone Number</span>
                <span className="font-semibold text-white">{user?.phone || 'N/A'}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <span className="text-xs text-gray-400 block mb-0.5">Emergency Contact</span>
                <span className="font-semibold text-white">{user?.emergencyContact || 'N/A'}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <span className="text-xs text-gray-400 block mb-0.5">Joined Date</span>
                <span className="font-semibold text-white">
                  {user?.joinedDate ? format(new Date(user.joinedDate), 'dd MMMM yyyy') : 'N/A'}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 md:col-span-2">
              <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <span className="text-xs text-gray-400 block mb-0.5">Permanent Address</span>
                <span className="font-semibold text-white">{user?.address || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
