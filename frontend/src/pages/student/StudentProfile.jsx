import { useAuth } from '../../context/AuthContext';
import { PageHeader } from '../../components/UI';
import { User, Phone, MapPin, ShieldCheck, Home, CreditCard, Hash } from 'lucide-react';

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
  const { user } = useAuth();

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader
        title="My Profile"
        subtitle="Your registered account details and room information."
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }} className="lg:grid-cols-3-custom">
        <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: '1fr 2fr' }}>
          {/* Left Card: Avatar */}
          <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <div style={{
              width: '6rem', height: '6rem', borderRadius: '9999px',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem', fontWeight: 800, color: '#000', marginBottom: '1rem',
              boxShadow: '0 8px 25px rgba(245,158,11,0.25)'
            }}>
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', margin: '0 0 0.25rem' }}>{user?.name}</h2>
            <p style={{ color: '#f59e0b', fontSize: '0.875rem', fontFamily: 'monospace', fontWeight: 500, marginBottom: '1rem' }}>@{user?.username}</p>

            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: 'rgba(5,150,105,0.10)', border: '1px solid rgba(5,150,105,0.25)',
              padding: '0.375rem 0.875rem', borderRadius: '9999px',
              color: '#34d399', fontSize: '0.875rem', fontWeight: 600
            }}>
              <ShieldCheck style={{ width: '1rem', height: '1rem' }} />
              <span>Verified Resident</span>
            </div>

            {user?.rentStatus && (
              <div style={{
                marginTop: '0.75rem',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                background: user.rentStatus === 'Paid' ? 'rgba(5,150,105,0.10)' : 'rgba(245,158,11,0.10)',
                border: `1px solid ${user.rentStatus === 'Paid' ? 'rgba(5,150,105,0.25)' : 'rgba(245,158,11,0.25)'}`,
                padding: '0.375rem 0.875rem', borderRadius: '9999px',
                color: user.rentStatus === 'Paid' ? '#34d399' : '#fbbf24',
                fontSize: '0.875rem', fontWeight: 600
              }}>
                <CreditCard style={{ width: '1rem', height: '1rem' }} />
                <span>Rent: {user.rentStatus}</span>
              </div>
            )}
          </div>

          {/* Right Card: Fields */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#fff', borderBottom: '1px solid rgba(161,120,5,0.20)', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
              Personal & PG Details
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <Field icon={Hash} label="Login ID / Username">
                <span style={{ fontFamily: 'monospace', color: '#fbbf24' }}>{user?.username}</span>
              </Field>

              <Field icon={User} label="Role">
                {user?.role}
              </Field>

              <Field icon={Home} label="Assigned Room">
                {user?.roomNumber ? `Room ${user.roomNumber}` : 'Not Assigned'}
                {user?.floor && (
                  <span style={{ color: '#6b7280', fontSize: '0.75rem', display: 'block' }}>Floor: {user.floor} • {user.roomType}</span>
                )}
              </Field>

              <Field icon={Phone} label="Phone Number">
                {user?.phone || 'N/A'}
              </Field>

              {user?.address && (
                <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <MapPin style={{ width: '1.25rem', height: '1.25rem', color: '#f59e0b', marginTop: '0.125rem', flexShrink: 0 }} />
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#9ca3af', display: 'block', marginBottom: '0.125rem' }}>Permanent Address</span>
                    <span style={{ fontWeight: 600, color: '#fff' }}>{user.address}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
