import { useEffect, useState } from 'react';
import { PageHeader, LoadingSpinner, EmptyState, Modal } from '../../components/UI';
import { messService } from '../../services';
import { Utensils, Edit3, ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { format, startOfWeek, addDays, subDays } from 'date-fns';
import toast from 'react-hot-toast';

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
const MEALS = ['BREAKFAST', 'LUNCH', 'DINNER'];
const DAY_OPTIONS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

export default function AdminMessMenu() {
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [menu, setMenu] = useState({});
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState('MONDAY');
  const [selectedMeal, setSelectedMeal] = useState('BREAKFAST');
  const [menuItemsText, setMenuItemsText] = useState('');

  const fetchMenu = async (weekDate) => {
    setLoading(true);
    try {
      const formattedDate = format(weekDate, 'yyyy-MM-dd');
      const response = await messService.getMenuByWeek(formattedDate);
      
      const groupedMenu = response.data.data.reduce((acc, item) => {
        if (!acc[item.dayOfWeek]) acc[item.dayOfWeek] = {};
        acc[item.dayOfWeek][item.mealType] = {
          id: item.id,
          text: item.menuItems
        };
        return acc;
      }, {});
      setMenu(groupedMenu);
    } catch (err) {
      toast.error('Failed to load mess schedule');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu(currentWeekStart);
  }, [currentWeekStart]);

  const handlePrevWeek = () => {
    setCurrentWeekStart(subDays(currentWeekStart, 7));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, 7));
  };

  const handleEditClick = (day, meal, existingText = '') => {
    setSelectedDay(day);
    setSelectedMeal(meal);
    setMenuItemsText(existingText);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const weekStartFormatted = format(currentWeekStart, 'yyyy-MM-dd');
      await messService.saveMenuItem(weekStartFormatted, {
        dayOfWeek: selectedDay,
        mealType: selectedMeal,
        menuItems: menuItemsText
      });
      toast.success('Mess schedule item updated!');
      setModalOpen(false);
      fetchMenu(currentWeekStart);
    } catch (err) {
      toast.error('Failed to save changes');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="Weekly Mess Menu Editor" 
        subtitle="Manage food selections for PG residents. Double check ingredients before dispatching." 
        action={
          <div className="flex items-center gap-3 bg-dark-800/80 px-4 py-2 border border-white/5 rounded-xl">
            <button onClick={handlePrevWeek} className="text-gray-400 hover:text-white transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-semibold text-white whitespace-nowrap">
              Week of {format(currentWeekStart, 'dd MMM yyyy')}
            </span>
            <button onClick={handleNextWeek} className="text-gray-400 hover:text-white transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        }
      />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {DAY_OPTIONS.map((day) => {
            const dayMeals = menu[day] || {};
            const isToday = format(new Date(), 'EEEE').toUpperCase() === day;
            return (
              <div 
                key={day} 
                className={`glass-card p-6 border ${isToday ? 'border-primary-500/40 ring-1 ring-primary-500/30' : 'border-white/5'} flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
                    <h3 className="font-bold text-lg text-white">{day}</h3>
                    {isToday && (
                      <span className="bg-primary-500/20 border border-primary-500/30 text-primary-400 text-xs font-semibold px-2 py-0.5 rounded-md">
                        Today
                      </span>
                    )}
                  </div>

                  <div className="space-y-4 mb-4">
                    {MEALS.map((meal) => {
                      const mealObj = dayMeals[meal] || {};
                      return (
                        <div key={meal} className="space-y-1 relative group">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-primary-400 tracking-wider uppercase">
                              {meal}
                            </span>
                            <button
                              onClick={() => handleEditClick(day, meal, mealObj.text || '')}
                              className="text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-gray-300 text-sm leading-relaxed pr-6">
                            {mealObj.text || <span className="text-gray-600 italic">Not set</span>}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit MenuItem Modal */}
      <Modal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        title={`Edit Menu: ${selectedDay} - ${selectedMeal}`}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Day of the Week</label>
              <select
                className="select-field"
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                disabled
              >
                {DAY_OPTIONS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Meal Category</label>
              <select
                className="select-field"
                value={selectedMeal}
                onChange={(e) => setSelectedMeal(e.target.value)}
                disabled
              >
                {MEALS.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">Menu Items (Describe dishes)</label>
            <textarea
              className="input-field min-h-[100px]"
              placeholder="E.g. Aloo Paratha, Curd, Pickle, Tea"
              value={menuItemsText}
              onChange={(e) => setMenuItemsText(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex items-center gap-1.5">
              <Save className="w-4 h-4" /> Save Selection
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
