import sys
import time

import api


def build_test_event():
    waktu = time.strftime("%Y-%m-%d %H:%M:%S")
    return api.notification_event_template(
        "GI CIKARANG",
        "BAY TRAFO 2",
        waktu,
        "ANNUNCIATOR SYSTEM",
        ip="192.168.1.11",
        status="TEST DIRECT VOLTKRAFT",
        indikasi_lines=[
            "PORT 12: TEST DIRECT SUPABASE GI CIKARANG",
            "Tidak menjalankan polling peralatan.",
            "WhatsApp tidak disentuh oleh script test ini.",
        ],
    )


def main():
    sent = api.send_supabase_edge_notification_text(build_test_event())
    if sent:
        print("Supabase Edge Function test notification sent.")
        return 0
    print("Supabase Edge Function test notification failed.")
    return 1


if __name__ == "__main__":
    sys.exit(main())
