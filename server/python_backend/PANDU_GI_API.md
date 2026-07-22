# REST API PANDU-GI - Alarm Center

Endpoint read-only untuk mengambil data Alarm Center/Announciator VoltKraf.

## Endpoint

```http
GET /api/integrations/pandu-gi/alarm-center
```

## Header API Key

Gunakan salah satu format berikut:

```http
X-API-Key: isi_api_key
```

atau:

```http
Authorization: Bearer isi_api_key
```

API key lokal tersimpan di:

```text
pandu_gi_api_key.txt
```

## Query Opsional

```text
source_id=gi-poncol-baru-kopel-150kv
history_limit=100
```

`history_limit` dibatasi 1 sampai 500.

## Contoh cURL

```bash
curl -H "X-API-Key: isi_api_key" \
  "http://127.0.0.1:8000/api/integrations/pandu-gi/alarm-center?history_limit=100"
```

## Response Utama

```json
{
  "service": "VoltKraf",
  "integration": "PANDU-GI",
  "menu": "Alarm Center",
  "summary": {
    "source_count": 5,
    "connected_count": 5,
    "active_alarm_count": 1,
    "history_count": 100,
    "auto_polling_active": true,
    "poll_interval_seconds": 5
  },
  "sources": [],
  "active_alarms": [],
  "history": []
}
```
