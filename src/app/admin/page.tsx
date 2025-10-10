'use client';
import { useEffect, useState } from 'react';

type Appointment = {
  id?: number;
  name: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  notes?: string | null;
  created_at?: string;
};

export default function AdminPage() {
  const [items, setItems] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/appointments');
        const data = await res.json();
        setItems(data.items || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <main className="container py-10">
      <h1 className="text-2xl font-semibold mb-6">Agendamentos</h1>
      {loading ? (
        <p>Carregando...</p>
      ) : items.length === 0 ? (
        <p>Nenhum agendamento ainda.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 border">Quando</th>
                <th className="p-2 border">Nome</th>
                <th className="p-2 border">WhatsApp</th>
                <th className="p-2 border">Serviço</th>
                <th className="p-2 border">Obs</th>
              </tr>
            </thead>
            <tbody>
              {items.map((a, i) => (
                <tr key={(a.id ?? i).toString()} className="odd:bg-white even:bg-gray-50">
                  <td className="p-2 border whitespace-nowrap">{a.date} {a.time}</td>
                  <td className="p-2 border">{a.name}</td>
                  <td className="p-2 border">{a.phone}</td>
                  <td className="p-2 border">{a.service}</td>
                  <td className="p-2 border max-w-[300px] truncate" title={a.notes ?? ''}>{a.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
