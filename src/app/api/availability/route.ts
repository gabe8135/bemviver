import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const BUSINESS_START_HOUR = 8;
const BUSINESS_END_HOUR = 18; // último começo 17:30
const SLOT_MINUTES = 30;

function toISODate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function isWeekend(d: Date) {
  const day = d.getDay();
  return day === 0 || day === 6;
}

function generateTimeSlots(startHour: number, endHour: number, stepMin: number) {
  const slots: string[] = [];
  for (let h = startHour; h < endHour; h++) {
    for (let m = 0; m < 60; m += stepMin) {
      if (h === endHour - 1 && m > 30) continue;
      const hh = String(h).padStart(2, '0');
      const mm = String(m).padStart(2, '0');
      slots.push(`${hh}:${mm}`);
    }
  }
  return slots;
}

function toHHmm(t: string | null): string | null {
  if (!t) return null;
  // aceita formatos 'HH:mm' ou 'HH:mm:ss'
  const m = t.match(/^(\d{2}):(\d{2})(?::(\d{2}))?$/);
  if (!m) return t;
  const hh = m[1];
  const mm = m[2];
  return `${hh}:${mm}`;
}

export async function GET(req: NextRequest) {
  if (!supabase) return NextResponse.json({ days: [] });
  const { searchParams } = new URL(req.url);
  const from = searchParams.get('from') || toISODate(new Date());
  const daysParam = parseInt(searchParams.get('days') || '14', 10);
  const service = searchParams.get('service') || null; // slug ou null (todos)

  // construir janela de datas somente em dias úteis
  const days: string[] = [];
  const start = new Date(from);
  for (let i = 0; days.length < daysParam && i < 60; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    if (isWeekend(d)) continue;
    days.push(toISODate(d));
  }
  const to = days[days.length - 1] || from;

  // buscar appointments na janela
  const { data: appts, error: apptErr } = await supabase
    .from('appointments')
    .select('date, time, service')
    .gte('date', from)
    .lte('date', to);
  if (apptErr) return NextResponse.json({ message: apptErr.message }, { status: 500 });

  // buscar availability_blocks na janela
  const { data: blocks, error: blkErr } = await supabase
    .from('availability_blocks')
    .select('date, time, service')
    .gte('date', from)
    .lte('date', to);
  if (blkErr) return NextResponse.json({ message: blkErr.message }, { status: 500 });

  // mapear ocupação por dia/hora/serviço
  const occ = new Map<string, Set<string>>(); // key: date, value: set of times occupied
  const svcFilter = (s: string | null) => !service || s === service;
  for (const a of appts || []) {
    if (!svcFilter(a.service)) continue;
    const key = a.date as string;
    if (!occ.has(key)) occ.set(key, new Set());
    const tt = toHHmm(a.time as string);
    if (tt) occ.get(key)!.add(tt);
  }

  // mapear bloqueios (dia inteiro e horários)
  const dayBlocked = new Set<string>();
  const slotBlocked = new Map<string, Set<string>>();
  for (const b of blocks || []) {
    if (b.service && service && b.service !== service) continue; // bloqueio de outro serviço
    const key = b.date as string;
    if (b.time == null) {
      dayBlocked.add(key);
    } else {
      if (!slotBlocked.has(key)) slotBlocked.set(key, new Set());
      const tt = toHHmm(b.time as string);
      if (tt) slotBlocked.get(key)!.add(tt);
    }
  }

  // montar resposta
  const slots = generateTimeSlots(BUSINESS_START_HOUR, BUSINESS_END_HOUR, SLOT_MINUTES);
  const result = days.map((date) => {
    const blockedDay = dayBlocked.has(date);
    const times = slots.map((t) => {
      const isBlocked = blockedDay || slotBlocked.get(date)?.has(t) || false;
      const isOccupied = occ.get(date)?.has(t) || false;
      return { time: t, available: !(isBlocked || isOccupied) };
    });
    return { date, blocked: blockedDay, times };
  });

  return NextResponse.json({ days: result });
}
