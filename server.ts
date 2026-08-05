import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Default provided service key fallback if process.env.FESTIVAL_SERVICE_KEY is not set
const DEFAULT_SERVICE_KEY = "BB1TulnBLsLbOnjG3h050QSaljEaJnKchn7XVELfKrIA%2FGCBZxxI9tRL2eRfo%2FsBqXOTDr2L0tGBQYtJMfanYA%3D%3D";

app.use(express.json());

// API route for fetching Busan Festival Data
app.get("/api/festivals", async (req, res) => {
  try {
    const rawKey = process.env.FESTIVAL_SERVICE_KEY || DEFAULT_SERVICE_KEY;
    // Note: data.go.kr expects serviceKey to be either encoded or decoded depending on standard fetch URL parameters.
    // Decoding if already encoded or passing directly:
    const serviceKey = rawKey.includes("%") ? decodeURIComponent(rawKey) : rawKey;

    const pageNo = req.query.pageNo || 1;
    const numOfRows = req.query.numOfRows || 100;

    const url = new URL("https://apis.data.go.kr/6260000/FestivalService/getFestivalKr");
    url.searchParams.append("serviceKey", serviceKey);
    url.searchParams.append("pageNo", String(pageNo));
    url.searchParams.append("numOfRows", String(numOfRows));
    url.searchParams.append("resultType", "json");

    console.log(`[API Proxy] Fetching Busan Festivals from data.go.kr...`);

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
    
    // Extract item list from various possible response formats from data.go.kr
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

    // If API response is valid and contains items, return
    if (items && items.length > 0) {
      return res.json({
        success: true,
        source: "api",
        totalCount,
        items
      });
    }

    // If external API returned empty or standard message error, fallback to curated dataset
    console.warn("[API Proxy] External API returned no items, providing curated Busan Festival data fallback.");
    return res.json({
      success: true,
      source: "fallback",
      totalCount: FALLBACK_BUSAN_FESTIVALS.length,
      items: FALLBACK_BUSAN_FESTIVALS
    });

  } catch (error: any) {
    console.error("[API Proxy Error]", error.message);
    // Return realistic fallback data on connection error or key issue
    return res.json({
      success: true,
      source: "fallback",
      error: error.message,
      totalCount: FALLBACK_BUSAN_FESTIVALS.length,
      items: FALLBACK_BUSAN_FESTIVALS
    });
  }
});

// Curated realistic fallback dataset of famous Busan Festivals
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
    MAIN_TITLE: "삼락 생태공원 벚꽃축제 및 삼락락페스티벌",
    GUGUN_NM: "사상구",
    ADDR1: "부산광역시 사상구 삼락동 29-46 (삼락생태공원)",
    CNTCT_TEL: "051-310-4000",
    HOMEPAGE_URL: "https://www.sasang.go.kr",
    USAGE_DAY_WEEK_AND_TIME: "2026.03.28 ~ 2026.04.05 / 09:00 ~ 20:00",
    MAIN_IMG_NORMAL: "https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&w=1200&q=80",
    MAIN_IMG_THUMB: "https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&w=400&q=80",
    ITEMCNTNTS: "낙동강변 삼락생태공원의 화려한 벚꽃 터널과 함께 펼쳐지는 봄맞이 대표 꽃축제 및 음악 공연 이벤트입니다.",
    LAT: 35.1668,
    LNG: 128.9712,
    USAGE_AMOUNT: "무료",
    MAIN_PLACE: "삼락생태공원 벚꽃단지",
    MIDDLE_SIZE_RM1: "괘법르네시떼역 도보 10분"
  },
  {
    UC_SEQ: 1008,
    MAIN_TITLE: "부산자갈치축제 (Jagalchi Festival)",
    GUGUN_NM: "중구",
    ADDR1: "부산광역시 중구 자갈치해안로 52 (자갈치시장 일원)",
    CNTCT_TEL: "051-243-9363",
    HOMEPAGE_URL: "http://www.biff.or.kr",
    USAGE_DAY_WEEK_AND_TIME: "2026.10.15 ~ 2026.10.18 / 10:00 ~ 21:00",
    MAIN_IMG_NORMAL: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1200&q=80",
    MAIN_IMG_THUMB: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=400&q=80",
    ITEMCNTNTS: "오이소! 보이소! 사이소! 한국 대표 수산물 축제로 싱싱한 수산물 시식회, 용왕제, 수산물 경매 체험, 해상 불꽃쇼 등 정겨운 자갈치 아지매의 인심을 느낄 수 있습니다.",
    LAT: 35.0967,
    LNG: 129.0306,
    USAGE_AMOUNT: "무료",
    MAIN_PLACE: "자갈치시장, 남포동 유라리광장",
    MIDDLE_SIZE_RM1: "자갈치역 10번 출구"
  },
  {
    UC_SEQ: 1009,
    MAIN_TITLE: "금정산성 축제 (Geumjeong Sanseong Festival)",
    GUGUN_NM: "금정구",
    ADDR1: "부산광역시 금정구 산성로 475 (금정산성 및 금성동 일원)",
    CNTCT_TEL: "051-519-4062",
    HOMEPAGE_URL: "https://www.geumjeong.go.kr",
    USAGE_DAY_WEEK_AND_TIME: "2026.05.24 ~ 2026.05.26 / 10:00 ~ 18:00",
    MAIN_IMG_NORMAL: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    MAIN_IMG_THUMB: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80",
    ITEMCNTNTS: "대한민국 사적 제215호 금정산성과 금정산성막걸리문화를 배경으로 성곽길 걷기, 전통 막걸리 만들기, 산성 역사 체험 등이 함께하는 자연문화 축제입니다.",
    LAT: 35.2536,
    LNG: 129.0622,
    USAGE_AMOUNT: "무료",
    MAIN_PLACE: "금정산성 잔디광장, 동문 일원",
    MIDDLE_SIZE_RM1: "온천장역에서 마을버스 203번"
  },
  {
    UC_SEQ: 1010,
    MAIN_TITLE: "영도 다리축제 (Yeongdo Bridge Festival)",
    GUGUN_NM: "영도구",
    ADDR1: "부산광역시 영도구 대교동1가 (영도대교 및 봉래동 물양장)",
    CNTCT_TEL: "051-419-4061",
    HOMEPAGE_URL: "http://www.yeongdo.go.kr",
    USAGE_DAY_WEEK_AND_TIME: "2026.10.23 ~ 2026.10.25 / 11:00 ~ 21:00",
    MAIN_IMG_NORMAL: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=1200&q=80",
    MAIN_IMG_THUMB: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=400&q=80",
    ITEMCNTNTS: "피란민의 애환이 서린 역사와 국내 유일의 도개교인 영도대교를 정체성으로 삼아 도개 퍼포먼스, 굳세어라 금순아 가요제, 봉래동 물양장 야간 포차 등 역사문화 체험을 제공합니다.",
    LAT: 35.0955,
    LNG: 129.0371,
    USAGE_AMOUNT: "무료",
    MAIN_PLACE: "영도대교, 봉래동 물양장 일원",
    MIDDLE_SIZE_RM1: "남포역 6번 출구 도보 3분"
  },
  {
    UC_SEQ: 1011,
    MAIN_TITLE: "부산 원도심 골목길 축제",
    GUGUN_NM: "동구",
    ADDR1: "부산광역시 동구 중앙대로 206 (부산역 및 초량이바구길 일원)",
    CNTCT_TEL: "051-713-5000",
    HOMEPAGE_URL: "https://www.bfo.or.kr",
    USAGE_DAY_WEEK_AND_TIME: "2026.06.12 ~ 2026.06.14 / 10:00 ~ 18:00",
    MAIN_IMG_NORMAL: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80",
    MAIN_IMG_THUMB: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=400&q=80",
    ITEMCNTNTS: "부산의 뿌리인 원도심 4개 구(중구, 서구, 동구, 영도구)의 개성 있는 골목길 이야기를 미션 스탬프 투어와 함께 레트로 투어로 탐방하는 테마 축제입니다.",
    LAT: 35.1152,
    LNG: 129.0422,
    USAGE_AMOUNT: "무료",
    MAIN_PLACE: "초량이바구길, 흰여울문화마을, 감천문화마을",
    MIDDLE_SIZE_RM1: "부산역, 남포역 중심"
  },
  {
    UC_SEQ: 1012,
    MAIN_TITLE: "기장 멸치축제 (Gijang Anchovy Festival)",
    GUGUN_NM: "기장군",
    ADDR1: "부산광역시 기장군 기장읍 대변포구 일원",
    CNTCT_TEL: "051-709-4000",
    HOMEPAGE_URL: "http://www.gijang.go.kr",
    USAGE_DAY_WEEK_AND_TIME: "2026.04.18 ~ 2026.04.20 / 10:00 ~ 20:00",
    MAIN_IMG_NORMAL: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
    MAIN_IMG_THUMB: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80",
    ITEMCNTNTS: "봄철 최고의 별미 기장 대변항의 싱싱한 멸치를 주제로 생멸치 무료 시식회, 멸치 털기 퍼포먼스, 해상 연출 등 상큼하고 활력 넘치는 포구 축제입니다.",
    LAT: 35.2256,
    LNG: 129.2289,
    USAGE_AMOUNT: "무료",
    MAIN_PLACE: "기장읍 대변항 일원",
    MIDDLE_SIZE_RM1: "오시리아역에서 버스 이동"
  }
];

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
