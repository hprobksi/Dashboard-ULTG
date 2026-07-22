import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const token = "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1hIjoiUklLSSBIQVJESUFOVE8iLCJlbWFpbCI6InJpa2kuaEBwbG4uY28uaWQiLCJzc28iOnRydWUsImdhbnRpUGFzc3dvcmQiOmZhbHNlLCJleHBpcmVkVG9rZW4iOiIyMDI2LTA3LTE0IDA4OjU0OjAyIiwidG5jQ2xpY2tlZCI6dHJ1ZSwiZ2FudGlQaW4iOmZhbHNlLCJwaW4iOnRydWUsImphYmF0YW4iOiJTVEFGRiIsImlzRXJzIjpmYWxzZSwiaXNGZmUiOmZhbHNlLCJsaXN0VW5pdEJpZGFuZyI6WyJUUkFOU01JU0kiXSwibGlzdFN1YlVuaXRCaWRhbmciOltdLCJpZFJlZ2lvbmFsIjoiYmU1ZGQyYWMtY2E0YS00OTZjLTkzNTYtNzc3NzdkODE3ODdjIiwicmVnaW9uYWwiOiJUU0oiLCJpZFVuaXRJbmR1ayI6ImQ2ZTNmMDExLTI1MDUtNDlmMC05Y2NhLTVjMGU3MTQzMjE0MiIsInVuaXRJbmR1ayI6IlVJVEpCVCIsImlkVW5pdFBlbGFrc2FuYSI6IjRhNTg0MDc0LTA1YjQtNDYzNy1iNTQwLThkNTlkMTlmNDM4MSIsInVuaXRQZWxha3NhbmEiOiJVUFQgQkVLQVNJIiwiaWRMb2thc2lEaW5hcyI6IjQxMjU3ZjQ1LWFhNzctNDQwNy04NjMzLWJkMGQ0NWExNzlkYiIsIm5hbWFMb2thc2lEaW5hcyI6IlVMVEcgQkVLQVNJIiwidW5pdFBsbiI6IlVMVEciLCJpc1BldHVnYXMiOnRydWUsImxhdGl0dWRlIjoiLTYuMjM4MyIsImxvbmdpdHVkZSI6IjEwNi45NzU2IiwiZGl2aXNpIjpudWxsfQ.XGW7xN8PVez_DgmDuUwNa8J9_VrQnLgbDrfwD-hY4hQSv9hdGaAqQf6LeTkxWJIy6b_rXqXKoiC2BYSPc8FQLw";

const payload = {
  "idRegional": "be5dd2ac-ca4a-496c-9356-77777d81787c",
  "idUnitInduk": "d6e3f011-2505-49f0-9cca-5c0e71432142",
  "idUnitPelaksana": "4a584074-05b4-4637-b540-8d59d19f4381",
  "idUltg": "41257f45-aa77-4407-8633-bd0d45a179db",
  "idGarduInduk": null,
  "idBay": null,
  "idJenisAsset": null,
  "keyword": null
};

async function run() {
  console.log("⏳ Mengambil seluruh data Anomali dari apipowerinspect.pln.co.id (via Node.js tanpa CORS)...");
  try {
    const res = await fetch("https://apipowerinspect.pln.co.id/monitoring-anomali/find-all?page=0&size=1000", {
      method: "POST",
      headers: {
        "accept": "application/json, text/plain, */*",
        "authorization": token,
        "content-type": "application/json",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const txt = await res.text();
      console.error(`❌ HTTP Error ${res.status}: ${res.statusText}`);
      console.error(txt.substring(0, 500));
      return;
    }

    const data = await res.json();
    const list = data.data?.content || data.content || [];
    console.log(`✅ BERHASIL! Mendapatkan total ${list.length} data anomali dari server PLN.`);
    console.log(`📊 Total Elements di server: ${data.data?.totalElements || data.totalElements || list.length}`);

    const targetPath = path.resolve(__dirname, 'pln_bridge_data.json');
    fs.writeFileSync(targetPath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`💾 Data tersimpan rapi di: ${targetPath}`);
  } catch (err) {
    console.error("❌ Error:", err);
  }
}

run();
