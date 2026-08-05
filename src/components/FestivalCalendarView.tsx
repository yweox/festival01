import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, MapPin, Sparkles, Clock } from 'lucide-react';
import { FestivalItem } from '../types';

interface FestivalCalendarViewProps {
  festivals: FestivalItem[];
  onSelectFestival: (festival: FestivalItem) => void;
}

export const FestivalCalendarView: React.FC<FestivalCalendarViewProps> = ({
  festivals,
  onSelectFestival,
}) => {
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(5); // May by default or current
  const [selectedDayFestivals, setSelectedDayFestivals] = useState<FestivalItem[] | null>(null);
  const [selectedDateLabel, setSelectedDateLabel] = useState<string>('');

  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth - 1, 1).getDay();

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  // Find festivals happening on a given day (YYYY-MM-DD)
  const getFestivalsForDay = (day: number) => {
    const formattedMonth = String(currentMonth).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const dateStr = `${currentYear}-${formattedMonth}-${formattedDay}`;

    return festivals.filter(f => {
      if (f.parsedStartDate && f.parsedEndDate) {
        return dateStr >= f.parsedStartDate && dateStr <= f.parsedEndDate;
      } else if (f.parsedStartDate) {
        return dateStr === f.parsedStartDate;
      }
      // Check if period text contains month number e.g. "5월"
      return f.periodText.includes(`${currentMonth}월`);
    });
  };

  const handleDayClick = (day: number, dayFestivals: FestivalItem[]) => {
    if (dayFestivals.length > 0) {
      setSelectedDayFestivals(dayFestivals);
      setSelectedDateLabel(`${currentYear}년 ${currentMonth}월 ${day}일`);
    } else {
      setSelectedDayFestivals(null);
    }
  };

  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg mb-8">
      
      {/* Calendar Top Header */}
      <div className="p-4 sm:p-6 bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-xs text-indigo-400 font-semibold mb-1">
            <Calendar className="w-4 h-4" />
            <span>부산 축제 달력 보기</span>
          </div>
          <h3 className="text-xl font-bold">날짜별 축제 일정 한눈에 보기</h3>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center space-x-3 bg-slate-800 px-3 py-1.5 rounded-2xl border border-slate-700">
          <button
            onClick={handlePrevMonth}
            className="p-1 rounded-lg hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="text-base font-bold text-white tracking-wide">
            {currentYear}년 {currentMonth}월
          </span>

          <button
            onClick={handleNextMonth}
            className="p-1 rounded-lg hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3">
        
        {/* Left Side: Month Grid */}
        <div className="lg:col-span-2 p-4 sm:p-6 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800">
          
          {/* Weekday Labels */}
          <div className="grid grid-cols-7 text-center font-bold text-xs text-slate-400 mb-2">
            {weekDays.map((wd, i) => (
              <div key={wd} className={i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : ''}>
                {wd}
              </div>
            ))}
          </div>

          {/* Calendar Day Tiles */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {/* Empty slots before day 1 */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="h-16 sm:h-20 bg-slate-50/50 dark:bg-slate-950/20 rounded-xl" />
            ))}

            {/* Days of month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayFestivals = getFestivalsForDay(day);
              const hasFestivals = dayFestivals.length > 0;

              return (
                <div
                  key={day}
                  onClick={() => handleDayClick(day, dayFestivals)}
                  className={`h-16 sm:h-20 p-1.5 rounded-xl border flex flex-col justify-between transition-all cursor-pointer ${
                    hasFestivals
                      ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/80 hover:scale-105 hover:shadow-md'
                      : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-bold ${hasFestivals ? 'text-blue-700 dark:text-blue-300' : 'text-slate-600 dark:text-slate-400'}`}>
                      {day}
                    </span>
                    {hasFestivals && (
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    )}
                  </div>

                  {hasFestivals && (
                    <div className="space-y-0.5 overflow-hidden">
                      <div className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded font-semibold truncate">
                        {dayFestivals[0].title}
                      </div>
                      {dayFestivals.length > 1 && (
                        <div className="text-[9px] text-blue-600 dark:text-blue-400 font-bold pl-0.5">
                          +{dayFestivals.length - 1}개 더보기
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

        {/* Right Side: Selected Day Festival List */}
        <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-950/40 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span>{selectedDateLabel || `${currentYear}년 ${currentMonth}월 전체 축제`}</span>
            </h4>
            {selectedDayFestivals && (
              <button
                onClick={() => setSelectedDayFestivals(null)}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                전체보기
              </button>
            )}
          </div>

          <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
            {(selectedDayFestivals || festivals).map((f) => (
              <div
                key={f.id}
                onClick={() => onSelectFestival(f)}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all cursor-pointer space-y-1.5 group shadow-sm"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold">
                    {f.district}
                  </span>
                  <span className="text-[11px] text-slate-400">{f.periodText}</span>
                </div>

                <h5 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors">
                  {f.title}
                </h5>

                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-1 line-clamp-1">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>{f.place || f.address}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
