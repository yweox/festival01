import React from 'react';
import { MapPin, Compass } from 'lucide-react';
import { FestivalItem } from '../types';

interface DistrictMapOverviewProps {
  festivals: FestivalItem[];
  selectedDistrict: string;
  onSelectDistrict: (district: string) => void;
}

export const DistrictMapOverview: React.FC<DistrictMapOverviewProps> = ({
  festivals,
  selectedDistrict,
  onSelectDistrict,
}) => {
  // Busan's 16 districts
  const districts = [
    { name: '강서구', region: '서부산' },
    { name: '금정구', region: '동부산' },
    { name: '기장군', region: '동부산' },
    { name: '남구', region: '중부산' },
    { name: '동구', region: '원도심' },
    { name: '동래구', region: '중부산' },
    { name: '부산진구', region: '중부산' },
    { name: '북구', region: '서부산' },
    { name: '사상구', region: '서부산' },
    { name: '사하구', region: '서부산' },
    { name: '서구', region: '원도심' },
    { name: '수영구', region: '동부산' },
    { name: '연제구', region: '중부산' },
    { name: '영도구', region: '원도심' },
    { name: '중구', region: '원도심' },
    { name: '해운대구', region: '동부산' },
  ];

  // Count festivals per district
  const getCount = (distName: string) => {
    return festivals.filter(f => f.district.includes(distName) || distName.includes(f.district)).length;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm mb-8 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Compass className="w-5 h-5 text-blue-500" />
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
            부산 16개 구·군별 축제 살펴보기
          </h3>
        </div>
        {selectedDistrict !== '전체' && (
          <button
            onClick={() => onSelectDistrict('전체')}
            className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
          >
            전체 지역으로 복귀
          </button>
        )}
      </div>

      {/* Grid of Districts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
        <button
          onClick={() => onSelectDistrict('전체')}
          className={`p-3 rounded-2xl border text-center transition-all ${
            selectedDistrict === '전체'
              ? 'bg-blue-600 text-white border-blue-500 shadow-md font-bold'
              : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          <div className="text-xs opacity-80">부산 전체</div>
          <div className="text-sm font-extrabold mt-0.5">{festivals.length}건</div>
        </button>

        {districts.map((d) => {
          const count = getCount(d.name);
          const isSelected = selectedDistrict === d.name;

          return (
            <button
              key={d.name}
              onClick={() => onSelectDistrict(d.name)}
              className={`p-3 rounded-2xl border text-center transition-all relative group ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-500 shadow-md font-bold'
                  : count > 0
                  ? 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-blue-400 text-slate-800 dark:text-slate-200'
                  : 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800/80 text-slate-400 dark:text-slate-500'
              }`}
            >
              <div className="text-xs font-semibold">{d.name}</div>
              <div className={`text-xs mt-0.5 font-extrabold ${isSelected ? 'text-white' : count > 0 ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}>
                {count}건
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
