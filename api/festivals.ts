// Vercel Serverless Function for Busan Festival Open API (/api/festivals)

const DEFAULT_SERVICE_KEY = "BB1TulnBLsLbOnjG3h050QSaljEaJnKchn7XVELfKrIA%2FGCBZxxI9tRL2eRfo%2FsBqXOTDr2L0tGBQYtJMfanYA%3D%3D";

// Fallback dataset for Busan festivals in case API service key is missing or external server has downtime
const FALLBACK_BUSAN_FESTIVALS = [
  {
    UC_SEQ: 1001,
    MAIN_TITLE: "부산불꽃축제 (Busan Fireworks Festival)",
    GUGUN_NM: "수영구",
    ADDR1: "부산광역시 수영구 광안해변로 219 (광안리해수욕장)",
    CNTCT_TEL: "051-713-5000",
    HOMEPAGE_URL: "https://www.bfo.or.kr",
    USAGE_DAY_WEEK_AND_TIME: "2026.11.07 ~ 2026.11.07 / 14:00 ~ 21:00",
    MAIN_IMG_NORMAL: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
    MAIN_IMG_THUMB: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80",
    ITEMCNTNTS: "세계적인 수준의 멀티미디어 불꽃쇼와 음악, 레이저 연출이 조화된 부산 대표 야간 축제입니다. 광안대교를 배경으로 화려하게 펼쳐지는 불꽃의 장관을 만끽하세요.",
    LAT: 35.1531696,
    LNG: 129.1189737,
    USAGE_AMOUNT: "무료 (일부 지정석 유료)",
    MAIN_PLACE: "광안리해수욕장 및 광안대교 일원",
    MIDDLE_SIZE_RM1: "주차장 혼잡, 도시철도 2호선 금련산역/광안역 이용 권장"
  },
  {
    UC_SEQ: 1002,
    MAIN_TITLE: "해운대 모래축제 (Haeundae Sand Festival)",
    GUGUN_NM: "해운대구",
    ADDR1: "부산광역시 해운대구 달맞이길62번길 47 (해운대해수욕장)",
    CNTCT_TEL: "051-749-4000",
    HOMEPAGE_URL: "https://www.haeundae.go.kr",
    USAGE_DAY_WEEK_AND_TIME: "2026.05.22 ~ 2026.05.25 / 10:00 ~ 22:00",
    MAIN_IMG_NORMAL: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    MAIN_IMG_THUMB: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
    ITEMCNTNTS: "국내 유일의 모래를 소재로 한 친환경 해변 축제로, 세계적인 모래조각가들의 작품 전시, 샌드보드, 모래조각 체험 등 다채로운 프로그램이 펼쳐집니다.",
    LAT: 35.1587,
    LNG: 129.1604,
    USAGE_AMOUNT: "무료",
    MAIN_PLACE: "해운대해수욕장 및 구남로 광장",
    MIDDLE_SIZE_RM1: "해운대역 도보 5분"
  },
  {
    UC_SEQ: 1003,
    MAIN_TITLE: "부산국제영화제 (Busan International Film Festival - BIFF)",
    GUGUN_NM: "해운대구",
    ADDR1: "부산광역시 해운대구 수영강변대로 120 (영화의전당)",
    CNTCT_TEL: "1688-3010",
    HOMEPAGE_URL: "https://www.biff.kr",
    USAGE_DAY_WEEK_AND_TIME: "2026.10.07 ~ 2026.10.16 / 상영시간표 참조",
    MAIN_IMG_NORMAL: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80",
    MAIN_IMG_THUMB: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=400&q=80",
    ITEMCNTNTS: "아시아 최대 영화 축제로, 전 세계 우수 영화 상영과 더불어 거장들과의 만남, 야외 무대인사 등 세계 영화인들의 뜨거운 열기를 경험할 수 있습니다.",
    LAT: 35.1711,
    LNG: 129.1272,
    USAGE_AMOUNT: "일반 상영작 8,000원~10,000원",
    MAIN_PLACE: "영화의전당, 센텀시티 일대 극장",
    MIDDLE_SIZE_RM1: "센텀시티역 도보 5분"
  },
  {
    UC_SEQ: 1004,
    MAIN_TITLE: "부산항축제 (Busan Port Festival)",
    GUGUN_NM: "영도구",
    ADDR1: "부산광역시 영도구 해양로 301번길 45 (국립해양박물관 일원)",
    CNTCT_TEL: "051-713-5000",
    HOMEPAGE_URL: "https://www.bfo.or.kr",
    USAGE_DAY_WEEK_AND_TIME: "2026.06.01 ~ 2026.06.02 / 10:00 ~ 21:00",
    MAIN_IMG_NORMAL: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1200&q=80",
    MAIN_IMG_THUMB: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=400&q=80",
    ITEMCNTNTS: "세계 5대 항만인 부산항을 만끽할 수 있는 해양 축제로, 함정 공개 행사, 해양 레포츠 체험, 드론 라이트쇼 등 유익한 해양 문화체험이 준비되어 있습니다.",
    LAT: 35.0912,
    LNG: 129.0792,
    USAGE_AMOUNT: "무료 (체험 프로그램 일부 유료)",
    MAIN_PLACE: "국립해양박물관 및 부산항 국제여객터미널 야외주차장",
    MIDDLE_SIZE_RM1: "셔틀버스 운행"
  },
  {
    UC_SEQ: 1005,
    MAIN_TITLE: "부산바다축제 (Busan Sea Festival)",
    GUGUN_NM: "수영구",
    ADDR1: "부산광역시 수영구 광안해변로 219 (다대포, 광안리)",
    CNTCT_TEL: "051-713-5000",
    HOMEPAGE_URL: "https://www.bfo.or.kr",
    USAGE_DAY_WEEK_AND_TIME: "2026.08.01 ~ 2026.08.05 / 18:00 ~ 22:00",
    MAIN_IMG_NORMAL: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    MAIN_IMG_THUMB: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
    ITEMCNTNTS: "부산의 대표 여름 해변 축제! 광안리와 다대포 해수욕장을 무대로 나이트 풀파티, 힙합/댄스 공연, 해변 워터 레이스 등 젊음과 열정이 가득한 공간이 펼쳐집니다.",
    LAT: 35.1531,
    LNG: 129.1189,
    USAGE_AMOUNT: "무료",
    MAIN_PLACE: "다대포해수욕장, 광안리해수욕장",
    MIDDLE_SIZE_RM1: "도시철도 이용 권장"
  },
  {
    UC_SEQ: 1006,
    MAIN_TITLE: "광안리 어방축제 (Gwangalli Eobang Festival)",
    GUGUN_NM: "수영구",
    ADDR1: "부산광역시 수영구 광안해변로 219 (광안리해수욕장 일원)",
    CNTCT_TEL: "051-610-4062",
    HOMEPAGE_URL: "http://www.suyeong.go.kr/eobang",
    USAGE_DAY_WEEK_AND_TIME: "2026.05.10 ~ 2026.05.12 / 10:00 ~ 21:00",
    MAIN_IMG_NORMAL: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80",
    MAIN_IMG_THUMB: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=400&q=80",
    ITEMCNTNTS: "조선시대 전통 어촌 문화와 어방(漁坊)의 역사를 담은 대표 문화관광축제입니다. 진두어화 퍼레이드, 맨손으로 고기잡기, 어방그물끌기 등 민속 체험을 할 수 있습니다.",
    LAT: 35.1532,
    LNG: 129.1188,
    USAGE_AMOUNT: "무료 (체험비 별도)",
    MAIN_PLACE: "광안리해수욕장, 수영사적공원",
    MIDDLE_SIZE_RM1: "광안역 3, 5번 출구"
  },
  {
    UC_SEQ: 1007,
    MAIN_TITLE: "부산 원아시아페스티벌 (BOF - Busan One Asia Festival)",
    GUGUN_NM: "연제구",
    ADDR1: "부산광역시 연제구 월드컵대로 344 (부산아시아드주경기장)",
    CNTCT_TEL: "051-713-5000",
    HOMEPAGE_URL: "https://bof.or.kr",
    USAGE_DAY_WEEK_AND_TIME: "2026.10.18 ~ 2026.10.21 / 18:00 ~ 21:30",
    MAIN_IMG_NORMAL: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
    MAIN_IMG_THUMB: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&q=80",
    ITEMCNTNTS: "아시아 최고의 K-POP 한류 문화 축제! 정상급 K-POP 아티스트들의 콘서트와 K-뷰티, K-푸드 체험전 등 전 세계 한류 팬들을 위한 초대형 페스티벌입니다.",
    LAT: 35.1901,
    LNG: 129.0716,
    USAGE_AMOUNT: "유료 (좌석 등급별 상이)",
    MAIN_PLACE: "부산아시아드주경기장, 화명생태공원",
    MIDDLE_SIZE_RM1: "종합운동장역 이용"
  },
  {
    UC_SEQ: 1008,
    MAIN_TITLE: "자갈치축제 (Busan Jagalchi Festival)",
    GUGUN_NM: "중구",
    ADDR1: "부산광역시 중구 자갈치해안로 52 (자갈치시장 일원)",
    CNTCT_TEL: "051-243-9363",
    HOMEPAGE_URL: "http://www.yjg.co.kr",
    USAGE_DAY_WEEK_AND_TIME: "2026.10.15 ~ 2026.10.18 / 10:00 ~ 21:00",
    MAIN_IMG_NORMAL: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1200&q=80",
    MAIN_IMG_THUMB: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=400&q=80",
    ITEMCNTNTS: "'오이소! 보이소! 사이소!' 정겨운 구호와 함께 펼쳐지는 한국 대표 수산물 축제. 장어 수구레 체험, 무료 회 시식, 용왕제 등 남포동 자갈치의 흥겨움을 즐겨보세요.",
    LAT: 35.0967,
    LNG: 129.0306,
    USAGE_AMOUNT: "무료 (먹거리 구매 별도)",
    MAIN_PLACE: "자갈치시장, 유라리광장 일원",
    MIDDLE_SIZE_RM1: "자갈치역 10번 출구"
  }
];

export default async function handler(req: any, res: any) {
  // Set CORS headers for Vercel deployment compatibility
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const rawKey = process.env.FESTIVAL_SERVICE_KEY || process.env.VITE_FESTIVAL_SERVICE_KEY || DEFAULT_SERVICE_KEY;
    const serviceKey = rawKey.includes("%") ? decodeURIComponent(rawKey) : rawKey;

    const pageNo = req.query?.pageNo || 1;
    const numOfRows = req.query?.numOfRows || 100;

    const url = new URL("https://apis.data.go.kr/6260000/FestivalService/getFestivalKr");
    url.searchParams.append("serviceKey", serviceKey);
    url.searchParams.append("pageNo", String(pageNo));
    url.searchParams.append("numOfRows", String(numOfRows));
    url.searchParams.append("resultType", "json");

    const response = await fetch(url.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status} from data.go.kr`);
    }

    const data = await response.json();
    let items: any[] = [];
    let totalCount = 0;

    if (data?.getFestivalKr?.item) {
      items = Array.isArray(data.getFestivalKr.item) ? data.getFestivalKr.item : [data.getFestivalKr.item];
      totalCount = data.getFestivalKr.totalCount || items.length;
    } else if (data?.getFestivalKr?.body?.items?.item) {
      const raw = data.getFestivalKr.body.items.item;
      items = Array.isArray(raw) ? raw : [raw];
      totalCount = data.getFestivalKr.body.totalCount || items.length;
    } else if (data?.response?.body?.items?.item) {
      const raw = data.response.body.items.item;
      items = Array.isArray(raw) ? raw : [raw];
      totalCount = data.response.body.totalCount || items.length;
    }

    if (items && items.length > 0) {
      return res.status(200).json({
        success: true,
        source: "api",
        totalCount,
        items
      });
    }

    return res.status(200).json({
      success: true,
      source: "fallback",
      totalCount: FALLBACK_BUSAN_FESTIVALS.length,
      items: FALLBACK_BUSAN_FESTIVALS
    });
  } catch (error: any) {
    return res.status(200).json({
      success: true,
      source: "fallback",
      error: error.message,
      totalCount: FALLBACK_BUSAN_FESTIVALS.length,
      items: FALLBACK_BUSAN_FESTIVALS
    });
  }
}
