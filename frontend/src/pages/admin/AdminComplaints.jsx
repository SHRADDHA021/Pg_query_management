import { useEffect, useState } from 'react';
import { PageHeader, LoadingSpinner, EmptyState, StatusBadge, Modal } from '../../components/UI';
import { complaintService } from '../../services';
import { AlertCircle, Eye, CheckCircle2, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [adminNote, setAdminNote] = useState('');
  const [status, setStatus] = useState('OPEN');

  const fetchComplaints = async () => {
    try {
      const response = await complaintService.getAllComplaints();
      setComplaints(response.data.data);
    } catch (err) {
      toast.error('Failed to load complaints registry');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleReviewClick = (complaint) => {
    setSelectedComplaint(complaint);
    setStatus(complaint.status);
    setAdminNote(complaint.adminNote || '');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await complaintService.updateStatus(selectedComplaint.id, status, adminNote);
      toast.success('Complaint status updated and student notified!');
      setModalOpen(false);
      fetchComplaints();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="Complaints & Maintenance Tickets" 
        subtitle="Manage resident requests, assign plumbers/electricians, and write update logs." 
      />

      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-xl font-bold text-white">Maintenance Tickets Registry</h2>
        </div>

        {complaints.length === 0 ? (
          <EmptyState 
            icon={AlertCircle} 
            title="No complaints filed" 
            description="Perfect! Residents haven't submitted any complaints." 
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Resident Info</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Filed On</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div>
                        <p className="font-semibold text-white">{c.studentName}</p>
                        <p className="text-gray-500 text-xs">Room {c.roomNumber || 'N/A'} • {c.studentEmail}</p>
                      </div>
                    </td>
                    <td className="font-medium text-white">{c.category}</td>
                    <td className="max-w-xs truncate text-gray-400 text-sm">
                      {c.description}
                    </td>
                    <td>
                      <StatusBadge status={c.status} type="complaint" />
                    </td>
                    <td>
                      {format(new Date(c.createdAt), 'dd MMM yyyy')}
                    </td>
                    <td>
                      <button
                        onClick={() => handleReviewClick(c)}
                        className="text-primary-400 hover:text-primary-300 flex items-center gap-1 text-sm font-semibold transition-colors"
                      >
                        <Eye className="w-4 h-4" /> Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Complaint Modal */}
      <Modal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        title={`Review Complaint #${selectedComplaint?.id}`}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white/5 border border-white/5 rounded-xl p-4 text-sm space-y-2 mb-4">
            <p className="text-gray-400">
              <strong className="text-gray-300">From student:</strong> {selectedComplaint?.studentName} (Room {selectedComplaint?.roomNumber})
            </p>
            <p className="text-gray-400">
              <strong className="text-gray-300">Category:</strong> {selectedComplaint?.category}
            </p>
            <p className="text-gray-400">
              <strong className="text-gray-300">Description:</strong>
            </p>
            <p className="text-gray-300 bg-black/30 p-3 rounded-lg border border-white/5 font-sans leading-relaxed">
              {selectedComplaint?.description}
            </p>
          </div>

          <div>
            <label className="form-label">Ticket Status</label>
            <select
              className="select-field"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="OPEN">Open (New Ticket)</option>
              <option value="IN_PROGRESS">In Progress (Work Assigned)</option>
              <option value="RESOLVED">Resolved (Work Completed)</option>
            </select>
          </div>

          <div>
            <label className="form-label">Admin Update Log / Note to Resident</label>
            <textarea
              className="input-field min-h-[100px]"
              placeholder="E.g. Electrician scheduled for tomorrow morning 10:00 AM."
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Update Ticket
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
