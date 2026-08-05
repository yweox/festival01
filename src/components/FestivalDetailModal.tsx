import React, { useState } from 'react';
import { 
  X, MapPin, Calendar, Phone, Globe, DollarSign, Car, 
  Share2, Bookmark, ExternalLink, Navigation, Check, Clock 
} from 'lucide-react';
import { FestivalItem } from '../types';

interface FestivalDetailModalProps {
  festival: FestivalItem | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
}

export const FestivalDetailModal: React.FC<FestivalDetailModalProps> = ({
  festival,
  onClose,
  isBookmarked,
  onToggleBookmark,
}) => {
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (!festival) return null;

  const handleShare = () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: festival.title,
        text: `[부산 축제 가이드] ${festival.title} (${festival.district})`,
        url: shareUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${festival.title} - ${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const mapSearchUrl = `https://map.kakao.com/link/search/${encodeURIComponent(festival.place || festival.address)}`;
  const naverMapUrl = `https://map.naver.com/v5/search/${encodeURIComponent(festival.place || festival.address)}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      
      {/* Modal Container */}
      <div 
        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header Banner Image */}
        <div className="relative h-64 sm:h-80 w-full bg-slate-900 shrink-0">
          <img
            src={imgError ? "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80" : festival.imgNormal}
            alt={festival.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/30" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-all border border-white/20 z-10"
            title="닫기"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top Floating Actions */}
          <div className="absolute top-4 left-4 flex items-center space-x-2 z-10">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white shadow-md">
              {festival.district}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/60 text-white backdrop-blur-md border border-white/20">
              {festival.status === 'ongoing' ? '진행 중' : festival.status === 'upcoming' ? '개최 예정' : '축제 정보'}
            </span>
          </div>

          {/* Title Overlay at bottom of header */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center space-x-2 text-xs text-blue-300 font-medium mb-1">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span>{festival.periodText}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight text-white drop-shadow-md">
              {festival.title}
            </h2>
          </div>
        </div>

        {/* Content Body Scrollable Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 dark:text-slate-200">
          
          {/* Action Row: Bookmark, Share, Direction Links */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onToggleBookmark(festival.id)}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isBookmarked
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-slate-950' : ''}`} />
                <span>{isBookmarked ? '즐겨찾기 됨' : '즐겨찾기 추가'}</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
                <span>{copied ? '복사됨!' : '공유하기'}</span>
              </button>
            </div>

            <div className="flex items-center space-x-2 text-xs font-medium">
              <a
                href={mapSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-semibold flex items-center space-x-1 shadow-sm transition-colors"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>카카오맵 길찾기</span>
              </a>

              <a
                href={naverMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center space-x-1 shadow-sm transition-colors"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>네이버지도 길찾기</span>
              </a>
            </div>
          </div>

          {/* Info Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            
            {/* Address & Venue */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center space-x-1.5">
                <MapPin className="w-4 h-4" />
                <span>개최 장소 / 주소</span>
              </div>
              <p className="font-semibold text-slate-900 dark:text-slate-100">{festival.place}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{festival.address}</p>
            </div>

            {/* Entrance Fee */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1.5">
                <DollarSign className="w-4 h-4" />
                <span>이용 요금 / 입장권</span>
              </div>
              <p className="font-semibold text-slate-900 dark:text-slate-100">{festival.fee}</p>
            </div>

            {/* Contact Phone */}
            {festival.contact && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center space-x-1.5">
                  <Phone className="w-4 h-4" />
                  <span>문의 전화</span>
                </div>
                <a 
                  href={`tel:${festival.contact}`}
                  className="font-semibold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 flex items-center space-x-1"
                >
                  <span>{festival.contact}</span>
                </a>
              </div>
            )}

            {/* Homepage Link */}
            {festival.homepage && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="text-xs font-bold text-cyan-600 dark:text-cyan-400 flex items-center space-x-1.5">
                  <Globe className="w-4 h-4" />
                  <span>공식 홈페이지</span>
                </div>
                <a 
                  href={festival.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-blue-600 dark:text-blue-400 hover:underline text-xs flex items-center space-x-1 truncate"
                >
                  <span className="truncate">{festival.homepage}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>
            )}

          </div>

          {/* Traffic / Parking Info if available */}
          {(festival.traffic || festival.parkingInfo) && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
              <div className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center space-x-1.5">
                <Car className="w-4 h-4" />
                <span>교통 및 주차 안내</span>
              </div>
              {festival.parkingInfo && (
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  <strong>주차 정보:</strong> {festival.parkingInfo}
                </p>
              )}
              {festival.traffic && (
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  <strong>대중교통:</strong> {festival.traffic}
                </p>
              )}
            </div>
          )}

          {/* Detailed Description */}
          <div className="space-y-2 pt-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2">
              축제 상세 소개
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {festival.description}
            </p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors"
          >
            닫기
          </button>
        </div>

      </div>

    </div>
  );
};
