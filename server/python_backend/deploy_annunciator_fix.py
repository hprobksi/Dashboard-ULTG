"""
Script deployment untuk VoltKraft dengan fix spam annunciator

Penggunaan:
    1. Copy api.py dan fix_annunciator_spam.py ke server baru
    2. Jalankan: python deploy_annunciator_fix.py

Script ini akan:
1. Membersihkan semua pending notifications
2. Verifikasi bahwa fix sudah diterapkan
3. Memberikan instruksi untuk restart service
"""

import os
import sys

# Add current directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    import database as db
    import json
    import time
except ImportError as e:
    print(f"[ERROR] Gagal import modul: {e}")
    print("Pastikan Anda menjalankan script ini di direktori yang sama dengan api.py dan database.py")
    sys.exit(1)


def clear_all_pending_notifications():
    """Hapus semua pending notifications untuk semua sources."""
    print("\n[1] MEMBERSIHKAN SEMUA PENDING NOTIFICATIONS...")

    prefixes_to_clear = [
        ("annunciator_alarm_pending", "annunciator_alarm_attempt"),
        ("annunciator_recovery_pending", "annunciator_recovery_attempt"),
    ]

    total_cleared = 0
    sources_with_pending = set()

    for pending_prefix, attempt_prefix in prefixes_to_clear:
        for key, _ in db.list_settings(f"{pending_prefix}::"):
            db.delete_setting(key)
            # Extract source_id from key
            parts = key.split("::")
            if len(parts) >= 2:
                sources_with_pending.add(parts[1])
            total_cleared += 1
            print(f"  [CLEARED] {key}")

        for key, _ in db.list_settings(f"{attempt_prefix}::"):
            db.delete_setting(key)
            total_cleared += 1

    if total_cleared == 0:
        print("  (Tidak ada pending notifications)")
    else:
        print(f"\n  Total dihapus: {total_cleared} items")
        print(f"  Sources yang terpengaruh: {len(sources_with_pending)}")
        for source in sources_with_pending:
            print(f"    - {source}")

    return total_cleared


def clear_change_candidates():
    """Hapus semua change candidate keys."""
    print("\n[2] MEMBERSIHKAN CHANGE CANDIDATE KEYS...")

    count = 0
    for key, _ in db.list_settings("annunciator_change_candidate::"):
        db.delete_setting(key)
        count += 1
        print(f"  [CLEARED] {key}")

    if count == 0:
        print("  (Tidak ada change candidates)")
    else:
        print(f"\n  Total dihapus: {count} items")

    return count


def verify_api_fix():
    """Verifikasi bahwa api.py sudah memiliki fix."""
    print("\n[3] VERIFIKASI FIX DI api.py...")

    api_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "api.py")

    if not os.path.exists(api_path):
        print("  [ERROR] api.py tidak ditemukan!")
        return False

    with open(api_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Check untuk fix indicators
    fix_indicators = [
        ("current_states kosong, semua pending", "Fix 1: Handle empty current_states"),
        ("tidak ada di current_states, pending", "Fix 2: Check port existence in retry"),
        ("tidak ada di API response, notification", "Fix 3: Skip port not in API response"),
        ("tidak memiliki nama valid", "Fix 4: Skip alarm tanpa nama"),
    ]

    all_found = True
    for indicator, description in fix_indicators:
        if indicator in content:
            print(f"  [OK] {description}")
        else:
            print(f"  [MISSING] {description}")
            all_found = False

    return all_found


def reset_annunciator_baseline():
    """Reset baseline untuk semua annunciator sources."""
    print("\n[4] RESET ANNOUNCIATOR BASELINE...")

    # Clear connection state keys
    count = 0
    for key, _ in db.list_settings("annunciator_connection_state::"):
        db.delete_setting(key)
        count += 1

    print(f"  Connection states cleared: {count}")

    return count


def main():
    print("=" * 60)
    print("VOLTKRAFT ANNOUNCIATOR SPAM FIX - DEPLOYMENT SCRIPT")
    print("=" * 60)
    print(f"\nWaktu: {time.strftime('%Y-%m-%d %H:%M:%S')}")

    # Initialize database
    print("\n[INIT] Inisialisasi database...")
    try:
        db.init_database()
        print("  [OK] Database initialized")
    except Exception as e:
        print(f"  [ERROR] {e}")

    # Run deployment steps
    cleared_notifications = clear_all_pending_notifications()
    cleared_candidates = clear_change_candidates()
    reset_baseline = reset_annunciator_baseline()
    fix_verified = verify_api_fix()

    # Summary
    print("\n" + "=" * 60)
    print("DEPLOYMENT SUMMARY")
    print("=" * 60)
    print(f"  Pending notifications dihapus: {cleared_notifications}")
    print(f"  Change candidates dihapus: {cleared_candidates}")
    print(f"  Baseline reset: {reset_baseline}")
    print(f"  Fix verified: {'YES' if fix_verified else 'PARTIAL'}")

    print("\n" + "=" * 60)
    print("INSTRUKSI SELANJUTNYA")
    print("=" * 60)
    print("""
1. Pastikan api.py yang sudah difix sudah disalin ke server
2. Restart service VoltKraft:
   - Jika menggunakan systemd: sudo systemctl restart voltkraft
   - Jika menggunakan PM2: pm2 restart voltkraft
   - Jika langsung: python api.py

3. Pantau log untuk memastikan tidak ada spam lagi:
   - Perhatikan log "[ANNUNCIATOR SKIP]" jika ada port tidak valid
   - Perhatikan log "[ANNUNCIATOR RECOVERY CLEARED]" untuk pending yang dibatalkan

4. Jika masih ada masalah, jalankan lagi script ini:
   python deploy_annunciator_fix.py
""")

    print("=" * 60)
    print("DEPLOYMENT SELESAI")
    print("=" * 60)


if __name__ == "__main__":
    main()