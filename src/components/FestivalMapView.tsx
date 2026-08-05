import React, { useState } from 'react';
import { MapPin, Navigation, ExternalLink, Calendar, Info } from 'lucide-react';
import { FestivalItem } from '../types';

interface FestivalMapViewProps {
  festivals: FestivalItem[];
  onSelectFestival: (festival: FestivalItem) => void;
}

export const FestivalMapView: React.FC<FestivalMapViewProps> = ({
  festivals,
  onSelectFestival,
}) => {
  const [activeFestival, setActiveFestival] = useState<FestivalItem | null>(festivals[0] || null);

  // Group festivals by district
  const districtGroups = festivals.reduce((acc, festival) => {
    acc[festival.district] = (acc[festival.district] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg mb-8">
      
      {/* Map Header */}
      <div className="p-4 sm:p-6 bg-slate-900 text-white border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2 text-xs text-cyan-400 font-semibold mb-1">
            <MapPin className="w-4 h-4" />
            <span>부산 축제 지도 탐색</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold">부산광역시 축제 위치 정보</h3>
        </div>
        <div className="text-xs text-slate-400">
          총 <strong className="text-cyan-400">{festivals.length}</strong>개 축제 위치 검색됨
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[500px]">
        
        {/* Left Side: District Summary & Interactive Pin Grid */}
        <div className="p-5 lg:col-span-2 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 space-y-6">
          
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
              구·군별 축제 분포 현황
            </h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(districtGroups).map(([district, count]) => (
                <div
                  key={district}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs flex items-center space-x-1.5"
                >
                  <span className="font-bold text-slate-800 dark:text-slate-200">{district}</span>
                  <span className="px-1.5 py-0.2 rounded-md bg-blue-500 text-white font-extrabold text-[10px]">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Map Pin Grid */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
              <Navigation className="w-4 h-4 text-blue-500" />
              <span>축제 선택 및 오시는 길</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-1">
              {festivals.map((fest) => {
                const isSelected = activeFestival?.id === fest.id;
                return (
                  <div
                    key={fest.id}
                    onClick={() => setActiveFestival(fest)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-500 shadow-md ring-2 ring-blue-400/50'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className={`px-2 py-0.5 rounded-md font-bold ${isSelected ? 'bg-white/20 text-white' : 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400'}`}>
                        {fest.district}
                      </span>
                      <span className={`text-[11px] ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                        {fest.status === 'ongoing' ? '진행중' : fest.status === 'upcoming' ? '개최예정' : '종료'}
                      </span>
                    </div>

                    <h5 className="font-bold text-sm line-clamp-1 mb-1">
                      {fest.title}
                    </h5>

                    <p className={`text-xs flex items-center space-x-1 line-clamp-1 ${isSelected ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span>{fest.place || fest.address}</span>
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Side: Selected Festival Detail Preview */}
        <div className="p-5 flex flex-col justify-between bg-white dark:bg-slate-900">
          {activeFestival ? (
            <div className="space-y-4">
              
              <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-800">
                <img
                  src={activeFestival.imgNormal}
                  alt={activeFestival.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 text-white backdrop-blur-md text-xs font-bold">
                  {activeFestival.district}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{activeFestival.periodText}</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
                  {activeFestival.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{activeFestival.address}</span>
                </p>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed pt-2">
                  {activeFestival.description}
                </p>
              </div>

              {/* Direct Map Links */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <a
                  href={`https://map.kakao.com/link/search/${encodeURIComponent(activeFestival.place || activeFestival.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>카카오맵에서 위치 보기</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  onClick={() => onSelectFestival(activeFestival)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>축제 전체 상세 정보 보기</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 text-xs py-10">
              <MapPin className="w-8 h-8 mb-2 text-slate-300 animate-bounce" />
              <span>왼쪽 목록에서 축제를 선택해주세요</span>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
