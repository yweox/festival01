export interface RawFestivalItem {
  UC_SEQ?: number | string;
  MAIN_TITLE?: string;
  GUGUN_NM?: string;
  ADDR1?: string;
  ADDR2?: string;
  CNTCT_TEL?: string;
  HOMEPAGE_URL?: string;
  USAGE_DAY_WEEK_AND_TIME?: string;
  MAIN_IMG_NORMAL?: string;
  MAIN_IMG_THUMB?: string;
  ITEMCNTNTS?: string;
  LAT?: number | string;
  LNG?: number | string;
  USAGE_AMOUNT?: string;
  MAIN_PLACE?: string;
  MIDDLE_SIZE_RM1?: string;
  TRFC_INFO?: string;
  HLDY_INFO?: string;
}

export interface FestivalItem {
  id: string;
  title: string;
  district: string; // 구군 (e.g. 해운대구, 중구)
  address: string;
  contact?: string;
  homepage?: string;
  periodText: string;
  parsedStartDate?: string; // YYYY-MM-DD
  parsedEndDate?: string;   // YYYY-MM-DD
  imgNormal?: string;
  imgThumb?: string;
  description: string;
  lat?: number;
  lng?: number;
  fee?: string;
  place?: string;
  traffic?: string;
  parkingInfo?: string;
  status: 'ongoing' | 'upcoming' | 'past' | 'unknown';
}

export interface FilterState {
  district: string;      // '전체' or specific Gugun
  selectedDate: string;  // YYYY-MM-DD or empty
  month: string;         // '전체' or '01' ~ '12'
  status: 'all' | 'ongoing' | 'upcoming' | 'past';
  searchQuery: string;
  sortBy: 'latest' | 'title' | 'district';
}
