import localforage from 'localforage';
import {
  HARGI_PROGRAM_SHEETS,
  HARGI_SPREADSHEET_ID,
  parseHargiProgramCsv,
  summarizeHargiPrograms
} from './hargiProgramUtils';

const CACHE_DURATION_MS = 10 * 60 * 1000;

const hargiProgramStore = localforage.createInstance({
  name: 'DashboardAiHargi',
  storeName: 'program_kerja_cache'
});

async function fetchSheetCsv(sheet) {
  const urls = [
    `/api-gsheet/${HARGI_SPREADSHEET_ID}/export?format=csv&gid=${sheet.gid}`,
    `https://docs.google.com/spreadsheets/d/${HARGI_SPREADSHEET_ID}/export?format=csv&gid=${sheet.gid}`,
    `https://docs.google.com/spreadsheets/d/${HARGI_SPREADSHEET_ID}/gviz/tq?tqx=out:csv&gid=${sheet.gid}`
  ];

  let lastError = null;
  for (const url of urls) {
    try {
      const response = await fetch(url);
      if (!response.ok) continue;
      const csv = await response.text();
      if (csv && csv.trim()) return csv;
    } catch (error) {
      lastError = error;
    }
  }

  throw new Error(lastError?.message || `Gagal membaca ${sheet.title}`);
}

export const hargiProgramKerjaService = {
  async fetchAll(forceRefresh = false) {
    const cacheKey = 'hargi_program_kerja_all';

    if (!forceRefresh) {
      const cached = await hargiProgramStore.getItem(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION_MS) {
        return {
          ...cached.data,
          fromCache: true,
          lastUpdated: new Date(cached.timestamp).toLocaleTimeString('id-ID')
        };
      }
    }

    try {
      const sheets = await Promise.all(
        HARGI_PROGRAM_SHEETS.map(async sheet => {
          const csv = await fetchSheetCsv(sheet);
          return parseHargiProgramCsv(csv, sheet);
        })
      );

      const data = {
        spreadsheetId: HARGI_SPREADSHEET_ID,
        scope: 'ULTG BEKASI',
        sheets,
        summary: summarizeHargiPrograms(sheets)
      };

      await hargiProgramStore.setItem(cacheKey, { data, timestamp: Date.now() });

      return {
        ...data,
        fromCache: false,
        lastUpdated: new Date().toLocaleTimeString('id-ID')
      };
    } catch (error) {
      const cached = await hargiProgramStore.getItem(cacheKey);
      if (cached?.data) {
        return {
          ...cached.data,
          fromCache: true,
          lastUpdated: `${new Date(cached.timestamp).toLocaleTimeString('id-ID')} (Offline Cache)`,
          warning: error.message
        };
      }

      throw error;
    }
  }
};
