const DEFAULT_TABLE = "voltkraft_notifications";

type TelegramUser = {
  id?: number;
  is_bot?: boolean;
  first_name?: string;
  last_name?: string;
  username?: string;
};

type TelegramChat = {
  id?: number;
  type?: string;
  title?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
};

type TelegramMessage = {
  message_id?: number;
  date?: number;
  chat?: TelegramChat;
  from?: TelegramUser;
  text?: string;
  caption?: string;
};

type TelegramUpdate = {
  update_id?: number;
  message?: TelegramMessage;
  edited_message?: TelegramMessage;
  channel_post?: TelegramMessage;
  edited_channel_post?: TelegramMessage;
};

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function getRequiredEnv(name: string) {
  const value = Deno.env.get(name)?.trim();
  if (!value) {
    throw new Error(`Missing required env: ${name}`);
  }
  return value;
}

function getSupabaseServiceKey() {
  const panduVoltKraftKey = Deno.env.get("PANDUGIXVOLTKRAFT_SERVICE_ROLE_KEY")?.trim();
  if (panduVoltKraftKey) {
    return panduVoltKraftKey;
  }

  const directKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")?.trim();
  if (directKey) {
    return directKey;
  }

  const secretKeys = Deno.env.get("SUPABASE_SECRET_KEYS")?.trim();
  if (secretKeys) {
    try {
      const parsed = JSON.parse(secretKeys);
      if (parsed?.default) {
        return String(parsed.default);
      }
    } catch (_error) {
      // Fall through to the explicit error below.
    }
  }

  throw new Error("Missing Supabase service role secret.");
}

function getTelegramMessage(update: TelegramUpdate) {
  return (
    update.message ??
    update.edited_message ??
    update.channel_post ??
    update.edited_channel_post ??
    null
  );
}

function chatLabel(chat?: TelegramChat) {
  if (!chat) {
    return "";
  }
  return chat.title ?? chat.username ?? chat.first_name ?? String(chat.id ?? "");
}

function senderLabel(user?: TelegramUser) {
  if (!user) {
    return "";
  }
  return [
    user.first_name ?? "",
    user.last_name ?? "",
    user.username ? `@${user.username}` : "",
  ].filter(Boolean).join(" ").trim();
}

function buildNotificationPayload(update: TelegramUpdate) {
  const message = getTelegramMessage(update);
  const text = (message?.text ?? message?.caption ?? "").trim();
  const chat = message?.chat;
  const sender = message?.from;

  return {
    source: "Telegram",
    channel: "telegram",
    title: "Telegram Notification",
    subtitle: chatLabel(chat),
    module: "TELEGRAM WEBHOOK",
    status: "RECEIVED",
    message: text || JSON.stringify(update),
    telegram_update_id: update.update_id ?? null,
    telegram_chat_id: chat?.id ? String(chat.id) : null,
    telegram_message_id: message?.message_id ?? null,
    telegram_sender: senderLabel(sender),
    payload: update,
  };
}

async function insertNotification(payload: Record<string, unknown>) {
  const supabaseUrl = getRequiredEnv("SUPABASE_URL").replace(/\/$/, "");
  const serviceKey = getSupabaseServiceKey();
  const table = Deno.env.get("SUPABASE_NOTIFICATIONS_TABLE")?.trim() || DEFAULT_TABLE;
  const url = `${supabaseUrl}/rest/v1/${encodeURIComponent(table)}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    return { ok: true, duplicate: false };
  }

  const text = await response.text();
  if (response.status === 409) {
    return { ok: true, duplicate: true };
  }

  return {
    ok: false,
    status: response.status,
    error: text.slice(0, 500),
  };
}

Deno.serve(async (request) => {
  if (request.method === "GET") {
    return jsonResponse({ ok: true, service: "telegram-to-supabase" });
  }

  if (request.method !== "POST") {
    return jsonResponse({ ok: false, error: "Method not allowed" }, 405);
  }

  const expectedSecret = Deno.env.get("TELEGRAM_WEBHOOK_SECRET")?.trim();
  if (expectedSecret) {
    const receivedSecret = request.headers.get("X-Telegram-Bot-Api-Secret-Token") ?? "";
    if (receivedSecret !== expectedSecret) {
      return jsonResponse({ ok: false, error: "Invalid Telegram webhook secret" }, 401);
    }
  }

  let update: TelegramUpdate;
  try {
    update = await request.json();
  } catch (_error) {
    return jsonResponse({ ok: false, error: "Invalid JSON payload" }, 400);
  }

  const payload = buildNotificationPayload(update);
  const result = await insertNotification(payload);
  if (!result.ok) {
    console.error("Supabase insert failed", result);
    return jsonResponse({ ok: false, error: "Supabase insert failed" }, 500);
  }

  return jsonResponse({
    ok: true,
    update_id: update.update_id ?? null,
    duplicate: Boolean(result.duplicate),
  });
});
