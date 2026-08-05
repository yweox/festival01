import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { StatsBanner } from './components/StatsBanner';
import { FilterBar } from './components/FilterBar';
import { FestivalCard } from './components/FestivalCard';
import { FestivalDetailModal } from './components/FestivalDetailModal';
import { FestivalMapView } from './components/FestivalMapView';
import { FestivalCalendarView } from './components/FestivalCalendarView';
import { DistrictMapOverview } from './components/DistrictMapOverview';
import { FestivalItem, FilterState } from './types';
import { normalizeFestivalItem } from './utils/festivalParser';
import { Sparkles, Frown, RotateCcw, Bookmark, MapPin, Calendar } from 'lucide-react';

export default function App() {
  const [festivals, setFestivals] = useState<FestivalItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [apiSource, setApiSource] = useState<'api' | 'fallback' | 'loading'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Selected Detail Modal
  const [selectedFestival, setSelectedFestival] = useState<FestivalItem | null>(null);

  // Bookmarks
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('busan_festival_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [showBookmarksOnly, setShowBookmarksOnly] = useState<boolean>(false);

  // Filter & Sort State
  const [filters, setFilters] = useState<FilterState>({
    district: '전체',
    selectedDate: '',
    month: 'all',
    status: 'all',
    searchQuery: '',
    sortBy: 'latest',
  });

  // View Mode: 'grid' | 'list' | 'map' | 'calendar'
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map' | 'calendar'>('grid');

  // Save Bookmarks to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('busan_festival_bookmarks', JSON.stringify(bookmarkedIds));
    } catch (e) {
      console.error('Failed to save bookmarks', e);
    }
  }, [bookmarkedIds]);

  const toggleBookmark = (id: string) => {
    setBookmarkedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Fetch Festivals
  const fetchFestivals = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/festivals?numOfRows=100');
      const data = await response.json();

      if (data.success && Array.isArray(data.items)) {
        const normalized = data.items.map((item: any, idx: number) => 
          normalizeFestivalItem(item, idx)
        );
        setFestivals(normalized);
        setApiSource(data.source === 'api' ? 'api' : 'fallback');
      } else {
        throw new Error(data.error || '축제 데이터를 불러올 수 없습니다.');
      }
    } catch (err: any) {
      console.error('Failed to fetch festival data:', err);
      setErrorMessage(err.message || '데이터를 가져오는 중 오류가 발생했습니다.');
      setApiSource('fallback');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFestivals();
  }, []);

  // Filter & Sort Logic
  const filteredFestivals = useMemo(() => {
    return festivals.filter(festival => {
      // 1. Bookmark Filter
      if (showBookmarksOnly && !bookmarkedIds.includes(festival.id)) {
        return false;
      }

      // 2. District Filter (지역별)
      if (filters.district !== '전체') {
        if (!festival.district.includes(filters.district) && !filters.district.includes(festival.district)) {
          return false;
        }
      }

      // 3. Specific Date Filter (날짜별)
      if (filters.selectedDate) {
        if (festival.parsedStartDate && festival.parsedEndDate) {
          if (filters.selectedDate < festival.parsedStartDate || filters.selectedDate > festival.parsedEndDate) {
            return false;
          }
        } else if (festival.parsedStartDate) {
          if (filters.selectedDate !== festival.parsedStartDate) {
            return false;
          }
        }
      }

      // 4. Month Filter (개최월)
      if (filters.month !== 'all') {
        const monthNum = parseInt(filters.month, 10);
        let monthMatch = false;

        if (festival.parsedStartDate) {
          const startMonth = parseInt(festival.parsedStartDate.split('-')[1], 10);
          const endMonth = festival.parsedEndDate ? parseInt(festival.parsedEndDate.split('-')[1], 10) : startMonth;
          if (monthNum >= startMonth && monthNum <= endMonth) {
            monthMatch = true;
          }
        }

        if (!monthMatch && festival.periodText.includes(`${monthNum}월`)) {
          monthMatch = true;
        }

        if (!monthMatch) return false;
      }

      // 5. Status Filter (진행중, 예정, 종료)
      if (filters.status !== 'all') {
        if (festival.status !== filters.status) {
          return false;
        }
      }

      // 6. Search Query
      if (filters.searchQuery.trim() !== '') {
        const q = filters.searchQuery.toLowerCase();
        const matchesTitle = festival.title.toLowerCase().includes(q);
        const matchesDistrict = festival.district.toLowerCase().includes(q);
        const matchesAddress = festival.address.toLowerCase().includes(q);
        const matchesPlace = (festival.place || '').toLowerCase().includes(q);
        const matchesDesc = festival.description.toLowerCase().includes(q);

        if (!matchesTitle && !matchesDistrict && !matchesAddress && !matchesPlace && !matchesDesc) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'title') {
        return a.title.localeCompare(b.title, 'ko');
      } else if (filters.sortBy === 'district') {
        return a.district.localeCompare(b.district, 'ko');
      } else {
        // Latest (or priority by ongoing/upcoming)
        const score = { ongoing: 3, upcoming: 2, past: 1, unknown: 0 };
        return score[b.status] - score[a.status];
      }
    });
  }, [festivals, filters, showBookmarksOnly, bookmarkedIds]);

  const resetFilters = () => {
    setFilters({
      district: '전체',
      selectedDate: '',
      month: 'all',
      status: 'all',
      searchQuery: '',
      sortBy: 'latest',
    });
    setShowBookmarksOnly(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-500 selection:text-white flex flex-col">
      
      {/* Header */}
      <Header
        totalCount={festivals.length}
        apiSource={apiSource}
        bookmarkedIds={bookmarkedIds}
        showBookmarksOnly={showBookmarksOnly}
        setShowBookmarksOnly={setShowBookmarksOnly}
        onRefresh={fetchFestivals}
        isLoading={isLoading}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Banner Stats */}
        <StatsBanner
          festivals={festivals}
          selectedDistrict={filters.district}
          onSelectDistrict={(dist) => setFilters(prev => ({ ...prev, district: dist }))}
          selectedStatus={filters.status}
          onSelectStatus={(st) => setFilters(prev => ({ ...prev, status: st }))}
        />

        {/* District Map Quick Selector */}
        <DistrictMapOverview
          festivals={festivals}
          selectedDistrict={filters.district}
          onSelectDistrict={(dist) => setFilters(prev => ({ ...prev, district: dist }))}
        />

        {/* Filter Bar */}
        <FilterBar
          filters={filters}
          setFilters={setFilters}
          viewMode={viewMode}
          setViewMode={setViewMode}
          resultCount={filteredFestivals.length}
          onResetFilters={resetFilters}
        />

        {/* Loading Spinner Skeleton */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              부산 축제 정보를 공공데이터 포털에서 불러오는 중입니다...
            </p>
          </div>
        ) : filteredFestivals.length === 0 ? (
          /* Empty State */
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center my-8 space-y-4 shadow-sm">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
              <Frown className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                선택한 조건에 해당하는 축제가 없습니다
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                지역, 날짜 또는 검색어를 조정하거나 필터를 초기화해 보세요.
              </p>
            </div>
            <button
              onClick={resetFilters}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>전체 필터 초기화</span>
            </button>
          </div>
        ) : (
          /* View Mode Renderers */
          <>
            {viewMode === 'map' && (
              <FestivalMapView
                festivals={filteredFestivals}
                onSelectFestival={(fest) => setSelectedFestival(fest)}
              />
            )}

            {viewMode === 'calendar' && (
              <FestivalCalendarView
                festivals={filteredFestivals}
                onSelectFestival={(fest) => setSelectedFestival(fest)}
              />
            )}

            {(viewMode === 'grid' || viewMode === 'list') && (
              <div className={
                viewMode === 'grid'
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
                  : "space-y-4 mb-12"
              }>
                {filteredFestivals.map((fest) => (
                  <FestivalCard
                    key={fest.id}
                    festival={fest}
                    isBookmarked={bookmarkedIds.includes(fest.id)}
                    onToggleBookmark={toggleBookmark}
                    onSelectFestival={(f) => setSelectedFestival(f)}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}
          </>
        )}

      </main>

      {/* Festival Detail Modal */}
      <FestivalDetailModal
        festival={selectedFestival}
        onClose={() => setSelectedFestival(null)}
        isBookmarked={selectedFestival ? bookmarkedIds.includes(selectedFestival.id) : false}
        onToggleBookmark={toggleBookmark}
      />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="font-semibold text-slate-200">부산 축제 가이드</span>
            <span>| 공공데이터포털 부산광역시 축제 서비스 API</span>
          </div>
          <div className="text-slate-500">
            © 2026 Busan Festival Portal. Powered by React & Express.
          </div>
        </div>
      </footer>

    </div>
  );
}
