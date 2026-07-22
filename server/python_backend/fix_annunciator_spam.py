"""
Script untuk fix spam notification annunciator pada GI Cikarang Bay Rajapaksi 2

Masalah: Port 37 "Alarm tanpa nama" terus mengirim recovery notification padahal tidak aktif
Penyebab: Port type mismatch (string vs int) dan pending recovery tidak divalidasi dengan benar

Solusi:
1. Bersihkan semua pending notifications untuk source tersebut
2. Reset attempt keys
3. Tambahkan validasi yang lebih ketat
"""

import json
import os
import sys
import sqlite3
import time

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import database as db

PROBLEMATIC_SOURCE_ID = "gi-cikarang-rajapaksi-2"
TARGET_PORT = "37"

def clear_source_pending_notifications(source_id):
    """Hapus semua pending notifications untuk satu source."""
    cleared = {
        "alarm_pending": 0,
        "alarm_attempt": 0,
        "recovery_pending": 0,
        "recovery_attempt": 0,
    }

    # Clear alarm pending
    prefix = f"annunciator_alarm_pending::{source_id}::"
    for key, _ in db.list_settings(prefix):
        db.delete_setting(key)
        cleared["alarm_pending"] += 1
        print(f"  [CLEARED] {key}")

    # Clear alarm attempt
    prefix = f"annunciator_alarm_attempt::{source_id}::"
    for key, _ in db.list_settings(prefix):
        db.delete_setting(key)
        cleared["alarm_attempt"] += 1
        print(f"  [CLEARED] {key}")

    # Clear recovery pending
    prefix = f"annunciator_recovery_pending::{source_id}::"
    for key, _ in db.list_settings(prefix):
        db.delete_setting(key)
        cleared["recovery_pending"] += 1
        print(f"  [CLEARED] {key}")

    # Clear recovery attempt
    prefix = f"annunciator_recovery_attempt::{source_id}::"
    for key, _ in db.list_settings(prefix):
        db.delete_setting(key)
        cleared["recovery_attempt"] += 1
        print(f"  [CLEARED] {key}")

    return cleared


def clear_specific_port_pending(source_id, port):
    """Hapus pending notifications untuk port spesifik."""
    cleared = 0

    # Check and clear alarm pending for this port
    key = f"annunciator_alarm_pending::{source_id}::{port}"
    if db.get_setting(key):
        db.delete_setting(key)
        cleared += 1
        print(f"  [CLEARED] {key}")

    # Check and clear alarm attempt for this port
    key = f"annunciator_alarm_attempt::{source_id}::{port}"
    if db.get_setting(key):
        db.delete_setting(key)
        cleared += 1
        print(f"  [CLEARED] {key}")

    # Check and clear recovery pending for this port
    key = f"annunciator_recovery_pending::{source_id}::{port}"
    if db.get_setting(key):
        db.delete_setting(key)
        cleared += 1
        print(f"  [CLEARED] {key}")

    # Check and clear recovery attempt for this port
    key = f"annunciator_recovery_attempt::{source_id}::{port}"
    if db.get_setting(key):
        db.delete_setting(key)
        cleared += 1
        print(f"  [CLEARED] {key}")

    return cleared


def check_and_fix_annunciator_channels(source_id):
    """Cek dan fix port yang bermasalah di database."""
    conn = db.get_connection()
    cursor = conn.cursor()

    # Get all channels for this source
    cursor.execute(
        "SELECT port, nama_alat, is_active FROM annunciator_channels WHERE source_id = ?",
        (source_id,)
    )
    rows = cursor.fetchall()
    conn.close()

    print(f"\n[CHECK] Channels di database untuk {source_id}:")
    problem_ports = []
    for row in rows:
        port, nama_alat, is_active = row
        status = "AKTIF" if is_active else "NONAKTIF"
        marker = " (PROBLEM)" if (str(port) == TARGET_PORT) else ""
        print(f"  Port {port}: {nama_alat} [{status}]{marker}")

        # Check if port 37 exists with nama_alat = "Alarm tanpa nama"
        if str(port) == TARGET_PORT and nama_alat == "Alarm tanpa nama":
            problem_ports.append(str(port))

    return problem_ports


def check_pending_notifications(source_id):
    """Cek semua pending notifications untuk satu source."""
    print(f"\n[CHECK] Pending notifications untuk {source_id}:")

    all_pending = []

    # Check alarm pending
    prefix = f"annunciator_alarm_pending::{source_id}::"
    for key, value in db.list_settings(prefix):
        print(f"  [ALARM PENDING] {key}")
        try:
            payload = json.loads(value)
            print(f"    Payload: {json.dumps(payload, indent=4)}")
        except:
            print(f"    Raw: {value}")
        all_pending.append(key)

    # Check alarm attempt
    prefix = f"annunciator_alarm_attempt::{source_id}::"
    for key, value in db.list_settings(prefix):
        print(f"  [ALARM ATTEMPT] {key} = {value}")
        all_pending.append(key)

    # Check recovery pending
    prefix = f"annunciator_recovery_pending::{source_id}::"
    for key, value in db.list_settings(prefix):
        print(f"  [RECOVERY PENDING] {key}")
        try:
            payload = json.loads(value)
            print(f"    Payload: {json.dumps(payload, indent=4)}")
        except:
            print(f"    Raw: {value}")
        all_pending.append(key)

    # Check recovery attempt
    prefix = f"annunciator_recovery_attempt::{source_id}::"
    for key, value in db.list_settings(prefix):
        print(f"  [RECOVERY ATTEMPT] {key} = {value}")
        all_pending.append(key)

    if not all_pending:
        print("  (Tidak ada pending notifications)")

    return all_pending


def main():
    print("=" * 60)
    print("FIX SPAM ANNOUNCIATOR - GI CIKARANG BAY RAJAPAKSI 2")
    print("=" * 60)

    source_id = PROBLEMATIC_SOURCE_ID

    # 1. Check current state
    print(f"\n[1] MEMERIKSA STATE SAAT INI...")
    problem_ports = check_and_fix_annunciator_channels(source_id)

    # 2. Check pending notifications
    print(f"\n[2] MEMERIKSA PENDING NOTIFICATIONS...")
    pending = check_pending_notifications(source_id)

    # 3. Clear all pending for this source
    print(f"\n[3] MEMBERSIHKAN PENDING NOTIFICATIONS...")
    cleared = clear_source_pending_notifications(source_id)
    print(f"\n  Total cleared: {sum(cleared.values())} items")

    # 4. Summary
    print(f"\n[4] RINGKASAN PERBAIKAN:")
    print(f"  - Alarm pending dihapus: {cleared['alarm_pending']}")
    print(f"  - Alarm attempt dihapus: {cleared['alarm_attempt']}")
    print(f"  - Recovery pending dihapus: {cleared['recovery_pending']}")
    print(f"  - Recovery attempt dihapus: {cleared['recovery_attempt']}")

    if problem_ports:
        print(f"\n  [!] Port bermasalah ditemukan: {problem_ports}")
        print(f"     Port-port ini tidak memiliki nama yang valid di mapping.")
        print(f"     Disarankan untuk menambahkan mapping di ANNUNCIATOR_SOURCES.")

    print(f"\n" + "=" * 60)
    print("PERBAIKAN SELESAI - Spam akan berhenti setelah fix di api.py")
    print("=" * 60)

    return cleared


if __name__ == "__main__":
    main()