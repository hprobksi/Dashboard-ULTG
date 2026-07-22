import json
import os
import sqlite3
import threading
from datetime import datetime


DB_FILE = os.getenv("VoltKraf_DB_FILE") or os.getenv("VOLTCRAFT_DB_FILE") or "VoltKraf.db"
_DB_LOCK = threading.RLock()


def utcnow_text():
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def get_connection():
    conn = sqlite3.connect(DB_FILE, timeout=10)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


def row_to_dict(row):
    return dict(row) if row is not None else None


def ensure_pqm_device_schema(conn):
    columns = {
        row["name"]
        for row in conn.execute("PRAGMA table_info(pqm_devices)").fetchall()
    }
    if "pqm_type" not in columns:
        conn.execute(
            "ALTER TABLE pqm_devices "
            "ADD COLUMN pqm_type TEXT NOT NULL DEFAULT 'ion7650'"
        )
    if "enabled" not in columns:
        conn.execute(
            "ALTER TABLE pqm_devices "
            "ADD COLUMN enabled INTEGER NOT NULL DEFAULT 1"
        )
    conn.execute(
        """
        UPDATE pqm_devices
        SET pqm_type = 'ion7650'
        WHERE pqm_type IS NULL OR TRIM(pqm_type) = ''
        """
    )


def init_database():
    with _DB_LOCK, get_connection() as conn:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS gi_devices (
                nama TEXT PRIMARY KEY,
                ip TEXT NOT NULL UNIQUE,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS dc_register_config (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ip_gi TEXT NOT NULL,
                nama_gi TEXT NOT NULL,
                channel INTEGER NOT NULL DEFAULT 1,
                sinyal TEXT NOT NULL,
                register_address INTEGER NOT NULL,
                UNIQUE(ip_gi, channel, sinyal)
            );

            CREATE TABLE IF NOT EXISTS pqm_devices (
                id TEXT PRIMARY KEY,
                nama_gi TEXT NOT NULL,
                nama_bay TEXT NOT NULL,
                ip TEXT NOT NULL UNIQUE,
                pqm_type TEXT NOT NULL DEFAULT 'ion7650',
                port INTEGER NOT NULL DEFAULT 502,
                slave_id INTEGER NOT NULL DEFAULT 1,
                start_address INTEGER NOT NULL DEFAULT 147,
                count INTEGER NOT NULL DEFAULT 130,
                enabled INTEGER NOT NULL DEFAULT 1,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(nama_gi, nama_bay)
            );

            CREATE TABLE IF NOT EXISTS dc_readings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                waktu TEXT NOT NULL,
                nama TEXT NOT NULL,
                ip TEXT NOT NULL,
                v_pn REAL NOT NULL DEFAULT 0,
                arus REAL NOT NULL DEFAULT 0,
                v_pg REAL NOT NULL DEFAULT 0,
                v_ng REAL NOT NULL DEFAULT 0,
                status TEXT NOT NULL,
                alarm_level TEXT NOT NULL DEFAULT 'normal'
            );

            CREATE INDEX IF NOT EXISTS idx_dc_readings_nama_id
                ON dc_readings(nama, id DESC);

            CREATE TABLE IF NOT EXISTS pqm_readings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                device_id TEXT NOT NULL,
                waktu TEXT NOT NULL,
                connected INTEGER NOT NULL DEFAULT 0,
                status_message TEXT NOT NULL DEFAULT '',
                current_a REAL NOT NULL DEFAULT 0,
                current_b REAL NOT NULL DEFAULT 0,
                current_c REAL NOT NULL DEFAULT 0,
                current_avg REAL NOT NULL DEFAULT 0,
                freq REAL NOT NULL DEFAULT 0,
                v_unbal REAL NOT NULL DEFAULT 0,
                v_an INTEGER NOT NULL DEFAULT 0,
                v_bn INTEGER NOT NULL DEFAULT 0,
                v_cn INTEGER NOT NULL DEFAULT 0,
                v_ab INTEGER NOT NULL DEFAULT 0,
                v_bc INTEGER NOT NULL DEFAULT 0,
                v_ca INTEGER NOT NULL DEFAULT 0,
                v_ll_avg INTEGER NOT NULL DEFAULT 0,
                kw_a INTEGER NOT NULL DEFAULT 0,
                kw_b INTEGER NOT NULL DEFAULT 0,
                kw_c INTEGER NOT NULL DEFAULT 0,
                kw_total INTEGER NOT NULL DEFAULT 0,
                kvar_total INTEGER NOT NULL DEFAULT 0,
                kva_total INTEGER NOT NULL DEFAULT 0,
                raw_json TEXT,
                FOREIGN KEY (device_id) REFERENCES pqm_devices(id)
                    ON DELETE CASCADE
            );

            CREATE INDEX IF NOT EXISTS idx_pqm_readings_device_id
                ON pqm_readings(device_id, id DESC);

            CREATE TABLE IF NOT EXISTS pqm_disturbance_events (
                id TEXT PRIMARY KEY,
                waktu TEXT NOT NULL,
                device_id TEXT NOT NULL,
                nama_gi TEXT NOT NULL,
                nama_bay TEXT NOT NULL,
                ip TEXT NOT NULL,
                event_type TEXT NOT NULL,
                counter_name TEXT NOT NULL,
                address INTEGER NOT NULL,
                previous_value INTEGER NOT NULL DEFAULT 0,
                current_value INTEGER NOT NULL DEFAULT 0,
                delta INTEGER NOT NULL DEFAULT 0,
                FOREIGN KEY (device_id) REFERENCES pqm_devices(id)
                    ON DELETE CASCADE
            );

            CREATE INDEX IF NOT EXISTS idx_pqm_disturbance_events_device_time
                ON pqm_disturbance_events(device_id, waktu DESC);

            CREATE TABLE IF NOT EXISTS pqm_itic_events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                device_id TEXT NOT NULL,
                waktu_mulai TEXT NOT NULL,
                waktu_selesai TEXT NOT NULL,
                nama_gi TEXT NOT NULL,
                nama_bay TEXT NOT NULL,
                ip TEXT NOT NULL,
                event_type TEXT NOT NULL,
                phase TEXT NOT NULL,
                duration_seconds REAL NOT NULL,
                magnitude_percent REAL NOT NULL,
                FOREIGN KEY (device_id) REFERENCES pqm_devices(id)
                    ON DELETE CASCADE
            );

            CREATE INDEX IF NOT EXISTS idx_pqm_itic_events_device_time
                ON pqm_itic_events(device_id, waktu_mulai DESC);

            CREATE TABLE IF NOT EXISTS dc_alarm_events (
                id TEXT PRIMARY KEY,
                waktu TEXT NOT NULL,
                nama TEXT NOT NULL,
                level TEXT NOT NULL,
                v_pg REAL NOT NULL DEFAULT 0,
                v_ng REAL NOT NULL DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS annunciator_sources (
                id TEXT PRIMARY KEY,
                source_name TEXT NOT NULL,
                bay_name TEXT NOT NULL,
                ip TEXT NOT NULL,
                api_url TEXT NOT NULL,
                target_alarm TEXT
            );

            CREATE TABLE IF NOT EXISTS annunciator_channels (
                source_id TEXT NOT NULL,
                port TEXT NOT NULL,
                nama_alat TEXT NOT NULL,
                kondisi TEXT NOT NULL DEFAULT '0',
                is_active INTEGER NOT NULL DEFAULT 0,
                detail TEXT,
                device_name TEXT,
                nama_gi TEXT,
                raw_json TEXT,
                last_update TEXT NOT NULL,
                PRIMARY KEY (source_id, port),
                FOREIGN KEY (source_id) REFERENCES annunciator_sources(id)
                    ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS annunciator_events (
                id TEXT PRIMARY KEY,
                waktu TEXT NOT NULL,
                source_id TEXT NOT NULL,
                source_name TEXT NOT NULL,
                bay_name TEXT NOT NULL,
                ip TEXT NOT NULL,
                port TEXT NOT NULL,
                nama_alat TEXT NOT NULL,
                level TEXT NOT NULL
            );

            CREATE INDEX IF NOT EXISTS idx_annunciator_events_source_time
                ON annunciator_events(source_id, waktu DESC);

            CREATE TABLE IF NOT EXISTS ar_events (
                id TEXT PRIMARY KEY,
                waktu TEXT NOT NULL,
                device_id TEXT NOT NULL,
                nama_gi TEXT NOT NULL,
                nama_bay TEXT NOT NULL,
                ip TEXT NOT NULL,
                group_name TEXT NOT NULL,
                point_key TEXT NOT NULL,
                point_label TEXT NOT NULL,
                reference TEXT NOT NULL,
                previous_value TEXT,
                current_value TEXT,
                quality TEXT,
                severity TEXT
            );

            CREATE INDEX IF NOT EXISTS idx_ar_events_device_time
                ON ar_events(device_id, waktu DESC);

            CREATE TABLE IF NOT EXISTS whatsapp_outbox (
                id TEXT PRIMARY KEY,
                digest TEXT NOT NULL UNIQUE,
                message TEXT NOT NULL,
                allow_recovery_recap INTEGER NOT NULL DEFAULT 1,
                status TEXT NOT NULL DEFAULT 'pending',
                attempts INTEGER NOT NULL DEFAULT 0,
                max_attempts INTEGER NOT NULL DEFAULT 0,
                next_attempt_at REAL NOT NULL DEFAULT 0,
                last_error TEXT,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                sent_at TEXT
            );

            CREATE INDEX IF NOT EXISTS idx_whatsapp_outbox_due
                ON whatsapp_outbox(status, next_attempt_at, created_at);

            CREATE TABLE IF NOT EXISTS app_settings (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL
            );
            """
        )
        ensure_pqm_device_schema(conn)
        conn.commit()


def upsert_annunciator_sources(sources):
    with _DB_LOCK, get_connection() as conn:
        conn.executemany(
            """
            INSERT INTO annunciator_sources (id, source_name, bay_name, ip, api_url, target_alarm)
            VALUES (:id, :source_name, :bay_name, :ip, :api_url, :target_alarm)
            ON CONFLICT(id) DO UPDATE SET
                source_name=excluded.source_name,
                bay_name=excluded.bay_name,
                ip=excluded.ip,
                api_url=excluded.api_url,
                target_alarm=excluded.target_alarm
            """,
            sources,
        )
        conn.commit()


def get_gi_devices():
    with _DB_LOCK, get_connection() as conn:
        rows = conn.execute("SELECT nama, ip FROM gi_devices ORDER BY nama").fetchall()
        return [row_to_dict(row) for row in rows]


def add_gi_device(nama, ip):
    with _DB_LOCK, get_connection() as conn:
        conn.execute(
            "INSERT OR IGNORE INTO gi_devices (nama, ip) VALUES (?, ?)",
            (nama, ip),
        )
        conn.commit()


def delete_gi_device(nama):
    with _DB_LOCK, get_connection() as conn:
        cur = conn.execute("DELETE FROM gi_devices WHERE nama = ?", (nama,))
        conn.commit()
        return cur.rowcount > 0


def upsert_pqm_device(device):
    payload = {
        **device,
        "pqm_type": device.get("pqm_type") or "ion7650",
    }
    with _DB_LOCK, get_connection() as conn:
        conn.execute(
            """
            INSERT INTO pqm_devices
                (id, nama_gi, nama_bay, ip, pqm_type, port, slave_id, start_address, count)
            VALUES
                (:id, :nama_gi, :nama_bay, :ip, :pqm_type, :port, :slave_id, :start_address, :count)
            ON CONFLICT(id) DO UPDATE SET
                nama_gi=excluded.nama_gi,
                nama_bay=excluded.nama_bay,
                ip=excluded.ip,
                pqm_type=excluded.pqm_type,
                port=excluded.port,
                slave_id=excluded.slave_id,
                start_address=excluded.start_address,
                count=excluded.count
            """,
            payload,
        )
        conn.commit()


def upsert_pqm_devices(devices):
    for device in devices:
        upsert_pqm_device(device)


def get_pqm_devices():
    with _DB_LOCK, get_connection() as conn:
        rows = conn.execute(
            """
            SELECT id, nama_gi, nama_bay, ip, pqm_type, port, slave_id, start_address, count, enabled, created_at
            FROM pqm_devices
            ORDER BY nama_gi, nama_bay
            """
        ).fetchall()
        return [row_to_dict(row) for row in rows]


def get_pqm_devices_with_latest_reading():
    with _DB_LOCK, get_connection() as conn:
        rows = conn.execute(
            """
            SELECT
                d.id,
                d.nama_gi,
                d.nama_bay,
                d.ip,
                d.pqm_type,
                d.port,
                d.slave_id,
                d.start_address,
                d.count,
                d.enabled,
                d.created_at,
                COALESCE(r.waktu, '') AS last_poll_time,
                COALESCE(r.connected, 0) AS connected,
                COALESCE(r.status_message, 'Belum ada polling PQM.') AS status_message,
                COALESCE(r.current_a, 0) AS current_a,
                COALESCE(r.current_b, 0) AS current_b,
                COALESCE(r.current_c, 0) AS current_c,
                COALESCE(r.current_avg, 0) AS current_avg,
                COALESCE(r.freq, 0) AS freq,
                COALESCE(r.v_unbal, 0) AS v_unbal,
                COALESCE(r.v_an, 0) AS v_an,
                COALESCE(r.v_bn, 0) AS v_bn,
                COALESCE(r.v_cn, 0) AS v_cn,
                COALESCE(r.v_ab, 0) AS v_ab,
                COALESCE(r.v_bc, 0) AS v_bc,
                COALESCE(r.v_ca, 0) AS v_ca,
                COALESCE(r.v_ll_avg, 0) AS v_ll_avg,
                COALESCE(r.kw_a, 0) AS kw_a,
                COALESCE(r.kw_b, 0) AS kw_b,
                COALESCE(r.kw_c, 0) AS kw_c,
                COALESCE(r.kw_total, 0) AS kw_total,
                COALESCE(r.kvar_total, 0) AS kvar_total,
                COALESCE(r.kva_total, 0) AS kva_total,
                COALESCE(r.raw_json, '') AS raw_json
            FROM pqm_devices d
            LEFT JOIN pqm_readings r
                ON r.id = (
                    SELECT r2.id
                    FROM pqm_readings r2
                    WHERE r2.device_id = d.id
                    ORDER BY r2.id DESC
                    LIMIT 1
                )
            ORDER BY d.nama_gi, d.nama_bay
            """
        ).fetchall()
        return [row_to_dict(row) for row in rows]


def add_pqm_device(device_id, nama_gi, nama_bay, ip, pqm_type="ion7650", port=502, slave_id=1, start_address=147, count=130):
    with _DB_LOCK, get_connection() as conn:
        conn.execute(
            """
            INSERT INTO pqm_devices
                (id, nama_gi, nama_bay, ip, pqm_type, port, slave_id, start_address, count)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (device_id, nama_gi, nama_bay, ip, pqm_type, port, slave_id, start_address, count),
        )
        conn.commit()


def delete_pqm_device(device_id):
    with _DB_LOCK, get_connection() as conn:
        cur = conn.execute("DELETE FROM pqm_devices WHERE id = ?", (device_id,))
        conn.commit()
        return cur.rowcount > 0


def toggle_pqm_device(device_id, enabled):
    with _DB_LOCK, get_connection() as conn:
        cur = conn.execute(
            "UPDATE pqm_devices SET enabled = ? WHERE id = ?",
            (1 if enabled else 0, device_id)
        )
        conn.commit()
        return cur.rowcount > 0


def insert_pqm_reading(item):
    with _DB_LOCK, get_connection() as conn:
        conn.execute(
            """
            INSERT INTO pqm_readings (
                device_id, waktu, connected, status_message,
                current_a, current_b, current_c, current_avg,
                freq, v_unbal, v_an, v_bn, v_cn,
                v_ab, v_bc, v_ca, v_ll_avg,
                kw_a, kw_b, kw_c, kw_total, kvar_total, kva_total,
                raw_json
            ) VALUES (
                :device_id, :waktu, :connected, :status_message,
                :current_a, :current_b, :current_c, :current_avg,
                :freq, :v_unbal, :v_an, :v_bn, :v_cn,
                :v_ab, :v_bc, :v_ca, :v_ll_avg,
                :kw_a, :kw_b, :kw_c, :kw_total, :kvar_total, :kva_total,
                :raw_json
            )
            """,
            item,
        )
        conn.commit()


def list_pqm_readings(device_id, limit=180):
    with _DB_LOCK, get_connection() as conn:
        rows = conn.execute(
            """
            SELECT
                id, device_id, waktu, connected, status_message,
                current_a, current_b, current_c, current_avg,
                freq, v_unbal, v_an, v_bn, v_cn,
                v_ab, v_bc, v_ca, v_ll_avg,
                kw_a, kw_b, kw_c, kw_total, kvar_total, kva_total,
                raw_json
            FROM pqm_readings
            WHERE device_id = ?
            ORDER BY id DESC
            LIMIT ?
            """,
            (device_id, int(limit)),
        ).fetchall()
        return [row_to_dict(row) for row in reversed(rows)]


def insert_pqm_disturbance_event(event):
    with _DB_LOCK, get_connection() as conn:
        conn.execute(
            """
            INSERT OR IGNORE INTO pqm_disturbance_events (
                id, waktu, device_id, nama_gi, nama_bay, ip,
                event_type, counter_name, address,
                previous_value, current_value, delta
            ) VALUES (
                :id, :waktu, :device_id, :nama_gi, :nama_bay, :ip,
                :event_type, :counter_name, :address,
                :previous_value, :current_value, :delta
            )
            """,
            event,
        )
        conn.commit()


def list_pqm_disturbance_events(limit=500, device_id=None):
    with _DB_LOCK, get_connection() as conn:
        if device_id:
            rows = conn.execute(
                """
                SELECT id, waktu, device_id, nama_gi, nama_bay, ip,
                       event_type, counter_name, address,
                       previous_value, current_value, delta
                FROM pqm_disturbance_events
                WHERE device_id = ?
                ORDER BY waktu DESC
                LIMIT ?
                """,
                (device_id, limit),
            ).fetchall()
        else:
            rows = conn.execute(
                """
                SELECT id, waktu, device_id, nama_gi, nama_bay, ip,
                       event_type, counter_name, address,
                       previous_value, current_value, delta
                FROM pqm_disturbance_events
                ORDER BY waktu DESC
                LIMIT ?
                """,
                (limit,),
            ).fetchall()
        return [row_to_dict(row) for row in rows]


def insert_dc_reading(item):
    with _DB_LOCK, get_connection() as conn:
        conn.execute(
            """
            INSERT INTO dc_readings
                (waktu, nama, ip, v_pn, arus, v_pg, v_ng, status, alarm_level)
            VALUES
                (:waktu, :nama, :ip, :v_pn, :arus, :v_pg, :v_ng, :status, :alarm_level)
            """,
            item,
        )
        conn.commit()


def insert_dc_alarm_event(event):
    with _DB_LOCK, get_connection() as conn:
        conn.execute(
            """
            INSERT OR IGNORE INTO dc_alarm_events (id, waktu, nama, level, v_pg, v_ng)
            VALUES (:id, :waktu, :nama, :level, :v_pg, :v_ng)
            """,
            event,
        )
        conn.commit()


def list_dc_alarm_events(limit=500):
    with _DB_LOCK, get_connection() as conn:
        rows = conn.execute(
            "SELECT id, waktu, nama, level, v_pg, v_ng FROM dc_alarm_events ORDER BY waktu DESC LIMIT ?",
            (limit,),
        ).fetchall()
        return [row_to_dict(row) for row in rows]


def list_dc_alarm_events_between(start_waktu, end_waktu, limit=1000):
    with _DB_LOCK, get_connection() as conn:
        rows = conn.execute(
            """
            SELECT id, waktu, nama, level, v_pg, v_ng
            FROM dc_alarm_events
            WHERE waktu >= ? AND waktu < ?
            ORDER BY waktu DESC
            LIMIT ?
            """,
            (start_waktu, end_waktu, limit),
        ).fetchall()
        return [row_to_dict(row) for row in rows]


def delete_dc_alarm_event(log_id):
    with _DB_LOCK, get_connection() as conn:
        cur = conn.execute("DELETE FROM dc_alarm_events WHERE id = ?", (log_id,))
        conn.commit()
        return cur.rowcount > 0

def delete_all_dc_alarm_events():
    with _DB_LOCK, get_connection() as conn:
        conn.execute("DELETE FROM dc_alarm_events")
        conn.commit()
        return True

def clear_all_dc_alarm_events():
    with _DB_LOCK, get_connection() as conn:
        conn.execute("DELETE FROM dc_alarm_events")
        conn.commit()


def get_dc_trend(nama, limit=144):
    with _DB_LOCK, get_connection() as conn:
        rows = conn.execute(
            """
            SELECT waktu, v_pn, arus, v_pg, v_ng
            FROM dc_readings
            WHERE nama = ? AND status = 'online'
            ORDER BY id DESC
            LIMIT ?
            """,
            (nama, limit),
        ).fetchall()
        return [row_to_dict(row) for row in reversed(rows)]


def list_dc_readings_for_export(nama=None, limit=10000):
    safe_limit = max(1, min(int(limit or 10000), 100000))
    with _DB_LOCK, get_connection() as conn:
        if nama:
            rows = conn.execute(
                """
                SELECT id, waktu, nama, ip, v_pn, arus, v_pg, v_ng, status, alarm_level
                FROM dc_readings
                WHERE nama = ?
                ORDER BY id DESC
                LIMIT ?
                """,
                (nama, safe_limit),
            ).fetchall()
        else:
            rows = conn.execute(
                """
                SELECT id, waktu, nama, ip, v_pn, arus, v_pg, v_ng, status, alarm_level
                FROM dc_readings
                ORDER BY id DESC
                LIMIT ?
                """,
                (safe_limit,),
            ).fetchall()
        return [row_to_dict(row) for row in reversed(rows)]


def upsert_annunciator_channels(source_id, channels, timestamp):
    rows = []
    for channel in channels:
        rows.append(
            {
                "source_id": source_id,
                "port": channel["port"],
                "nama_alat": channel["nama_alat"],
                "kondisi": channel["kondisi"],
                "is_active": 1 if channel["is_active"] else 0,
                "detail": channel.get("detail", ""),
                "device_name": channel.get("device_name", ""),
                "nama_gi": channel.get("nama_gi", ""),
                "raw_json": json.dumps(channel.get("raw", {})),
                "last_update": timestamp,
            }
        )

    with _DB_LOCK, get_connection() as conn:
        conn.executemany(
            """
            INSERT INTO annunciator_channels
                (source_id, port, nama_alat, kondisi, is_active, detail,
                 device_name, nama_gi, raw_json, last_update)
            VALUES
                (:source_id, :port, :nama_alat, :kondisi, :is_active, :detail,
                 :device_name, :nama_gi, :raw_json, :last_update)
            ON CONFLICT(source_id, port) DO UPDATE SET
                nama_alat=excluded.nama_alat,
                kondisi=excluded.kondisi,
                is_active=excluded.is_active,
                detail=excluded.detail,
                device_name=excluded.device_name,
                nama_gi=excluded.nama_gi,
                raw_json=excluded.raw_json,
                last_update=excluded.last_update
            """,
            rows,
        )
        conn.commit()


def get_active_annunciator_ports(source_id):
    with _DB_LOCK, get_connection() as conn:
        rows = conn.execute(
            """
            SELECT port
            FROM annunciator_channels
            WHERE source_id = ? AND is_active = 1
            """,
            (source_id,),
        ).fetchall()
        return [row["port"] for row in rows]


def get_annunciator_channel_map(source_id):
    with _DB_LOCK, get_connection() as conn:
        rows = conn.execute(
            """
            SELECT port, is_active
            FROM annunciator_channels
            WHERE source_id = ?
            """,
            (source_id,),
        ).fetchall()
        return {row["port"]: bool(row["is_active"]) for row in rows}


def delete_annunciator_channels(source_id):
    with _DB_LOCK, get_connection() as conn:
        cur = conn.execute(
            "DELETE FROM annunciator_channels WHERE source_id = ?",
            (source_id,),
        )
        conn.commit()
        return cur.rowcount


def insert_annunciator_event(event):
    with _DB_LOCK, get_connection() as conn:
        conn.execute(
            """
            INSERT OR IGNORE INTO annunciator_events
                (id, waktu, source_id, source_name, bay_name, ip, port, nama_alat, level)
            VALUES
                (:id, :waktu, :source_id, :source_name, :bay_name, :ip, :port, :nama_alat, :level)
            """,
            event,
        )
        conn.commit()


def list_annunciator_events(limit=1000):
    with _DB_LOCK, get_connection() as conn:
        rows = conn.execute(
            """
            SELECT id, waktu, source_id, source_name, bay_name, ip, port, nama_alat, level
            FROM annunciator_events
            ORDER BY waktu DESC
            LIMIT ?
            """,
            (limit,),
        ).fetchall()
        return [row_to_dict(row) for row in rows]


def list_annunciator_events_between(start_waktu, end_waktu, limit=1000):
    with _DB_LOCK, get_connection() as conn:
        rows = conn.execute(
            """
            SELECT id, waktu, source_id, source_name, bay_name, ip, port, nama_alat, level
            FROM annunciator_events
            WHERE waktu >= ? AND waktu < ?
            ORDER BY waktu DESC
            LIMIT ?
            """,
            (start_waktu, end_waktu, limit),
        ).fetchall()
        return [row_to_dict(row) for row in rows]


def delete_annunciator_event(event_id):
    with _DB_LOCK, get_connection() as conn:
        cur = conn.execute("DELETE FROM annunciator_events WHERE id = ?", (event_id,))
        conn.commit()
        return cur.rowcount > 0


def insert_ar_event(event):
    with _DB_LOCK, get_connection() as conn:
        conn.execute(
            """
            INSERT OR IGNORE INTO ar_events (
                id, waktu, device_id, nama_gi, nama_bay, ip,
                group_name, point_key, point_label, reference,
                previous_value, current_value, quality, severity
            ) VALUES (
                :id, :waktu, :device_id, :nama_gi, :nama_bay, :ip,
                :group_name, :point_key, :point_label, :reference,
                :previous_value, :current_value, :quality, :severity
            )
            """,
            event,
        )
        conn.commit()


def list_ar_events(limit=500, device_id=None):
    with _DB_LOCK, get_connection() as conn:
        if device_id:
            rows = conn.execute(
                """
                SELECT id, waktu, device_id, nama_gi, nama_bay, ip,
                       group_name, point_key, point_label, reference,
                       previous_value, current_value, quality, severity
                FROM ar_events
                WHERE device_id = ?
                ORDER BY waktu DESC
                LIMIT ?
                """,
                (device_id, limit),
            ).fetchall()
        else:
            rows = conn.execute(
                """
                SELECT id, waktu, device_id, nama_gi, nama_bay, ip,
                       group_name, point_key, point_label, reference,
                       previous_value, current_value, quality, severity
                FROM ar_events
                ORDER BY waktu DESC
                LIMIT ?
                """,
                (limit,),
            ).fetchall()
        return [row_to_dict(row) for row in rows]


def delete_ar_event(event_id):
    with _DB_LOCK, get_connection() as conn:
        cur = conn.execute("DELETE FROM ar_events WHERE id = ?", (event_id,))
        conn.commit()
        return cur.rowcount > 0


def enqueue_whatsapp_message(item):
    with _DB_LOCK, get_connection() as conn:
        existing = conn.execute(
            """
            SELECT id, status
            FROM whatsapp_outbox
            WHERE digest = ?
            """,
            (item["digest"],),
        ).fetchone()
        if existing and existing["status"] in {"pending", "retrying"}:
            return row_to_dict(existing)

        conn.execute(
            """
            INSERT INTO whatsapp_outbox (
                id, digest, message, allow_recovery_recap, status,
                attempts, max_attempts, next_attempt_at, last_error, updated_at
            ) VALUES (
                :id, :digest, :message, :allow_recovery_recap, 'pending',
                0, :max_attempts, :next_attempt_at, :last_error, CURRENT_TIMESTAMP
            )
            ON CONFLICT(digest) DO UPDATE SET
                message=excluded.message,
                allow_recovery_recap=excluded.allow_recovery_recap,
                status='pending',
                max_attempts=excluded.max_attempts,
                next_attempt_at=excluded.next_attempt_at,
                last_error=excluded.last_error,
                updated_at=CURRENT_TIMESTAMP
            """,
            item,
        )
        conn.commit()
        row = conn.execute(
            "SELECT id, status FROM whatsapp_outbox WHERE digest = ?",
            (item["digest"],),
        ).fetchone()
        return row_to_dict(row)


def list_due_whatsapp_messages(now_monotonic, limit=5):
    with _DB_LOCK, get_connection() as conn:
        rows = conn.execute(
            """
            SELECT id, digest, message, allow_recovery_recap, status,
                   attempts, max_attempts, next_attempt_at, last_error,
                   created_at, updated_at, sent_at
            FROM whatsapp_outbox
            WHERE status IN ('pending', 'retrying')
              AND next_attempt_at <= ?
            ORDER BY created_at ASC
            LIMIT ?
            """,
            (float(now_monotonic), int(limit)),
        ).fetchall()
        return [row_to_dict(row) for row in rows]


def mark_whatsapp_message_sent(message_id):
    with _DB_LOCK, get_connection() as conn:
        conn.execute(
            """
            UPDATE whatsapp_outbox
            SET status='sent',
                sent_at=CURRENT_TIMESTAMP,
                updated_at=CURRENT_TIMESTAMP
            WHERE id = ?
            """,
            (message_id,),
        )
        conn.commit()


def mark_whatsapp_message_failed(message_id, attempts, next_attempt_at, last_error, max_attempts):
    status = "failed" if int(max_attempts or 0) > 0 and int(attempts or 0) >= int(max_attempts or 0) else "retrying"
    with _DB_LOCK, get_connection() as conn:
        conn.execute(
            """
            UPDATE whatsapp_outbox
            SET status=?,
                attempts=?,
                next_attempt_at=?,
                last_error=?,
                updated_at=CURRENT_TIMESTAMP
            WHERE id = ?
            """,
            (status, int(attempts or 0), float(next_attempt_at or 0), str(last_error or ""), message_id),
        )
        conn.commit()


def discard_pending_whatsapp_messages(reason=""):
    with _DB_LOCK, get_connection() as conn:
        cur = conn.execute(
            """
            UPDATE whatsapp_outbox
            SET status='discarded',
                last_error=?,
                updated_at=CURRENT_TIMESTAMP
            WHERE status IN ('pending', 'retrying')
            """,
            (str(reason or ""),),
        )
        conn.commit()
        return cur.rowcount


def count_pending_whatsapp_messages():
    with _DB_LOCK, get_connection() as conn:
        row = conn.execute(
            """
            SELECT COUNT(*) AS total
            FROM whatsapp_outbox
            WHERE status IN ('pending', 'retrying')
            """
        ).fetchone()
        return int(row["total"] if row else 0)


def prune_whatsapp_outbox(sent_before_text=None, failed_before_text=None):
    with _DB_LOCK, get_connection() as conn:
        deleted = 0
        if sent_before_text:
            cur = conn.execute(
                "DELETE FROM whatsapp_outbox WHERE status='sent' AND sent_at < ?",
                (sent_before_text,),
            )
            deleted += cur.rowcount
        if failed_before_text:
            cur = conn.execute(
                "DELETE FROM whatsapp_outbox WHERE status='failed' AND updated_at < ?",
                (failed_before_text,),
            )
            deleted += cur.rowcount
        conn.commit()
        return deleted


def get_setting(key, default=None):
    with _DB_LOCK, get_connection() as conn:
        row = conn.execute(
            "SELECT value FROM app_settings WHERE key = ?",
            (key,),
        ).fetchone()
        return row["value"] if row else default


def set_setting(key, value):
    with _DB_LOCK, get_connection() as conn:
        conn.execute(
            """
            INSERT INTO app_settings (key, value)
            VALUES (?, ?)
            ON CONFLICT(key) DO UPDATE SET value=excluded.value
            """,
            (key, str(value)),
        )
        conn.commit()


def delete_setting(key):
    with _DB_LOCK, get_connection() as conn:
        cur = conn.execute(
            "DELETE FROM app_settings WHERE key = ?",
            (key,),
        )
        conn.commit()
        return cur.rowcount > 0


def list_settings(prefix=""):
    with _DB_LOCK, get_connection() as conn:
        if prefix:
            rows = conn.execute(
                "SELECT key, value FROM app_settings WHERE key LIKE ? ORDER BY key",
                (f"{prefix}%",),
            ).fetchall()
        else:
            rows = conn.execute(
                "SELECT key, value FROM app_settings ORDER BY key",
            ).fetchall()
        return [(row["key"], row["value"]) for row in rows]


def migrate_legacy_json_files(sources):
    init_database()
    upsert_annunciator_sources(sources)

    if get_setting("legacy_migration_v1") == "1":
        return

    if os.path.exists("daftar_gi.json"):
        try:
            with open("daftar_gi.json", "r") as f:
                for item in json.load(f):
                    nama = item.get("nama")
                    ip = item.get("ip")
                    if nama and ip:
                        try:
                            add_gi_device(nama, ip)
                        except sqlite3.IntegrityError:
                            pass
        except Exception as exc:
            print(f"Gagal migrasi daftar_gi.json: {exc}")

    if os.path.exists("alarms_log.json"):
        try:
            with open("alarms_log.json", "r") as f:
                for item in json.load(f):
                    insert_dc_alarm_event(
                        {
                            "id": item.get("id") or os.urandom(8).hex(),
                            "waktu": item.get("waktu") or utcnow_text(),
                            "nama": item.get("nama") or "-",
                            "level": item.get("level") or "warning",
                            "v_pg": float(item.get("v_pg") or 0),
                            "v_ng": float(item.get("v_ng") or 0),
                        }
                    )
        except Exception as exc:
            print(f"Gagal migrasi alarms_log.json: {exc}")

    if os.path.exists("annunciator_log.json"):
        try:
            with open("annunciator_log.json", "r") as f:
                for item in json.load(f):
                    source_id = item.get("source_id") or sources[0]["id"]
                    source = next((src for src in sources if src["id"] == source_id), sources[0])
                    insert_annunciator_event(
                        {
                            "id": item.get("id") or os.urandom(8).hex(),
                            "waktu": item.get("waktu") or utcnow_text(),
                            "source_id": source_id,
                            "source_name": item.get("source_name") or source["source_name"],
                            "bay_name": item.get("bay_name") or source["bay_name"],
                            "ip": item.get("ip") or source["ip"],
                            "port": str(item.get("port") or "-"),
                            "nama_alat": item.get("nama_alat") or "Alarm tanpa nama",
                            "level": item.get("level") or "active",
                        }
                    )
        except Exception as exc:
            print(f"Gagal migrasi annunciator_log.json: {exc}")

    set_setting("legacy_migration_v1", "1")


def ensure_default_pqm_devices(devices):
    init_database()
    if get_setting("pqm_seed_v1") != "1":
        upsert_pqm_devices(devices)
        set_setting("pqm_seed_v1", "1")
        set_setting("pqm_seed_v2", "1")
        return

    if get_setting("pqm_seed_v2") == "1":
        return

    existing_devices = get_pqm_devices()
    existing_ids = {item["id"] for item in existing_devices}
    existing_ips = {item["ip"] for item in existing_devices}
    for device in devices:
        if (
            device.get("pqm_type") == "ion9000"
            and device["id"] not in existing_ids
            and device["ip"] not in existing_ips
        ):
            upsert_pqm_device(device)
    set_setting("pqm_seed_v2", "1")


def insert_pqm_itic_event(data):
    with _DB_LOCK, get_connection() as conn:
        conn.execute(
            """
            INSERT INTO pqm_itic_events (
                device_id, waktu_mulai, waktu_selesai, nama_gi, nama_bay, ip,
                event_type, phase, duration_seconds, magnitude_percent
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                data["device_id"],
                data["waktu_mulai"],
                data["waktu_selesai"],
                data["nama_gi"],
                data["nama_bay"],
                data["ip"],
                data["event_type"],
                data["phase"],
                data["duration_seconds"],
                data["magnitude_percent"],
            ),
        )
        conn.commit()


def pqm_itic_event_exists(data):
    with _DB_LOCK, get_connection() as conn:
        row = conn.execute(
            """
            SELECT 1
            FROM pqm_itic_events
            WHERE device_id = ?
              AND waktu_mulai = ?
              AND waktu_selesai = ?
              AND event_type = ?
              AND phase = ?
              AND ABS(duration_seconds - ?) < 0.0005
              AND ABS(magnitude_percent - ?) < 0.005
            LIMIT 1
            """,
            (
                data["device_id"],
                data["waktu_mulai"],
                data["waktu_selesai"],
                data["event_type"],
                data["phase"],
                float(data["duration_seconds"]),
                float(data["magnitude_percent"]),
            ),
        ).fetchone()
        return row is not None


def list_pqm_itic_events(limit=500):
    with _DB_LOCK, get_connection() as conn:
        rows = conn.execute(
            """
            SELECT * FROM pqm_itic_events
            ORDER BY waktu_mulai DESC
            LIMIT ?
            """,
            (limit,),
        ).fetchall()
        return [row_to_dict(row) for row in rows]


def get_dc_registers():
    with _DB_LOCK, get_connection() as conn:
        rows = conn.execute("SELECT * FROM dc_register_config ORDER BY ip_gi, channel, sinyal").fetchall()
        return [row_to_dict(row) for row in rows]

def get_dc_registers_by_ip(ip_gi):
    with _DB_LOCK, get_connection() as conn:
        rows = conn.execute("SELECT * FROM dc_register_config WHERE ip_gi = ? ORDER BY channel, sinyal", (ip_gi,)).fetchall()
        return [row_to_dict(row) for row in rows]

def add_dc_register(ip_gi, nama_gi, channel, sinyal, register_address):
    with _DB_LOCK, get_connection() as conn:
        conn.execute(
            '''INSERT OR REPLACE INTO dc_register_config (ip_gi, nama_gi, channel, sinyal, register_address)
               VALUES (?, ?, ?, ?, ?)''',
            (ip_gi, nama_gi, channel, sinyal, register_address)
        )
        conn.commit()

def update_dc_register(id, register_address):
    with _DB_LOCK, get_connection() as conn:
        conn.execute(
            "UPDATE dc_register_config SET register_address = ? WHERE id = ?",
            (register_address, id)
        )
        conn.commit()

def delete_dc_registers_by_ip(ip_gi):
    with _DB_LOCK, get_connection() as conn:
        conn.execute("DELETE FROM dc_register_config WHERE ip_gi = ?", (ip_gi,))
        conn.commit()
