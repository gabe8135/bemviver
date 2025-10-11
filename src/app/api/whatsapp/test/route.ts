import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { sendWhatsAppText } from '@/lib/whatsapp';

function unauthorized(message = 'Unauthorized') {
  return NextResponse.json({ message }, { status: 401, headers: { 'WWW-Authenticate': 'Basic realm="bemviver"' } });
}

export async function GET(req: NextRequest) {
  // Basic Auth
  const auth = req.headers.get('authorization');
  if (!auth || !auth.startsWith('Basic ')) return unauthorized();
  const decoded = Buffer.from(auth.replace(/^Basic\s+/i, ''), 'base64').toString('utf8');
  const [user, pass] = decoded.split(':');
  if (user !== env.ADMIN_BASIC_USER || pass !== env.ADMIN_BASIC_PASS) return unauthorized('Invalid credentials');

  const { searchParams } = new URL(req.url);
  const mode = (searchParams.get('mode') || '').toLowerCase();
  const to = (searchParams.get('to') || '').trim();
  const text = (searchParams.get('text') || 'Teste WhatsApp (prod)').trim();
  if (mode !== 'ping' && !to) return NextResponse.json({ message: 'Missing to param (digits only, e.g., 5511999999999)' }, { status: 400 });

  if (!env.WHATSAPP_TOKEN || !env.WHATSAPP_PHONE_NUMBER_ID) {
    return NextResponse.json({ message: 'Missing WhatsApp Cloud API envs', have: {
      WHATSAPP_TOKEN: !!env.WHATSAPP_TOKEN,
      WHATSAPP_PHONE_NUMBER_ID: !!env.WHATSAPP_PHONE_NUMBER_ID,
    } }, { status: 500 });
  }

  if (mode === 'ping') {
    // Verify token and assets from production environment
    const base = 'https://graph.facebook.com/v22.0';
    const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${env.WHATSAPP_TOKEN}` } as const;
    const results: any = {};
    try {
      const me = await fetch(`${base}/me?fields=id,name`, { headers });
      results.me = { status: me.status, data: await me.json().catch(() => ({})) };
    } catch (e) {
      results.me = { error: String(e) };
    }
    if (env.WHATSAPP_WABA_ID) {
      try {
        const w = await fetch(`${base}/${env.WHATSAPP_WABA_ID}/phone_numbers?fields=id,display_phone_number`, { headers });
        results.waba_phone_numbers = { status: w.status, data: await w.json().catch(() => ({})) };
      } catch (e) {
        results.waba_phone_numbers = { error: String(e) };
      }
    }
    return NextResponse.json({ ok: true, checks: results });
  }

  const result = await sendWhatsAppText('+' + to, text);
  return NextResponse.json({ result });
}
