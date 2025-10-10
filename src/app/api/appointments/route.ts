import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { env } from '@/lib/env';
import { supabase } from '@/lib/supabase';

const appointmentSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(8),
  service: z.string().min(2),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  notes: z.string().max(500).optional().or(z.literal('')),
});

async function notifyWebhook(payload: unknown) {
  if (!env.WEBHOOK_URL) return;
  try {
    await fetch(env.WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'appointment.created', payload }),
    });
  } catch {}
}

async function notifyWhatsApp(name: string, phone: string, date: string, time: string) {
  if (!env.WHATSAPP_API_URL || !env.WHATSAPP_API_TOKEN) return;
  const msg = `Olá ${name}! Seu agendamento na BemViver para ${date} às ${time} foi recebido. Responda 1 para confirmar.`;
  try {
    await fetch(env.WHATSAPP_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.WHATSAPP_API_TOKEN}`,
      },
      body: JSON.stringify({ to: phone, message: msg }),
    });
  } catch {}
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parse = appointmentSchema.safeParse(body);
  if (!parse.success) {
    return NextResponse.json({ message: 'Dados inválidos', issues: parse.error.flatten() }, { status: 400 });
  }
  const input = parse.data;

  let saved: unknown = input;
  if (supabase) {
    const { data, error } = await supabase.from('appointments').insert({
      name: input.name,
      phone: input.phone,
      service: input.service,
      date: input.date,
      time: input.time,
      notes: input.notes || null,
      source: 'landing',
    }).select('*').single();
    if (error) {
      return NextResponse.json({ message: 'Falha ao salvar', error: error.message }, { status: 500 });
    }
    saved = data;
  }

  await Promise.all([
    notifyWebhook(saved),
    notifyWhatsApp(input.name, input.phone, input.date, input.time),
  ]);

  return NextResponse.json({ ok: true, appointment: saved });
}

export async function GET() {
  if (!supabase) return NextResponse.json({ items: [] });
  const { data, error } = await supabase.from('appointments').select('*').order('created_at', { ascending: false }).limit(100);
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json({ items: data });
}
