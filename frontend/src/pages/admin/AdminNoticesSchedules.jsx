import { useEffect, useState } from 'react';
import { PageHeader, LoadingSpinner, EmptyState, Modal } from '../../components/UI';
import { noticeService, electricityService } from '../../services';
import { Megaphone, Zap, Pin, Clock, Calendar, MapPin, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function AdminNoticesSchedules() {
  const [activeTab, setActiveTab] = useState('notices');
  const [notices, setNotices] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  // Notice Form State
  const [noticeModalOpen, setNoticeModalOpen] = useState(false);
  const [noticeForm, setNoticeForm] = useState({ title: '', content: '', pinned: false });

  // Schedule Form State
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    affectedAreas: ''
  });

  const fetchData = async () => {
    try {
      const [noticesRes, schedulesRes] = await Promise.all([
        noticeService.getAllNotices(),
        electricityService.getAllSchedules()
      ]);
      setNotices(noticesRes.data.data);
      setSchedules(schedulesRes.data.data);
    } catch (err) {
      toast.error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateNotice = async (e) => {
    e.preventDefault();
    try {
      await noticeService.createNotice(noticeForm);
      toast.success('Notice posted and residents notified via email!');
      setNoticeModalOpen(false);
      setNoticeForm({ title: '', content: '', pinned: false });
      fetchData();
    } catch (err) {
      toast.error('Failed to publish notice');
    }
  };

  const handleCreateSchedule = async (e) => {
    e.preventDefault();
    try {
      await electricityService.createSchedule(scheduleForm);
      toast.success('Electricity schedule announced and residents notified!');
      setScheduleModalOpen(false);
      setScheduleForm({ title: '', description: '', startTime: '', endTime: '', affectedAreas: '' });
      fetchData();
    } catch (err) {
      toast.error('Failed to publish schedule');
    }
  };

  const handleDeleteNotice = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) return;
    try {
      await noticeService.deleteNotice(id);
      toast.success('Notice deleted');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete notice');
    }
  };

  const handleDeleteSchedule = async (id) => {
    if (!window.confirm('Are you sure you want to delete this schedule?')) return;
    try {
      await electricityService.deleteSchedule(id);
      toast.success('Schedule deleted');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete schedule');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="Updates & Bulletins Console" 
        subtitle="Publish notices or announce scheduled power shutdowns. Verified students will receive automated email alerts." 
        action={
          activeTab === 'notices' ? (
            <button onClick={() => setNoticeModalOpen(true)} className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" /> Post Notice
            </button>
          ) : (
            <button onClick={() => setScheduleModalOpen(true)} className="btn-success flex items-center gap-2 text-white">
              <Plus className="w-4 h-4" /> Announce Shutdown
            </button>
          )
        }
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
            description="Use the button above to broadcast your first notice." 
          />
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {notices.map((notice) => (
              <div 
                key={notice.id} 
                className={`glass-card p-6 border transition-all duration-300 relative overflow-hidden ${
                  notice.pinned 
                    ? 'border-primary-500/30 bg-primary-950/10' 
                    : 'border-white/5 hover:border-white/10'
                }`}
              >
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
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 flex items-center gap-1.5 whitespace-nowrap bg-white/5 px-3 py-1 rounded-full border border-white/5">
                      <Calendar className="w-3.5 h-3.5" />
                      {format(new Date(notice.createdAt), 'dd MMM yyyy')}
                    </span>
                    <button
                      onClick={() => handleDeleteNotice(notice.id)}
                      className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg transition-colors"
                      title="Delete notice"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
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
            icon={Zap} 
            title="No shutdowns planned" 
            description="Use the button above to announce a schedule." 
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
                      <button
                        onClick={() => handleDeleteSchedule(sched.id)}
                        className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg transition-colors flex-shrink-0"
                        title="Delete schedule"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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

      {/* Notice Board Modal */}
      <Modal isOpen={noticeModalOpen} onClose={() => setNoticeModalOpen(false)} title="Publish Notice">
        <form onSubmit={handleCreateNotice} className="space-y-4">
          <div>
            <label className="form-label">Notice Title</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="E.g. Independence Day Celebration"
              value={noticeForm.title}
              onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="form-label">Notice Content</label>
            <textarea 
              className="input-field min-h-[150px]" 
              placeholder="Write the full detail here..."
              value={noticeForm.content}
              onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })}
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="pinned"
              className="w-4 h-4 rounded border-white/10 text-primary-600 focus:ring-primary-500 bg-dark-700"
              checked={noticeForm.pinned}
              onChange={(e) => setNoticeForm({ ...noticeForm, pinned: e.target.checked })}
            />
            <label htmlFor="pinned" className="text-sm font-medium text-gray-300 select-none cursor-pointer">
              Pin notice to top
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setNoticeModalOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Publish & Email Residents
            </button>
          </div>
        </form>
      </Modal>

      {/* Electricity Schedule Modal */}
      <Modal isOpen={scheduleModalOpen} onClose={() => setScheduleModalOpen(false)} title="Announce Electricity Shutdown">
        <form onSubmit={handleCreateSchedule} className="space-y-4">
          <div>
            <label className="form-label">Event/Shutdown Title</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="E.g. Grid Maintenance & Inverter Install"
              value={scheduleForm.title}
              onChange={(e) => setScheduleForm({ ...scheduleForm, title: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="form-label">Description (Optional)</label>
            <textarea 
              className="input-field min-h-[80px]" 
              placeholder="E.g. Shutdown is for installing solar panel inverters."
              value={scheduleForm.description}
              onChange={(e) => setScheduleForm({ ...scheduleForm, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Start Time</label>
              <input 
                type="datetime-local" 
                className="input-field"
                value={scheduleForm.startTime}
                onChange={(e) => setScheduleForm({ ...scheduleForm, startTime: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="form-label">End Time</label>
              <input 
                type="datetime-local" 
                className="input-field"
                value={scheduleForm.endTime}
                onChange={(e) => setScheduleForm({ ...scheduleForm, endTime: e.target.value })}
                required
              />
            </div>
          </div>
          <div>
            <label className="form-label">Affected Rooms / Floor</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="E.g. Floor 2 & 3, Block B (or leave empty for All)"
              value={scheduleForm.affectedAreas}
              onChange={(e) => setScheduleForm({ ...scheduleForm, affectedAreas: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setScheduleModalOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-success text-white">
              Announce & Email Residents
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
