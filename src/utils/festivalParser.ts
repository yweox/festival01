import { RawFestivalItem, FestivalItem } from "../types";

/**
 * Clean title string by removing html tags or duplicate subtitles
 */
export function cleanText(str?: string): string {
  if (!str) return "";
  return str
    .replace(/<[^>]*>?/gm, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

/**
 * Extract dates YYYY-MM-DD from USAGE_DAY_WEEK_AND_TIME text strings
 */
export function extractDates(timeStr?: string): { startDate?: string; endDate?: string } {
  if (!timeStr) return {};

  // Matches pattern like 2026.05.22, 2026-05-22, 2026. 5. 22, 2026/05/22
  const dateRegex = /(20\d{2})[-.\/ ]\s*(\d{1,2})[-.\/ ]\s*(\d{1,2})/g;
  const matches = [...timeStr.matchAll(dateRegex)];

  if (matches.length >= 2) {
    const sYear = matches[0][1];
    const sMonth = matches[0][2].padStart(2, '0');
    const sDay = matches[0][3].padStart(2, '0');

    const eYear = matches[1][1];
    const eMonth = matches[1][2].padStart(2, '0');
    const eDay = matches[1][3].padStart(2, '0');

    return {
      startDate: `${sYear}-${sMonth}-${sDay}`,
      endDate: `${eYear}-${eMonth}-${eDay}`
    };
  } else if (matches.length === 1) {
    const sYear = matches[0][1];
    const sMonth = matches[0][2].padStart(2, '0');
    const sDay = matches[0][3].padStart(2, '0');
    const singleDate = `${sYear}-${sMonth}-${sDay}`;
    return {
      startDate: singleDate,
      endDate: singleDate
    };
  }

  return {};
}

/**
 * Determine festival status given today's date or a reference date
 */
export function calculateStatus(
  startDate?: string,
  endDate?: string,
  refDateStr: string = new Date().toISOString().split('T')[0]
): 'ongoing' | 'upcoming' | 'past' | 'unknown' {
  if (!startDate) return 'unknown';

  const ref = new Date(refDateStr).getTime();
  const start = new Date(startDate).getTime();
  const end = endDate ? new Date(endDate).getTime() : start;

  if (isNaN(start)) return 'unknown';

  // Include full end day up to 23:59:59
  const endOfDay = end + 24 * 60 * 60 * 1000 - 1;

  if (ref >= start && ref <= endOfDay) {
    return 'ongoing';
  } else if (ref < start) {
    return 'upcoming';
  } else {
    return 'past';
  }
}

/**
 * Normalize raw API item into application FestivalItem format
 */
export function normalizeFestivalItem(raw: RawFestivalItem, index: number): FestivalItem {
  const id = String(raw.UC_SEQ || `fest-${index}`);
  const title = cleanText(raw.MAIN_TITLE) || "부산 축제";
  const district = cleanText(raw.GUGUN_NM) || "부산 전체";
  const address = cleanText(raw.ADDR1) || "부산광역시";
  const contact = cleanText(raw.CNTCT_TEL);
  const homepage = raw.HOMEPAGE_URL && raw.HOMEPAGE_URL.startsWith('http') 
    ? raw.HOMEPAGE_URL 
    : raw.HOMEPAGE_URL ? `http://${raw.HOMEPAGE_URL}` : undefined;
  
  const periodText = cleanText(raw.USAGE_DAY_WEEK_AND_TIME) || "일정 상세 참조";
  const { startDate, endDate } = extractDates(periodText);
  const status = calculateStatus(startDate, endDate);

  const imgNormal = raw.MAIN_IMG_NORMAL || raw.MAIN_IMG_THUMB || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80";
  const imgThumb = raw.MAIN_IMG_THUMB || raw.MAIN_IMG_NORMAL || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80";

  const description = cleanText(raw.ITEMCNTNTS) || `${title}에 대한 상세 정보입니다.`;
  const lat = raw.LAT ? parseFloat(String(raw.LAT)) : undefined;
  const lng = raw.LNG ? parseFloat(String(raw.LNG)) : undefined;

  return {
    id,
    title,
    district,
    address,
    contact,
    homepage,
    periodText,
    parsedStartDate: startDate,
    parsedEndDate: endDate,
    imgNormal,
    imgThumb,
    description,
    lat,
    lng,
    fee: cleanText(raw.USAGE_AMOUNT) || "무료",
    place: cleanText(raw.MAIN_PLACE) || address,
    traffic: cleanText(raw.TRFC_INFO),
    parkingInfo: cleanText(raw.MIDDLE_SIZE_RM1),
    status
  };
}

export const BUSAN_DISTRICTS = [
  "전체",
  "강서구",
  "금정구",
  "기장군",
  "남구",
  "동구",
  "동래구",
  "부산진구",
  "북구",
  "사상구",
  "사하구",
  "서구",
  "수영구",
  "연제구",
  "영도구",
  "중구",
  "해운대구"
];
