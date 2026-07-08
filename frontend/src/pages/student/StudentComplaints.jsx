import { useEffect, useState } from 'react';
import { PageHeader, LoadingSpinner, EmptyState, StatusBadge, Modal } from '../../components/UI';
import { complaintService } from '../../services';
import { AlertCircle, Plus, Trash2, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function StudentComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ category: 'WIFI', description: '' });

  const fetchComplaints = async () => {
    try {
      const response = await complaintService.getMyComplaints();
      setComplaints(response.data.data);
    } catch (err) {
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await complaintService.createComplaint(form);
      toast.success('Complaint submitted successfully!');
      setModalOpen(false);
      setForm({ category: 'WIFI', description: '' });
      fetchComplaints();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit complaint');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this complaint?')) return;
    try {
      await complaintService.deleteComplaint(id);
      toast.success('Complaint deleted');
      fetchComplaints();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot delete complaint');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Raise & Track Complaints"
        subtitle="Report maintenance, wifi, cleanlines or other issues to the admin."
        action={
          <button onClick={() => setModalOpen(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Raise Complaint
          </button>
        }
      />

      {complaints.length === 0 ? (
        <EmptyState
          icon={AlertCircle}
          title="No Complaints Yet"
          description="Everything is running smoothly! If you face any issues, click the button above to raise a ticket."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {complaints.map((c) => (
            <div key={c.id} className="glass-card p-6 flex flex-col justify-between border border-white/5 hover:border-primary-500/20 transition-all duration-300">
              <div>
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div>
                    <span className="text-xs font-semibold text-primary-400 uppercase tracking-wider block mb-1">
                      Category
                    </span>
                    <h3 className="text-lg font-bold text-white">{c.category}</h3>
                  </div>
                  <StatusBadge status={c.status} type="complaint" />
                </div>
                <p className="text-gray-300 text-sm mb-4 bg-white/5 p-4 rounded-xl border border-white/5">
                  {c.description}
                </p>
                {c.adminNote && (
                  <div className="mb-4 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                    <span className="text-xs font-semibold text-amber-400 block mb-1">Admin Response</span>
                    <p className="text-gray-300 text-sm italic">"{c.adminNote}"</p>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {format(new Date(c.createdAt), 'dd MMM yyyy, hh:mm a')}
                </span>
                {c.status === 'OPEN' && (
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Raise Complaint Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="New Complaint">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Category</label>
            <select
              className="select-field"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="WIFI">Wifi / Internet</option>
              <option value="ELECTRICAL">Electrical (Lights, Fan, Switch)</option>
              <option value="PLUMBING">Plumbing / Water Supply</option>
              <option value="CLEANLINESS">Cleanliness / Housekeeping</option>
              <option value="FOOD">Food / Mess Quality</option>
              <option value="SECURITY">Security / Locks</option>
              <option value="FURNITURE">Furniture (Bed, Table, Wardrobe)</option>
              <option value="OTHER">Other Issues</option>
            </select>
          </div>

          <div>
            <label className="form-label">Description</label>
            <textarea
              className="input-field min-h-[120px]"
              placeholder="Describe your issue in detail. E.g. WiFi is down on the 2nd floor corridor since morning."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Submit Complaint
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
