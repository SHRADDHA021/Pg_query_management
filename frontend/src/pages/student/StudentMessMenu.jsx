import { useEffect, useState } from 'react';
import { PageHeader, LoadingSpinner, EmptyState } from '../../components/UI';
import { messService } from '../../services';
import { Utensils, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfWeek, addDays, subDays } from 'date-fns';

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
const MEALS = ['BREAKFAST', 'LUNCH', 'DINNER'];

export default function StudentMessMenu() {
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 }) // Monday start
  );
  const [menu, setMenu] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchMenu = async (weekDate) => {
    setLoading(true);
    try {
      const formattedDate = format(weekDate, 'yyyy-MM-dd');
      const response = await messService.getMenuByWeek(formattedDate);
      
      // Group menu items by Day and Meal
      const groupedMenu = response.data.data.reduce((acc, item) => {
        if (!acc[item.dayOfWeek]) acc[item.dayOfWeek] = {};
        acc[item.dayOfWeek][item.mealType] = item.menuItems;
        return acc;
      }, {});
      setMenu(groupedMenu);
    } catch (err) {
      console.error(err);
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

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="Weekly Mess Menu" 
        subtitle="Check out the weekly hostel breakfast, lunch and dinner options."
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
      ) : Object.keys(menu).length === 0 ? (
        <EmptyState 
          icon={Utensils} 
          title="Menu Not Published" 
          description="Hostel admin has not published the menu for this week yet." 
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {DAYS.map((day) => {
            const dayMeals = menu[day] || {};
            const isToday = format(new Date(), 'EEEE').toUpperCase() === day;
            return (
              <div 
                key={day} 
                className={`glass-card p-6 border ${isToday ? 'border-primary-500/40 ring-1 ring-primary-500/30' : 'border-white/5'} transition-all duration-300`}
              >
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
                  <h3 className="font-bold text-lg text-white">{day}</h3>
                  {isToday && (
                    <span className="bg-primary-500/20 border border-primary-500/30 text-primary-400 text-xs font-semibold px-2 py-0.5 rounded-md">
                      Today
                    </span>
                  )}
                </div>

                <div className="space-y-4">
                  {MEALS.map((meal) => (
                    <div key={meal} className="space-y-1">
                      <span className="text-xs font-bold text-primary-400 tracking-wider uppercase block">
                        {meal}
                      </span>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {dayMeals[meal] || <span className="text-gray-500 italic">Not decided</span>}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
