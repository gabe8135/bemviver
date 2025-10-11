import { env } from './env';

const BASE_URL = 'https://graph.facebook.com/v22.0';

type TemplateParam = { type: 'text'; text: string };

export async function sendWhatsAppTemplate(to: string, templateName?: string, params: string[] = []) {
  if (!env.WHATSAPP_TOKEN || !env.WHATSAPP_PHONE_NUMBER_ID) return { skipped: true };
  const name = templateName || env.WHATSAPP_TEMPLATE_CLIENT || 'hello_world';
  // hello_world geralmente só existe em en_US
  const lang = name === 'hello_world' ? 'en_US' : (env.WHATSAPP_TEMPLATE_LANG || 'pt_BR');
  const toDigits = (to || '').replace(/^\+/, '');

  const components = params.length
    ? [
        {
          type: 'body',
          parameters: params.map<TemplateParam>((p) => ({ type: 'text', text: p })),
        },
      ]
    : undefined;

  const payload = {
    messaging_product: 'whatsapp',
  to: toDigits,
    type: 'template',
    template: {
      name,
      language: { code: lang },
      components,
    },
  };

  const url = `${BASE_URL}/${env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.WHATSAPP_TOKEN}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error('WhatsApp template send failed', { status: res.status, data });
  }
  return { ok: res.ok, status: res.status, data };
}

export async function sendWhatsAppText(to: string, text: string) {
  if (!env.WHATSAPP_TOKEN || !env.WHATSAPP_PHONE_NUMBER_ID) return { skipped: true };
  const url = `${BASE_URL}/${env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
  const toDigits = (to || '').replace(/^\+/, '');
  const payload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: toDigits,
    type: 'text',
    text: { body: text },
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.WHATSAPP_TOKEN}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error('WhatsApp text send failed', { status: res.status, data });
  }
  return { ok: res.ok, status: res.status, data };
}

export function normalizePhoneE164Br(phone: string) {
  const raw = (phone || '').trim();
  if (!raw) return '';
  // Preserve already well-formed E.164 numbers
  if (raw.startsWith('+')) {
    // Keep only leading '+' and digits
    const cleaned = '+' + raw.replace(/[^\d]/g, '');
    return cleaned;
  }
  const digits = raw.replace(/\D+/g, '');
  // Convert 00CC... to +CC...
  if (digits.startsWith('00')) {
    return '+' + digits.slice(2);
  }
  // If already includes BR country code with expected length, keep it
  if (digits.startsWith('55') && digits.length >= 12 && digits.length <= 13) {
    return '+' + digits;
  }
  // If it's a local BR number (10-11 digits), prepend +55
  if (digits.length >= 10 && digits.length <= 11) {
    return '+55' + digits;
  }
  // Fallback: just prefix '+'
  return '+' + digits;
}
