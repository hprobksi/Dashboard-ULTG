"""
Script untuk mengaplikasikan fix spam annunciator ke server VoltKraft

Penggunaan:
    python apply_annunciator_fix.py

Fix yang diterapkan:
1. retry_pending_annunciator_recoveries - handle empty current_states
2. retry_pending_annunciator_alarms - handle empty current_states
3. poll_annunciator_source - skip notification untuk port tanpa nama valid
4. poll_annunciator_source - skip notification untuk port yang tidak ada di API response
"""

import os
import re
import sys

API_FILE = "api.py"

def read_file(path):
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

def write_file(path, content):
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

def apply_fix():
    print("=" * 60)
    print("APPLYING ANNOUNCIATOR SPAM FIX")
    print("=" * 60)

    if not os.path.exists(API_FILE):
        print(f"[ERROR] {API_FILE} tidak ditemukan!")
        return False

    content = read_file(API_FILE)
    original_content = content

    # ============================================================
    # FIX 1: retry_pending_annunciator_alarms
    # Handle empty current_states dan check port existence
    # ============================================================
    old_retry_alarms = '''def retry_pending_annunciator_alarms(source, _current_states):
    if not ANNUNCIATOR_RETRY_PENDING_NOTIFICATIONS:
        clear_annunciator_pending_prefixes(
            source["id"],
            "annunciator_alarm_pending",
            "annunciator_alarm_attempt",
            "Retry pending dimatikan.",
        )
        return

    prefix = f"annunciator_alarm_pending::{source['id']}::"
    for key, raw_payload in db.list_settings(prefix):
        try:
            payload = json.loads(raw_payload)
        except Exception:
            db.delete_setting(key)
            continue

        alarm = payload.get("alarm") or {}
        port = str(alarm.get("port", ""))
        if port and not _current_states.get(port, False):
            db.delete_setting(key)
            db.delete_setting(annunciator_alarm_attempt_key(source["id"], port))
            print(
                f"[ANNUNCIATOR PENDING CLEARED] {source['source_name']} {source['bay_name']} "
                f"Port {port}: alarm pending dibatalkan karena kondisi sudah normal."
            )
            continue

        alarm_source = {**source, **(payload.get("source") or {})}
        send_annunciator_alarm_notification(
            alarm_source,
            alarm,
            payload.get("waktu") or time.strftime("%Y-%m-%d %H:%M:%S"),
        )'''

    new_retry_alarms = '''def retry_pending_annunciator_alarms(source, _current_states):
    if not ANNUNCIATOR_RETRY_PENDING_NOTIFICATIONS:
        clear_annunciator_pending_prefixes(
            source["id"],
            "annunciator_alarm_pending",
            "annunciator_alarm_attempt",
            "Retry pending dimatikan.",
        )
        return

    # FIX: Jika current_states kosong, tidak bisa tahu state sebenarnya
    # Hapus semua pending alarm karena tidak ada informasi valid
    if not _current_states:
        prefix = f"annunciator_alarm_pending::{source['id']}::"
        for key, _ in db.list_settings(prefix):
            db.delete_setting(key)
        prefix = f"annunciator_alarm_attempt::{source['id']}::"
        for key, _ in db.list_settings(prefix):
            db.delete_setting(key)
        print(
            f"[ANNUNCIATOR ALARM STALE] {source['source_name']} {source['bay_name']}: "
            "current_states kosong, semua pending alarm dibatalkan."
        )
        return

    prefix = f"annunciator_alarm_pending::{source['id']}::"
    for key, raw_payload in db.list_settings(prefix):
        try:
            payload = json.loads(raw_payload)
        except Exception:
            db.delete_setting(key)
            continue

        alarm = payload.get("alarm") or {}
        port = str(alarm.get("port", ""))

        # FIX: Check apakah port ada di current_states
        # Jika port tidak ada di current_states, hapus pending
        if port not in _current_states:
            db.delete_setting(key)
            db.delete_setting(annunciator_alarm_attempt_key(source["id"], port))
            print(
                f"[ANNUNCIATOR ALARM CLEARED] {source['source_name']} {source['bay_name']}: "
                f"Port {port} tidak ada di current_states, pending alarm dihapus."
            )
            continue

        # Jika port tidak aktif, hapus pending karena alarm sudah recover
        if not _current_states.get(port, False):
            db.delete_setting(key)
            db.delete_setting(annunciator_alarm_attempt_key(source["id"], port))
            print(
                f"[ANNUNCIATOR ALARM CLEARED] {source['source_name']} {source['bay_name']}: "
                f"Port {port} tidak aktif, pending alarm dihapus."
            )
            continue

        alarm_source = {**source, **(payload.get("source") or {})}
        send_annunciator_alarm_notification(
            alarm_source,
            alarm,
            payload.get("waktu") or time.strftime("%Y-%m-%d %H:%M:%S"),
        )'''

    if old_retry_alarms in content:
        content = content.replace(old_retry_alarms, new_retry_alarms)
        print("[OK] retry_pending_annunciator_alarms fixed")
    else:
        print("[SKIP] retry_pending_annunciator_alarms - sudah terfix atau format berbeda")

    # ============================================================
    # FIX 2: retry_pending_annunciator_recoveries
    # Handle empty current_states dan check port existence
    # ============================================================
    old_retry_recoveries = '''def retry_pending_annunciator_recoveries(source, current_states):
    if not ANNUNCIATOR_RETRY_PENDING_NOTIFICATIONS:
        clear_annunciator_pending_prefixes(
            source["id"],
            "annunciator_recovery_pending",
            "annunciator_recovery_attempt",
            "Retry pending dimatikan.",
        )
        return

    prefix = f"annunciator_recovery_pending::{source['id']}::"
    for key, raw_payload in db.list_settings(prefix):
        try:
            payload = json.loads(raw_payload)
        except Exception:
            db.delete_setting(key)
            continue

        alarm = payload.get("alarm") or {}
        port = str(alarm.get("port", ""))
        if current_states.get(port, False):
            db.delete_setting(key)
            db.delete_setting(annunciator_recovery_attempt_key(source["id"], port))
            continue

        recovery_source = {**source, **(payload.get("source") or {})}
        send_annunciator_recovery_notification(
            recovery_source,
            alarm,
            payload.get("waktu") or time.strftime("%Y-%m-%d %H:%M:%S"),
        )'''

    new_retry_recoveries = '''def retry_pending_annunciator_recoveries(source, current_states):
    if not ANNUNCIATOR_RETRY_PENDING_NOTIFICATIONS:
        clear_annunciator_pending_prefixes(
            source["id"],
            "annunciator_recovery_pending",
            "annunciator_recovery_attempt",
            "Retry pending dimatikan.",
        )
        return

    # FIX: Jika current_states kosong, tidak bisa tahu state sebenarnya
    # Hapus semua pending recovery karena tidak ada informasi valid
    if not current_states:
        prefix = f"annunciator_recovery_pending::{source['id']}::"
        for key, _ in db.list_settings(prefix):
            db.delete_setting(key)
        prefix = f"annunciator_recovery_attempt::{source['id']}::"
        for key, _ in db.list_settings(prefix):
            db.delete_setting(key)
        print(
            f"[ANNUNCIATOR RECOVERY STALE] {source['source_name']} {source['bay_name']}: "
            "current_states kosong, semua pending recovery dibatalkan."
        )
        return

    prefix = f"annunciator_recovery_pending::{source['id']}::"
    for key, raw_payload in db.list_settings(prefix):
        try:
            payload = json.loads(raw_payload)
        except Exception:
            db.delete_setting(key)
            continue

        alarm = payload.get("alarm") or {}
        port = str(alarm.get("port", ""))

        # FIX: Check apakah port ada di current_states
        # Jika port tidak ada di current_states (alias tidak aktif), hapus pending
        if port not in current_states:
            db.delete_setting(key)
            db.delete_setting(annunciator_recovery_attempt_key(source["id"], port))
            print(
                f"[ANNUNCIATOR RECOVERY CLEARED] {source['source_name']} {source['bay_name']}: "
                f"Port {port} tidak ada di current_states, pending recovery dihapus."
            )
            continue

        # Jika port masih aktif, hapus pending karena alarm sedang aktif
        if current_states.get(port, False):
            db.delete_setting(key)
            db.delete_setting(annunciator_recovery_attempt_key(source["id"], port))
            print(
                f"[ANNUNCIATOR RECOVERY CLEARED] {source['source_name']} {source['bay_name']}: "
                f"Port {port} masih aktif, pending recovery dihapus."
            )
            continue

        # Port tidak aktif dan ada di current_states, cek retry cooldown
        recovery_source = {**source, **(payload.get("source") or {})}
        send_annunciator_recovery_notification(
            recovery_source,
            alarm,
            payload.get("waktu") or time.strftime("%Y-%m-%d %H:%M:%S"),
        )'''

    if old_retry_recoveries in content:
        content = content.replace(old_retry_recoveries, new_retry_recoveries)
        print("[OK] retry_pending_annunciator_recoveries fixed")
    else:
        print("[SKIP] retry_pending_annunciator_recoveries - sudah terfix atau format berbeda")

    # ============================================================
    # FIX 3: poll_annunciator_source - skip notification untuk port tanpa nama valid
    # ============================================================

    # Check untuk alarm notification
    old_alarm_section = '''if new_ports:
                for alarm in active_alarms:
                    if alarm["port"] not in new_ports:
                        continue
                    event = {
                        "id": str(uuid.uuid4()),
                        "waktu": waktu_sekarang,
                        "source_id": source_id,
                        "source_name": source["source_name"],
                        "bay_name": source["bay_name"],
                        "ip": source["ip"],
                        "port": alarm["port"],
                        "nama_alat": alarm["nama_alat"],
                        "level": "active",
                    }
                    app_state["annunciator_history"].append(event)
                    db.insert_annunciator_event(event)
                    send_annunciator_alarm_notification(source, alarm, waktu_sekarang)'''

    new_alarm_section = '''if new_ports:
                for alarm in active_alarms:
                    if alarm["port"] not in new_ports:
                        continue
                    nama_alat = alarm.get("nama_alat", "Alarm tanpa nama")
                    # FIX: Jangan kirim notification jika nama_alat adalah "Alarm tanpa nama"
                    # Ini mengindikasikan port tidak memiliki mapping yang valid
                    if nama_alat == "Alarm tanpa nama":
                        print(
                            f"[ANNUNCIATOR SKIP] {source['source_name']} {source['bay_name']}: "
                            f"Port {alarm['port']} tidak memiliki nama valid, alarm notification diabaikan."
                        )
                        continue
                    event = {
                        "id": str(uuid.uuid4()),
                        "waktu": waktu_sekarang,
                        "source_id": source_id,
                        "source_name": source["source_name"],
                        "bay_name": source["bay_name"],
                        "ip": source["ip"],
                        "port": alarm["port"],
                        "nama_alat": nama_alat,
                        "level": "active",
                    }
                    app_state["annunciator_history"].append(event)
                    db.insert_annunciator_event(event)
                    send_annunciator_alarm_notification(source, alarm, waktu_sekarang)'''

    if old_alarm_section in content:
        content = content.replace(old_alarm_section, new_alarm_section)
        print("[OK] poll_annunciator_source alarm notification fixed")
    else:
        print("[SKIP] poll_annunciator_source alarm - sudah terfix atau format berbeda")

    # Check untuk recovery notification - versi lama
    old_recovery_section = '''if cleared_ports:
                cleared_items = {
                    item["port"]: item
                    for item in normalized_data
                }
                for port in cleared_ports:
                    alarm = cleared_items.get(port, {"nama_alat": "Alarm tanpa nama", "port": port})
                    event = {
                        "id": str(uuid.uuid4()),
                        "waktu": waktu_sekarang,
                        "source_id": source_id,
                        "source_name": source["source_name"],
                        "bay_name": source["bay_name"],
                        "ip": source["ip"],
                        "port": str(port),
                        "nama_alat": alarm["nama_alat"],
                        "level": "normal",
                    }
                    app_state["annunciator_history"].append(event)
                    db.insert_annunciator_event(event)
                    send_annunciator_recovery_notification(source, alarm, waktu_sekarang)'''

    # Check untuk recovery notification - versi dengan check nama_alat
    old_recovery_section_v2 = '''if cleared_ports:
                cleared_items = {
                    item["port"]: item
                    for item in normalized_data
                }
                for port in cleared_ports:
                    alarm = cleared_items.get(port, {"nama_alat": "Alarm tanpa nama", "port": port})
                    nama_alat = alarm.get("nama_alat", "Alarm tanpa nama")
                    # FIX: Jangan kirim notification jika nama_alat adalah "Alarm tanpa nama"
                    # Ini mengindikasikan port tidak memiliki mapping yang valid
                    if nama_alat == "Alarm tanpa nama":
                        print(
                            f"[ANNUNCIATOR SKIP] {source['source_name']} {source['bay_name']}: "
                            f"Port {port} tidak memiliki nama valid, notification diabaikan."
                        )
                        continue
                    event = {
                        "id": str(uuid.uuid4()),
                        "waktu": waktu_sekarang,
                        "source_id": source_id,
                        "source_name": source["source_name"],
                        "bay_name": source["bay_name"],
                        "ip": source["ip"],
                        "port": str(port),
                        "nama_alat": nama_alat,
                        "level": "normal",
                    }
                    app_state["annunciator_history"].append(event)
                    db.insert_annunciator_event(event)
                    send_annunciator_recovery_notification(source, alarm, waktu_sekarang)'''

    new_recovery_section = '''if cleared_ports:
                cleared_items = {
                    item["port"]: item
                    for item in normalized_data
                }
                for port in cleared_ports:
                    # FIX: Jika port tidak ada di normalized_data (API response tidak punya port ini),
                    # skip notification karena tidak ada informasi valid dari device
                    if port not in cleared_items:
                        print(
                            f"[ANNUNCIATOR SKIP] {source['source_name']} {source['bay_name']}: "
                            f"Port {port} tidak ada di API response, notification diabaikan."
                        )
                        continue
                    alarm = cleared_items.get(port, {"nama_alat": "Alarm tanpa nama", "port": port})
                    nama_alat = alarm.get("nama_alat", "Alarm tanpa nama")
                    # FIX: Jangan kirim notification jika nama_alat adalah "Alarm tanpa nama"
                    # Ini mengindikasikan port tidak memiliki mapping yang valid
                    if nama_alat == "Alarm tanpa nama":
                        print(
                            f"[ANNUNCIATOR SKIP] {source['source_name']} {source['bay_name']}: "
                            f"Port {port} tidak memiliki nama valid, notification diabaikan."
                        )
                        continue
                    event = {
                        "id": str(uuid.uuid4()),
                        "waktu": waktu_sekarang,
                        "source_id": source_id,
                        "source_name": source["source_name"],
                        "bay_name": source["bay_name"],
                        "ip": source["ip"],
                        "port": str(port),
                        "nama_alat": nama_alat,
                        "level": "normal",
                    }
                    app_state["annunciator_history"].append(event)
                    db.insert_annunciator_event(event)
                    send_annunciator_recovery_notification(source, alarm, waktu_sekarang)'''

    if old_recovery_section in content:
        content = content.replace(old_recovery_section, new_recovery_section)
        print("[OK] poll_annunciator_source recovery notification fixed (v1)")
    elif old_recovery_section_v2 in content:
        content = content.replace(old_recovery_section_v2, new_recovery_section)
        print("[OK] poll_annunciator_source recovery notification fixed (v2)")
    else:
        print("[SKIP] poll_annunciator_source recovery - sudah terfix atau format berbeda")

    # Save changes
    if content != original_content:
        write_file(API_FILE, content)
        print(f"\n[SUCCESS] {API_FILE} berhasil diupdate!")
        return True
    else:
        print("\n[INFO] Tidak ada perubahan yang diperlukan (fix sudah diterapkan)")
        return True


if __name__ == "__main__":
    success = apply_fix()
    sys.exit(0 if success else 1)