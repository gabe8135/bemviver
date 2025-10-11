import { z } from 'zod';

const serverSchema = z.object({
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  WEBHOOK_URL: z.string().url().optional(),
  // Legacy custom webhook sender (unused with Cloud API)
  WHATSAPP_API_URL: z.string().url().optional(),
  WHATSAPP_API_TOKEN: z.string().optional(),
  // WhatsApp Cloud API variables
  WHATSAPP_TOKEN: z.string().optional(),
  WHATSAPP_PHONE_NUMBER_ID: z.string().optional(),
  WHATSAPP_WABA_ID: z.string().optional(),
  WHATSAPP_TEMPLATE_CLIENT: z.string().optional(),
  WHATSAPP_TEMPLATE_LANG: z.string().optional(),
  WHATSAPP_OWNER_NUMBER: z.string().optional(),
  WHATSAPP_VERIFY_TOKEN: z.string().optional(),
  WHATSAPP_USE_TEMPLATE: z.string().optional(),
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
  WHATSAPP_TOKEN: process.env.WHATSAPP_TOKEN,
  WHATSAPP_PHONE_NUMBER_ID: process.env.WHATSAPP_PHONE_NUMBER_ID,
  WHATSAPP_WABA_ID: process.env.WHATSAPP_WABA_ID,
  WHATSAPP_TEMPLATE_CLIENT: process.env.WHATSAPP_TEMPLATE_CLIENT,
  WHATSAPP_TEMPLATE_LANG: process.env.WHATSAPP_TEMPLATE_LANG,
  WHATSAPP_OWNER_NUMBER: process.env.WHATSAPP_OWNER_NUMBER,
  WHATSAPP_VERIFY_TOKEN: process.env.WHATSAPP_VERIFY_TOKEN,
  WHATSAPP_USE_TEMPLATE: process.env.WHATSAPP_USE_TEMPLATE,
  ADMIN_BASIC_USER: process.env.ADMIN_BASIC_USER,
  ADMIN_BASIC_PASS: process.env.ADMIN_BASIC_PASS,
});
