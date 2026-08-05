import React from 'react';
import { Sparkles, Calendar, MapPin, Bookmark, RefreshCw, Info } from 'lucide-react';

interface HeaderProps {
  totalCount: number;
  apiSource: 'api' | 'fallback' | 'loading';
  bookmarkedIds: string[];
  showBookmarksOnly: boolean;
  setShowBookmarksOnly: (val: boolean) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  totalCount,
  apiSource,
  bookmarkedIds,
  showBookmarksOnly,
  setShowBookmarksOnly,
  onRefresh,
  isLoading,
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Brand Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20 ring-1 ring-white/20">
              <Sparkles className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  부산 축제 가이드
                </h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-medium">
                  Busan Festivals
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                부산 광역시 구·군별 축제 & 날짜별 정보 한눈에 보기
              </p>
            </div>
          </div>

          {/* Status Badges & Quick Action Buttons */}
          <div className="flex items-center flex-wrap gap-2 sm:gap-3 justify-between md:justify-end">
            
            {/* API Status Badge */}
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs">
              <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-amber-400 animate-ping' : apiSource === 'api' ? 'bg-emerald-400' : 'bg-blue-400'}`} />
              <span className="text-slate-300 font-medium">
                {isLoading ? '불러오는 중...' : apiSource === 'api' ? '공공데이터 포털 연동' : '부산 축제 데이터베이스'}
              </span>
            </div>

            {/* Total Count Badge */}
            <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>총 <strong className="text-cyan-400">{totalCount}</strong>개 축제</span>
            </div>

            {/* Bookmarks Toggle */}
            <button
              onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 border ${
                showBookmarksOnly
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-semibold shadow-lg shadow-amber-500/20'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${showBookmarksOnly ? 'fill-slate-950' : 'text-amber-400'}`} />
              <span>즐겨찾기 ({bookmarkedIds.length})</span>
            </button>

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              title="데이터 새로고침"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-400' : ''}`} />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
