import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { supabase } from '@/lib/supabase';
import { sendWhatsAppText } from '@/lib/whatsapp';

// GET: Verification handshake from Meta (hub.challenge)
export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const mode = searchParams.get('hub.mode');
	const token = searchParams.get('hub.verify_token');
	const challenge = searchParams.get('hub.challenge');

	if (mode === 'subscribe' && token && challenge) {
		if (token === env.WHATSAPP_VERIFY_TOKEN) {
			return new NextResponse(challenge, { status: 200, headers: { 'Content-Type': 'text/plain' } });
		}
		return NextResponse.json({ message: 'Verify token mismatch' }, { status: 403 });
	}
	return NextResponse.json({ ok: true });
}

// POST: Receive inbound messages and status updates
export async function POST(req: NextRequest) {
	const body = await req.json().catch(() => null);
	// Minimal logging for debugging; avoid throwing to keep webhook healthy
	console.log('WhatsApp webhook received:', JSON.stringify(body));

	try {
		// Expected structure per Meta docs
		const entries = body?.entry ?? [];
		for (const entry of entries) {
			const changes = entry?.changes ?? [];
			for (const change of changes) {
				const messages = change?.value?.messages ?? [];
				for (const msg of messages) {
					const from: string | undefined = msg?.from; // e.g., '5511999999999'
					const type: string | undefined = msg?.type;
					if (!from || type !== 'text') continue;
					const textBody: string = (msg?.text?.body || '').toString().trim();
					if (textBody === '1') {
						const phoneE164 = `+${from}`;
						// Find most recent appointment for this phone
						if (supabase) {
							const { data: appt, error } = await supabase
								.from('appointments')
								.select('*')
								.eq('phone', phoneE164)
								.order('created_at', { ascending: false })
								.limit(1)
								.maybeSingle();

							if (!error && appt) {
								// Update notes to mark confirmation
								const nowIso = new Date().toISOString();
								const newNotes = `${appt.notes ? appt.notes + '\n' : ''}[CONFIRMADO VIA WHATSAPP] ${nowIso}`;
								await supabase
									.from('appointments')
									.update({ notes: newNotes })
									.eq('id', appt.id);

								// Reply to client
								await sendWhatsAppText(phoneE164, `Obrigado! Seu agendamento para ${appt.date} às ${appt.time?.slice(0,5)} foi confirmado.`).catch(() => undefined);
								// Notify owner if configured
								if (env.WHATSAPP_OWNER_NUMBER) {
									await sendWhatsAppText(env.WHATSAPP_OWNER_NUMBER, `Cliente confirmou: ${appt.name} — ${appt.date} ${appt.time?.slice(0,5)} (${phoneE164})`).catch(() => undefined);
								}
							} else {
								// No appointment found
								await sendWhatsAppText(phoneE164, 'Não encontrei um agendamento recente para este número. Se for um novo agendamento, por favor agende pelo site.').catch(() => undefined);
							}
						}
					}
				}
			}
		}
	} catch (e) {
		console.error('Webhook handling error:', e);
	}

	// Always acknowledge to avoid retries
	return NextResponse.json({ received: true });
}

