import localforage from 'localforage';
import fallbackMaster from '../data/fallback_master.json';

const SPREADSHEET_ID = "1aiQ7V33pNatowwYQbLG-y8l-e2TEfDjAaX_FpqebnUQ";

const gsheetStore = localforage.createInstance({
  name: 'HarproUltgBekasi',
  storeName: 'gsheet_cache'
});

// Robust CSV Parser yang menangani multiline quotes dan koma dalam sel
function parseCSV(str) {
  const arr = [];
  let quote = false;
  let col = 0;
  let row = 0;
  
  for (let c = 0; c < str.length; c++) {
    const cc = str[c];
    const nc = str[c + 1];
    
    arr[row] = arr[row] || [];
    arr[row][col] = arr[row][col] || '';
    
    if (cc === '"' && quote && nc === '"') {
      arr[row][col] += cc;
      c++;
      continue;
    }
    if (cc === '"') {
      quote = !quote;
      continue;
    }
    if (cc === ',' && !quote) {
      col++;
      continue;
    }
    if (cc === '\r' && nc === '\n' && !quote) {
      row++;
      col = 0;
      c++;
      continue;
    }
    if (cc === '\n' && !quote) {
      row++;
      col = 0;
      continue;
    }
    if (cc === '\r' && !quote) {
      row++;
      col = 0;
      continue;
    }
    arr[row][col] += cc;
  }
  
  // Clean up empty trailing rows
  return arr.filter(r => r.some(cell => cell.trim().length > 0));
}

export const gsheetService = {
  async fetchSheetData(gid, forceRefresh = false) {
    const cacheKey = `sheet_data_${gid}`;
    
    if (!forceRefresh) {
      const cached = await gsheetStore.getItem(cacheKey);
      if (cached && (Date.now() - cached.timestamp < 10 * 60 * 1000)) { // 10 menit cache
        return { rows: cached.rows, fromCache: true, lastUpdated: new Date(cached.timestamp).toLocaleTimeString('id-ID') };
      }
    }

    // Utamakan proxy /api-gsheet untuk bypass CORS di browser, fallback ke direct docs.google.com
    const urls = [
      `/api-gsheet/${SPREADSHEET_ID}/export?format=csv&gid=${gid}`,
      `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=${gid}`,
      `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&gid=${gid}`
    ];
    
    let rows = null;
    let lastErr = null;

    for (const url of urls) {
      try {
        const response = await fetch(url);
        if (!response.ok) continue;
        const csvText = await response.text();
        const parsed = parseCSV(csvText);
        if (parsed && parsed.length > 0) {
          rows = parsed;
          break;
        }
      } catch (err) {
        lastErr = err;
      }
    }
    
    try {
      if (!rows || rows.length === 0) {
        throw new Error(lastErr ? lastErr.message : "Gagal membaca CSV dari Google Sheets");
      }
      
      const cacheData = { rows, timestamp: Date.now() };
      await gsheetStore.setItem(cacheKey, cacheData);
      
      return { rows, fromCache: false, lastUpdated: new Date().toLocaleTimeString('id-ID') };
    } catch (error) {
      console.warn(`Gagal fetch live G-Sheet gid=${gid}, mencoba muat dari cache lokal atau fallback master:`, error);
      const cached = await gsheetStore.getItem(cacheKey);
      if (cached && cached.rows && cached.rows.length > 0) {
        return { rows: cached.rows, fromCache: true, lastUpdated: new Date(cached.timestamp).toLocaleTimeString('id-ID') + ' (Offline Cache)' };
      }
      if (fallbackMaster[gid]) {
        return { rows: fallbackMaster[gid].rows, fromCache: true, lastUpdated: 'Master Lokal PLN' };
      }
      throw new Error(`Gagal membaca spreadsheet: ${error.message}`);
    }
  }
};
