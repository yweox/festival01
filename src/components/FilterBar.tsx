import React from 'react';
import { 
  Search, MapPin, Calendar, LayoutGrid, List, Map, CalendarDays, 
  RotateCcw, SlidersHorizontal, ArrowUpDown, ChevronDown, Filter 
} from 'lucide-react';
import { FilterState } from '../types';
import { BUSAN_DISTRICTS } from '../utils/festivalParser';

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  viewMode: 'grid' | 'list' | 'map' | 'calendar';
  setViewMode: (mode: 'grid' | 'list' | 'map' | 'calendar') => void;
  resultCount: number;
  onResetFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  setFilters,
  viewMode,
  setViewMode,
  resultCount,
  onResetFilters,
}) => {
  const months = [
    { value: 'all', label: '전체 월' },
    { value: '01', label: '1월' },
    { value: '02', label: '2월' },
    { value: '03', label: '3월' },
    { value: '04', label: '4월' },
    { value: '05', label: '5월' },
    { value: '06', label: '6월' },
    { value: '07', label: '7월' },
    { value: '08', label: '8월' },
    { value: '09', label: '9월' },
    { value: '10', label: '10월' },
    { value: '11', label: '11월' },
    { value: '12', label: '12월' },
  ];

  const hasActiveFilters = 
    filters.district !== '전체' ||
    filters.selectedDate !== '' ||
    filters.month !== 'all' ||
    filters.status !== 'all' ||
    filters.searchQuery !== '';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-5 mb-6 space-y-4">
      
      {/* Top Row: Search Input & View Modes & Sort */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        
        {/* Search Field */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="축제 이름, 장소, 내용으로 검색..."
            value={filters.searchQuery}
            onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
            className="w-full pl-10 pr-9 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
          />
          {filters.searchQuery && (
            <button
              onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-200 dark:bg-slate-700 rounded-full w-4 h-4 flex items-center justify-center"
            >
              ✕
            </button>
          )}
        </div>

        {/* View Mode Switchers & Sorting */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          
          {/* Sorting */}
          <div className="flex items-center space-x-1 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
              className="bg-transparent border-none text-xs text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer font-medium"
            >
              <option value="latest" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">최신순</option>
              <option value="title" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">이름순</option>
              <option value="district" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">구·군별</option>
            </select>
          </div>

          {/* View Buttons */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>카드</span>
            </button>

            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>목록</span>
            </button>

            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'calendar'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>달력</span>
            </button>

            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'map'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>지도</span>
            </button>
          </div>

        </div>

      </div>

      {/* Filter Row 1: Area Filter (지역별 구·군) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
            <MapPin className="w-3.5 h-3.5 text-blue-500" />
            <span>지역별 (구·군 선택)</span>
          </label>
          <span className="text-[11px] text-slate-400">
            {filters.district === '전체' ? '부산 전지역' : `${filters.district} 축제만 보기`}
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
          {BUSAN_DISTRICTS.map((dist) => (
            <button
              key={dist}
              onClick={() => setFilters(prev => ({ ...prev, district: dist }))}
              className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                filters.district === dist
                  ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {dist}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Row 2: Date Filters (날짜별 & 월별 & 상태별) */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
        
        {/* Specific Date Picker */}
        <div className="flex items-center space-x-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1 shrink-0">
            <Calendar className="w-3.5 h-3.5 text-indigo-500" />
            <span>날짜 지정:</span>
          </label>
          <div className="relative flex-1">
            <input
              type="date"
              value={filters.selectedDate}
              onChange={(e) => setFilters(prev => ({ ...prev, selectedDate: e.target.value }))}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            />
          </div>
          {filters.selectedDate && (
            <button
              onClick={() => setFilters(prev => ({ ...prev, selectedDate: '' }))}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline"
            >
              초기화
            </button>
          )}
        </div>

        {/* Month Selector */}
        <div className="flex items-center space-x-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 shrink-0">
            개최 월:
          </label>
          <div className="flex-1 overflow-x-auto flex gap-1 scrollbar-none py-1">
            {months.map((m) => (
              <button
                key={m.value}
                onClick={() => setFilters(prev => ({ ...prev, month: m.value }))}
                className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  filters.month === m.value
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Status Filter (전체, 진행중, 예정, 종료) */}
        <div className="flex items-center justify-start md:justify-end space-x-1.5">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mr-1">상태:</span>
          {[
            { id: 'all', label: '전체' },
            { id: 'ongoing', label: '진행중' },
            { id: 'upcoming', label: '예정' },
            { id: 'past', label: '종료' },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setFilters(prev => ({ ...prev, status: s.id as any }))}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                filters.status === s.id
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

      </div>

      {/* Bottom Status & Reset indicator */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/60">
        <div>
          총 <strong className="text-blue-600 dark:text-blue-400 font-bold">{resultCount}</strong>개의 축제가 검색되었습니다.
        </div>

        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="flex items-center space-x-1 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>검색 조건 초기화</span>
          </button>
        )}
      </div>

    </div>
  );
};
