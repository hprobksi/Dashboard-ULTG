import os
import sys
import time


os.environ["WHATSAPP_GATEWAY_MODE"] = "waha"

import api


def build_test_message():
    waktu = time.strftime("%d-%m-%Y %H:%M:%S.000")
    return f"""=========================
TEST WAHA VOLTKRAFT
PESAN UJI COBA
{waktu}

MODUL    : WHATSAPP WAHA
STATUS   : TEST KONEKSI
INDIKASI :
Ini hanya pesan test manual.
Tidak menjalankan polling peralatan.
Mode WhatsApp dipaksa WAHA hanya untuk script test ini.

=========================
by VoltKraft"""


def main():
    sent = api.send_whatsapp_notification(
        build_test_message(),
        allow_recovery_recap=False,
        enqueue_on_failure=False,
        respect_duplicate=False,
        fanout_secondary=False,
    )
    if sent:
        print("WAHA WhatsApp test notification sent.")
        return 0
    print("WAHA WhatsApp test notification failed.")
    return 1


if __name__ == "__main__":
    sys.exit(main())
