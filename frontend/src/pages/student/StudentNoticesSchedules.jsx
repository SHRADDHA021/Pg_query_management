import { useEffect, useState } from 'react';
import { PageHeader, LoadingSpinner, EmptyState } from '../../components/UI';
import { noticeService, electricityService } from '../../services';
import { Megaphone, Zap, Pin, Clock, Calendar, MapPin, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

export default function StudentNoticesSchedules() {
  const [activeTab, setActiveTab] = useState('notices');
  const [notices, setNotices] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [noticesRes, schedulesRes] = await Promise.all([
        noticeService.getAllNotices(),
        electricityService.getAllSchedules()
      ]);
      setNotices(noticesRes.data.data);
      setSchedules(schedulesRes.data.data);
    } catch (err) {
      console.error('Failed to load announcements', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="Hostel Updates & Announcements" 
        subtitle="Keep track of official notice board postings and upcoming utility downtime schedules." 
      />

      {/* Tabs */}
      <div className="flex border-b border-white/5 space-x-6">
        <button
          onClick={() => setActiveTab('notices')}
          className={`pb-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all duration-200 ${
            activeTab === 'notices'
              ? 'border-primary-500 text-primary-400'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          Notice Board ({notices.length})
        </button>
        <button
          onClick={() => setActiveTab('schedules')}
          className={`pb-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all duration-200 ${
            activeTab === 'schedules'
              ? 'border-primary-500 text-primary-400'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Zap className="w-4 h-4" />
          Electricity Shutdowns ({schedules.length})
        </button>
      </div>

      {activeTab === 'notices' ? (
        notices.length === 0 ? (
          <EmptyState 
            icon={Megaphone} 
            title="Notice board is empty" 
            description="All quiet! Check back later for official announcements." 
          />
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {notices.map((notice) => (
              <div 
                key={notice.id} 
                className={`glass-card p-6 border transition-all duration-300 relative overflow-hidden ${
                  notice.pinned 
                    ? 'border-primary-500/30 bg-primary-950/10 shadow-primary-500/5' 
                    : 'border-white/5 hover:border-white/10'
                }`}
              >
                {/* Pinned Gradient Border Indicator */}
                {notice.pinned && (
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-primary-500 to-violet-600" />
                )}

                <div className="flex justify-between items-start gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    {notice.pinned && (
                      <span className="p-1.5 rounded-lg bg-primary-500/10 text-primary-400 flex items-center justify-center">
                        <Pin className="w-4 h-4 fill-primary-400" />
                      </span>
                    )}
                    <h3 className="text-lg font-bold text-white leading-snug">{notice.title}</h3>
                  </div>
                  <span className="text-xs text-gray-500 flex items-center gap-1.5 whitespace-nowrap bg-white/5 px-3 py-1 rounded-full border border-white/5">
                    <Calendar className="w-3.5 h-3.5" />
                    {format(new Date(notice.createdAt), 'dd MMM yyyy')}
                  </span>
                </div>
                <p className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed bg-black/20 p-4 rounded-xl border border-white/5">
                  {notice.content}
                </p>
              </div>
            ))}
          </div>
        )
      ) : (
        schedules.length === 0 ? (
          <EmptyState 
            icon={AlertTriangle} 
            title="No shutdowns planned" 
            description="Power is stable! There are no scheduled outages in the queue." 
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {schedules.map((sched) => {
              const start = new Date(sched.startTime);
              const end = new Date(sched.endTime);
              const isUpcoming = start > new Date();

              return (
                <div 
                  key={sched.id} 
                  className={`glass-card p-6 border transition-all duration-300 flex flex-col justify-between ${
                    isUpcoming 
                      ? 'border-amber-500/20 hover:border-amber-500/30' 
                      : 'border-white/5 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <div>
                        {isUpcoming && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-500/10 text-amber-400 mb-2 border border-amber-500/20">
                            Upcoming Outage
                          </span>
                        )}
                        <h3 className="text-lg font-bold text-white">{sched.title}</h3>
                      </div>
                      <div className={`p-2.5 rounded-xl ${isUpcoming ? 'bg-amber-500/10 text-amber-400' : 'bg-white/5 text-gray-400'}`}>
                        <Zap className="w-5 h-5" />
                      </div>
                    </div>

                    {sched.description && (
                      <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                        {sched.description}
                      </p>
                    )}

                    <div className="space-y-2 bg-white/5 p-4 rounded-xl border border-white/5 text-sm mb-4">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Clock className="w-4 h-4 text-primary-400" />
                        <span>
                          {format(start, 'dd MMM, hh:mm a')} — {format(end, 'hh:mm a')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <MapPin className="w-4 h-4 text-primary-400" />
                        <span>Affected: <strong className="text-white">{sched.affectedAreas || 'All Rooms'}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 border-t border-white/5 pt-4 flex justify-between items-center">
                    <span>Announced on {format(new Date(sched.createdAt), 'dd MMM yyyy')}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}
