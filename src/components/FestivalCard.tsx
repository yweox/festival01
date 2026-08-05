import React, { useState } from 'react';
import { MapPin, Calendar, ExternalLink, Bookmark, Info, DollarSign, Clock } from 'lucide-react';
import { FestivalItem } from '../types';

interface FestivalCardProps {
  festival: FestivalItem;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onSelectFestival: (festival: FestivalItem) => void;
  viewMode?: 'grid' | 'list';
}

export const FestivalCard: React.FC<FestivalCardProps> = ({
  festival,
  isBookmarked,
  onToggleBookmark,
  onSelectFestival,
  viewMode = 'grid',
}) => {
  const [imgError, setImgError] = useState(false);

  const fallbackImage = "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80";

  const getStatusBadge = (status: FestivalItem['status']) => {
    switch (status) {
      case 'ongoing':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/90 text-white shadow-sm backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>진행 중</span>
          </span>
        );
      case 'upcoming':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/90 text-white shadow-sm backdrop-blur-sm">
            <Clock className="w-3 h-3" />
            <span>개최 예정</span>
          </span>
        );
      case 'past':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-700/80 text-slate-200 backdrop-blur-sm">
            <span>종료</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-500/90 text-white shadow-sm">
            <span>부산 축제</span>
          </span>
        );
    }
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 hover:shadow-lg transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group">
        
        {/* Left Thumb & Title Info */}
        <div className="flex items-center space-x-4 flex-1 cursor-pointer" onClick={() => onSelectFestival(festival)}>
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800">
            <img
              src={imgError ? fallbackImage : (festival.imgThumb || festival.imgNormal)}
              alt={festival.title}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute top-1.5 left-1.5">
              {getStatusBadge(festival.status)}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs">
              <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold border border-blue-200/50 dark:border-blue-800/50">
                {festival.district}
              </span>
              <span className="text-slate-400 flex items-center space-x-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>{festival.periodText}</span>
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
              {festival.title}
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-1 line-clamp-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{festival.place || festival.address}</span>
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 shrink-0 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-800">
          <button
            onClick={() => onToggleBookmark(festival.id)}
            className={`p-2 rounded-xl transition-colors ${
              isBookmarked
                ? 'bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-400'
            }`}
            title="즐겨찾기"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
          </button>

          <button
            onClick={() => onSelectFestival(festival)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors flex items-center space-x-1"
          >
            <span>상세보기</span>
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    );
  }

  // Grid Mode Card
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group">
      
      {/* Image Thumbnail Header */}
      <div className="relative h-48 sm:h-52 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden cursor-pointer" onClick={() => onSelectFestival(festival)}>
        <img
          src={imgError ? fallbackImage : (festival.imgNormal || festival.imgThumb)}
          alt={festival.title}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            {getStatusBadge(festival.status)}
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-black/60 text-white backdrop-blur-md border border-white/20">
              {festival.district}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(festival.id);
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-transform active:scale-95 ${
              isBookmarked
                ? 'bg-amber-500 text-slate-950 shadow-lg'
                : 'bg-black/40 hover:bg-black/60 text-white border border-white/20'
            }`}
            title="즐겨찾기"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-slate-950' : ''}`} />
          </button>
        </div>

        {/* Location Tag on Image Bottom */}
        <div className="absolute bottom-3 left-3 right-3 text-white text-xs flex items-center space-x-1 line-clamp-1 opacity-90">
          <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="truncate">{festival.place || festival.address}</span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div className="space-y-2">
          {/* Date Period */}
          <div className="flex items-center space-x-1.5 text-xs text-blue-600 dark:text-blue-400 font-medium">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span className="line-clamp-1">{festival.periodText}</span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onSelectFestival(festival)}
            className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 cursor-pointer leading-snug"
          >
            {festival.title}
          </h3>

          {/* Description Snippet */}
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {festival.description}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          
          <div className="text-slate-500 dark:text-slate-400 flex items-center space-x-1">
            <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
            <span className="font-medium text-slate-700 dark:text-slate-300">{festival.fee}</span>
          </div>

          <button
            onClick={() => onSelectFestival(festival)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-blue-600 dark:bg-slate-800 dark:hover:bg-blue-600 text-white font-medium text-xs transition-colors duration-200 flex items-center space-x-1"
          >
            <span>상세보기</span>
            <Info className="w-3.5 h-3.5" />
          </button>

        </div>

      </div>

    </div>
  );
};
