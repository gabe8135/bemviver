import { z } from 'zod';

const serverSchema = z.object({
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  WEBHOOK_URL: z.string().url().optional(),
  WHATSAPP_API_URL: z.string().url().optional(),
  WHATSAPP_API_TOKEN: z.string().optional(),
  ADMIN_BASIC_USER: z.string().default('admin'),
  ADMIN_BASIC_PASS: z.string().default('admin'),
});

export const env = serverSchema.parse({
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  WEBHOOK_URL: process.env.WEBHOOK_URL,
  WHATSAPP_API_URL: process.env.WHATSAPP_API_URL,
  WHATSAPP_API_TOKEN: process.env.WHATSAPP_API_TOKEN,
  ADMIN_BASIC_USER: process.env.ADMIN_BASIC_USER,
  ADMIN_BASIC_PASS: process.env.ADMIN_BASIC_PASS,
});
