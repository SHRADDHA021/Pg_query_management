import { useEffect, useState } from 'react';
import { PageHeader, LoadingSpinner, EmptyState, StatusBadge, Modal } from '../../components/UI';
import { roomService } from '../../services';
import { Building2, Plus, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [form, setForm] = useState({
    roomNumber: '',
    capacity: 2,
    floor: 1,
    type: 'DOUBLE',
    monthlyRent: 5000.0,
    description: ''
  });

  const fetchRooms = async () => {
    try {
      const response = await roomService.getAllRooms();
      setRooms(response.data.data);
    } catch (err) {
      toast.error('Failed to load rooms list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleCreateClick = () => {
    setIsEditing(false);
    setForm({
      roomNumber: '',
      capacity: 2,
      floor: 1,
      type: 'DOUBLE',
      monthlyRent: 5000.0,
      description: ''
    });
    setModalOpen(true);
  };

  const handleEditClick = (room) => {
    setIsEditing(true);
    setSelectedRoomId(room.id);
    setForm({
      roomNumber: room.roomNumber,
      capacity: room.capacity,
      floor: room.floor,
      type: room.type,
      monthlyRent: room.monthlyRent,
      description: room.description || ''
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await roomService.updateRoom(selectedRoomId, form);
        toast.success('Room updated successfully');
      } else {
        await roomService.createRoom(form);
        toast.success('Room created successfully');
      }
      setModalOpen(false);
      fetchRooms();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this room? It must be vacant.')) return;
    try {
      await roomService.deleteRoom(id);
      toast.success('Room deleted successfully');
      fetchRooms();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot delete room');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="PG Room Inventory Management" 
        subtitle="Control room listings, assign capacities, modify rent, and check live occupancy statistics."
        action={
          <button onClick={handleCreateClick} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Room
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...rooms]
          .sort((a, b) => String(a.roomNumber).localeCompare(String(b.roomNumber), undefined, { numeric: true }))
          .map((room) => (
          <div key={room.id} className="glass-card p-6 flex flex-col justify-between" style={{ transition: 'border-color 0.3s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(245,158,11,0.35)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(161,120,5,0.20)'}
          >
            <div>
              <div className="flex justify-between items-start mb-4 pb-2 border-b border-white/5">
                <div>
                  <span className="text-xs font-bold text-gray-500 block">Floor {room.floor}</span>
                  <h3 className="text-xl font-bold text-white">Room {room.roomNumber}</h3>
                </div>
                <StatusBadge status={room.occupancyStatus} type="room" />
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Type</span>
                  <span className="font-semibold text-white">{room.type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Occupancy</span>
                  <span className="font-semibold text-white">
                    {room.occupiedCount} / {room.capacity} beds filled
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Monthly Rent</span>
                  <span style={{ fontWeight: 700, color: '#f59e0b' }}>₹{room.monthlyRent}</span>
                </div>
                {room.description && (
                  <p className="text-gray-500 text-xs italic line-clamp-2 mt-2 pt-2 border-t border-white/5">
                    {room.description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 border-t border-white/5 pt-4 mt-auto">
              <button
                onClick={() => handleEditClick(room)}
                className="btn-secondary flex-1 py-1.5 px-3 flex items-center justify-center gap-1.5 text-xs text-gray-400 hover:text-white"
              >
                <Edit className="w-3.5 h-3.5" /> Edit
              </button>
              {room.occupiedCount === 0 && (
                <button
                  onClick={() => handleDelete(room.id)}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-400 py-1.5 px-3 rounded-xl transition-all duration-200 border border-red-500/20 hover:border-red-500/30 flex items-center justify-center text-xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {rooms.length === 0 && (
        <EmptyState 
          icon={Building2} 
          title="No rooms added yet" 
          description="Click the Add Room button in the top right to start adding PG rooms." 
        />
      )}

      {/* Room CRUD Modal */}
      <Modal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        title={isEditing ? 'Modify Room Info' : 'Add New PG Room'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Room Number</label>
              <input
                type="text"
                placeholder="E.g. 101"
                className="input-field"
                value={form.roomNumber}
                onChange={(e) => setForm({ ...form, roomNumber: e.target.value })}
                required
                disabled={isEditing}
              />
            </div>

            <div>
              <label className="form-label">Floor</label>
              <input
                type="number"
                placeholder="E.g. 1"
                className="input-field"
                value={form.floor}
                onChange={(e) => setForm({ ...form, floor: parseInt(e.target.value) || 0 })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Room Capacity</label>
              <input
                type="number"
                placeholder="E.g. 2"
                className="input-field"
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: parseInt(e.target.value) || 1 })}
                required
              />
            </div>

            <div>
              <label className="form-label">Room Type</label>
              <select
                className="select-field"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="SINGLE">Single</option>
                <option value="DOUBLE">Double</option>
                <option value="TRIPLE">Triple</option>
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">Monthly Rent (₹)</label>
            <input
              type="number"
              placeholder="E.g. 5000"
              className="input-field"
              value={form.monthlyRent}
              onChange={(e) => setForm({ ...form, monthlyRent: parseFloat(e.target.value) || 0.0 })}
              required
            />
          </div>

          <div>
            <label className="form-label">Description / Features</label>
            <textarea
              className="input-field min-h-[80px]"
              placeholder="E.g. Ground floor, Garden view, AC included"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {isEditing ? 'Save Changes' : 'Create Room'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
