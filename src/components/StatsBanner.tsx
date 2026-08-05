import React from 'react';
import { CalendarCheck, MapPin, Sparkles, AlertCircle } from 'lucide-react';
import { FestivalItem } from '../types';

interface StatsBannerProps {
  festivals: FestivalItem[];
  selectedDistrict: string;
  onSelectDistrict: (district: string) => void;
  selectedStatus: string;
  onSelectStatus: (status: any) => void;
}

export const StatsBanner: React.FC<StatsBannerProps> = ({
  festivals,
  selectedDistrict,
  onSelectDistrict,
  selectedStatus,
  onSelectStatus,
}) => {
  const ongoingCount = festivals.filter(f => f.status === 'ongoing').length;
  const upcomingCount = festivals.filter(f => f.status === 'upcoming').length;
  const districtCount = new Set(festivals.map(f => f.district)).size;

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-4 sm:p-6 border border-slate-800 shadow-xl mb-6 relative overflow-hidden">
      
      {/* Background Decorative Graphic */}
      <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute left-1/3 -top-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Left Stats Highlights */}
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>부산 축제 실시간 현황</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            바다와 문화가 어우러진 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300">부산의 축제 현장</span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            원하는 지역(구·군)이나 날짜를 선택하여 부산시 전역에서 진행되는 축제와 행사를 찾아보세요.
          </p>
        </div>

        {/* Quick Click Stat Cards */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 shrink-0">
          
          <button
            onClick={() => onSelectStatus(selectedStatus === 'ongoing' ? 'all' : 'ongoing')}
            className={`p-3 rounded-xl border text-left transition-all ${
              selectedStatus === 'ongoing'
                ? 'bg-emerald-500/20 border-emerald-400/50 ring-2 ring-emerald-500/30'
                : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/60'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-emerald-400 font-medium mb-1">
              <span>진행 중</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-lg sm:text-2xl font-extrabold text-white">{ongoingCount}<span className="text-xs font-normal text-slate-400 ml-1">건</span></div>
          </button>

          <button
            onClick={() => onSelectStatus(selectedStatus === 'upcoming' ? 'all' : 'upcoming')}
            className={`p-3 rounded-xl border text-left transition-all ${
              selectedStatus === 'upcoming'
                ? 'bg-blue-500/20 border-blue-400/50 ring-2 ring-blue-500/30'
                : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/60'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-blue-400 font-medium mb-1">
              <span>개최 예정</span>
              <CalendarCheck className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="text-lg sm:text-2xl font-extrabold text-white">{upcomingCount}<span className="text-xs font-normal text-slate-400 ml-1">건</span></div>
          </button>

          <button
            onClick={() => onSelectDistrict('전체')}
            className={`p-3 rounded-xl border text-left transition-all ${
              selectedDistrict === '전체'
                ? 'bg-indigo-500/20 border-indigo-400/50 ring-2 ring-indigo-500/30'
                : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/60'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-cyan-400 font-medium mb-1">
              <span>참여 구·군</span>
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-lg sm:text-2xl font-extrabold text-white">{districtCount}<span className="text-xs font-normal text-slate-400 ml-1">개 지역</span></div>
          </button>

        </div>

      </div>
    </div>
  );
};
