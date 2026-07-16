import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PageHeader, LoadingSpinner } from '../../components/UI';
import { User, Phone, MapPin, ShieldCheck, Home, CreditCard, Hash, RefreshCw, Calendar, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const Field = ({ icon: Icon, label, children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
    <Icon style={{ width: '1.25rem', height: '1.25rem', color: '#f59e0b', marginTop: '0.125rem', flexShrink: 0 }} />
    <div>
      <span style={{ fontSize: '0.75rem', color: '#9ca3af', display: 'block', marginBottom: '0.125rem' }}>{label}</span>
      <span style={{ fontWeight: 600, color: '#fff' }}>{children}</span>
    </div>
  </div>
);

export default function StudentProfile() {
  const { user, refreshProfile } = useAuth();
  const [profile, setProfile] = useState(user);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Fetch fresh data on mount
    handleRefresh(true);
  }, []);

  const handleRefresh = async (silent = false) => {
    setRefreshing(true);
    try {
      const fresh = await refreshProfile();
      if (fresh) setProfile(fresh);
    } catch {
      if (!silent) toast.error('Could not refresh profile');
    } finally {
      setRefreshing(false);
    }
  };

  if (!profile) return <LoadingSpinner />;

  const statusColor = profile.status === 'VERIFIED'
    ? { bg: 'rgba(5,150,105,0.10)', border: 'rgba(5,150,105,0.25)', text: '#34d399' }
    : { bg: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.25)', text: '#fbbf24' };

  const rentColor = profile.rentStatus === 'Paid'
    ? { bg: 'rgba(5,150,105,0.10)', border: 'rgba(5,150,105,0.25)', text: '#34d399' }
    : { bg: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.25)', text: '#fbbf24' };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader
        title="My Profile"
        subtitle="Your registered account details and room assignment."
        action={
          <button
            onClick={() => handleRefresh(false)}
            disabled={refreshing}
            className="btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <RefreshCw style={{ width: '1rem', height: '1rem', ...(refreshing ? { animation: 'spin 1s linear infinite' } : {}) }} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
        {/* Left Card: Avatar + Status */}
        <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>
          <div style={{
            width: '6rem', height: '6rem', borderRadius: '9999px',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2.25rem', fontWeight: 800, color: '#000',
            boxShadow: '0 8px 25px rgba(245,158,11,0.25)'
          }}>
            {profile?.name?.charAt(0)?.toUpperCase()}
          </div>

          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', margin: '0 0 0.25rem' }}>{profile?.name}</h2>
            <p style={{ color: '#f59e0b', fontSize: '0.875rem', fontFamily: 'monospace', fontWeight: 500 }}>@{profile?.username}</p>
          </div>

          {/* Verification badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: statusColor.bg, border: `1px solid ${statusColor.border}`,
            padding: '0.375rem 0.875rem', borderRadius: '9999px',
            color: statusColor.text, fontSize: '0.8rem', fontWeight: 600
          }}>
            <ShieldCheck style={{ width: '1rem', height: '1rem' }} />
            <span>{profile?.status === 'VERIFIED' ? 'Verified Resident' : profile?.status}</span>
          </div>

          {/* Rent status */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: rentColor.bg, border: `1px solid ${rentColor.border}`,
            padding: '0.375rem 0.875rem', borderRadius: '9999px',
            color: rentColor.text, fontSize: '0.8rem', fontWeight: 600
          }}>
            <CreditCard style={{ width: '1rem', height: '1rem' }} />
            <span>Rent: {profile?.rentStatus || 'Pending'}</span>
          </div>

          {/* Room info box */}
          {profile?.roomNumber ? (
            <div style={{
              width: '100%', background: 'rgba(245,158,11,0.07)',
              border: '1px solid rgba(245,158,11,0.20)', borderRadius: '0.75rem',
              padding: '0.875rem', textAlign: 'center'
            }}>
              <Home style={{ width: '1.25rem', height: '1.25rem', color: '#f59e0b', margin: '0 auto 0.375rem' }} />
              <p style={{ color: '#9ca3af', fontSize: '0.7rem', marginBottom: '0.2rem' }}>Assigned Room</p>
              <p style={{ color: '#fff', fontWeight: 800, fontSize: '1.25rem' }}>Room {profile.roomNumber}</p>
              <p style={{ color: '#6b7280', fontSize: '0.75rem' }}>
                Floor {profile.floor} • {profile.roomType}
              </p>
            </div>
          ) : (
            <div style={{
              width: '100%', background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)', borderRadius: '0.75rem',
              padding: '0.875rem', textAlign: 'center'
            }}>
              <Home style={{ width: '1.25rem', height: '1.25rem', color: '#6b7280', margin: '0 auto 0.375rem' }} />
              <p style={{ color: '#6b7280', fontSize: '0.8rem' }}>Room not yet assigned</p>
            </div>
          )}
        </div>

        {/* Right Card: Details */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{
            fontSize: '1rem', fontWeight: 700, color: '#fff',
            borderBottom: '1px solid rgba(161,120,5,0.20)',
            paddingBottom: '0.75rem', marginBottom: '1.75rem'
          }}>
            Personal &amp; PG Details
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.75rem' }}>
            <Field icon={Hash} label="Login ID / Username">
              <span style={{ fontFamily: 'monospace', color: '#fbbf24' }}>{profile?.username}</span>
            </Field>

            <Field icon={User} label="Role">
              {profile?.role}
            </Field>

            <Field icon={Phone} label="Phone Number">
              {profile?.phone || <span style={{ color: '#6b7280', fontStyle: 'italic' }}>Not provided</span>}
            </Field>

            <Field icon={Users} label="Age">
              {profile?.age ? `${profile.age} years` : <span style={{ color: '#6b7280', fontStyle: 'italic' }}>Not provided</span>}
            </Field>

            <Field icon={Calendar} label="Joined Date">
              {profile?.joinedDate
                ? new Date(profile.joinedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
                : <span style={{ color: '#6b7280', fontStyle: 'italic' }}>N/A</span>}
            </Field>

            <Field icon={Phone} label="Emergency Contact">
              {profile?.emergencyContact || <span style={{ color: '#6b7280', fontStyle: 'italic' }}>Not provided</span>}
            </Field>

            {profile?.address && (
              <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <MapPin style={{ width: '1.25rem', height: '1.25rem', color: '#f59e0b', marginTop: '0.125rem', flexShrink: 0 }} />
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#9ca3af', display: 'block', marginBottom: '0.125rem' }}>Permanent Address</span>
                  <span style={{ fontWeight: 600, color: '#fff' }}>{profile.address}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
