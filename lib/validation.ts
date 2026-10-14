import { z } from 'zod';

export const PhotoMetadataSchema = z.object({
  id: z.string().uuid(),
  storagePath: z.string().min(1),
  downloadUrl: z.string().url(),
  createdAt: z.string().datetime(),
  expiresAt: z.string().datetime(),
  format: z.enum(['jpeg', 'png', 'webp']),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  uploadStatus: z.enum(['pending', 'complete', 'failed']),
  eventId: z.string().optional(),
});

export type PhotoMetadata = z.infer<typeof PhotoMetadataSchema>;

export const EventSettingsSchema = z.object({
  eventTitle: z.string().min(1).max(100).default('VIBE CODING'),
  institutionName: z.string().max(100).default('CSE Department'),
  eventDate: z.string().default('2026'),
  tagline: z.string().max(200).default('BUILD SOMETHING. CAPTURE THE MOMENT.'),
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).default('#FFD400'),
  secondaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).default('#FF9F1C'),
  retentionHours: z.number().int().min(1).max(168).default(24),
  maxPhotoSizeMb: z.number().int().min(1).max(50).default(10),
});

export type EventSettings = z.infer<typeof EventSettingsSchema>;

export const UploadPhotoSchema = z.object({
  imageData: z.string().min(1), // base64 data URL
  format: z.enum(['jpeg', 'png', 'webp']).default('jpeg'),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  consentGiven: z.boolean().refine((v) => v === true, 'Consent is required'),
});
