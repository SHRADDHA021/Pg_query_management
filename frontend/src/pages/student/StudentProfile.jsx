import { useAuth } from '../../context/AuthContext';
import { PageHeader } from '../../components/UI';
import { User, Phone, MapPin, Calendar, ShieldCheck, Home, CreditCard, Hash } from 'lucide-react';
import { format } from 'date-fns';

export default function StudentProfile() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="My Profile"
        subtitle="Your registered account details and room information."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Card: Avatar and status */}
        <div className="glass-card p-6 flex flex-col items-center justify-center text-center border border-white/5">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center text-3xl font-extrabold text-white mb-4 shadow-lg shadow-primary-500/20">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <h2 className="text-xl font-bold text-white mb-1">{user?.name}</h2>
          <p className="text-primary-400 text-sm font-mono font-medium mb-4">@{user?.username}</p>

          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full text-emerald-400 text-sm font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Verified Resident</span>
          </div>

          {user?.rentStatus && (
            <div className={`mt-3 flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-semibold ${
              user.rentStatus === 'Paid'
                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
            }`}>
              <CreditCard className="w-4 h-4" />
              <span>Rent: {user.rentStatus}</span>
            </div>
          )}
        </div>

        {/* Right Card: Fields */}
        <div className="glass-card p-8 lg:col-span-2 border border-white/5 space-y-6">
          <h3 className="text-lg font-bold text-white border-b border-white/5 pb-3">Personal & PG Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <Hash className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <span className="text-xs text-gray-400 block mb-0.5">Login ID / Username</span>
                <span className="font-mono font-semibold text-primary-300">{user?.username}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <span className="text-xs text-gray-400 block mb-0.5">Role</span>
                <span className="font-semibold text-white">{user?.role}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Home className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <span className="text-xs text-gray-400 block mb-0.5">Assigned Room</span>
                <span className="font-semibold text-white">
                  {user?.roomNumber ? `Room ${user.roomNumber}` : 'Not Assigned'}
                </span>
                {user?.floor && (
                  <span className="text-gray-500 text-xs block">Floor: {user.floor} • {user.roomType}</span>
                )}
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

            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <span className="text-xs text-gray-400 block mb-0.5">Age</span>
                <span className="font-semibold text-white">{user?.age ? `${user.age} years` : 'N/A'}</span>
              </div>
            </div>

            {user?.address && (
              <div className="flex items-start gap-3 md:col-span-2">
                <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <span className="text-xs text-gray-400 block mb-0.5">Permanent Address</span>
                  <span className="font-semibold text-white">{user.address}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
