import sys
import time

import api


def build_test_message():
    waktu = time.strftime("%Y-%m-%d %H:%M:%S")
    return api.notification_event_template(
        "TEST TELEGRAM VOLTKRAFT",
        "PESAN UJI COBA",
        waktu,
        "TELEGRAM",
        status="TEST KONEKSI",
        indikasi_lines=[
            "Ini hanya pesan test manual.",
            "Tidak menjalankan polling peralatan.",
            "WhatsApp tidak disentuh oleh script test ini.",
        ],
    )


def main():
    sent = api.send_telegram_notification(build_test_message())
    if sent:
        print("Telegram test notification sent.")
        return 0
    print("Telegram test notification failed.")
    return 1


if __name__ == "__main__":
    sys.exit(main())
