import { z } from 'zod'

// BlockType enum
export const BlockTypeSchema = z.enum(['text', 'image', 'quote'])

// Block Data Schemas
export const TextBlockDataSchema = z.object({
  content: z.string().min(1, 'Text content cannot be empty'),
})

export const ImageBlockDataSchema = z.object({
  url: z.string().url('Invalid image URL'),
  publicId: z.string().optional(), // Cloudinary public ID
  width: z.number().optional(), // Image width in pixels
  height: z.number().optional(), // Image height in pixels
  alt: z.string().optional(),
  caption: z.string().optional(), // 可能包含 [1], [2] 等 reference markers
})

export const QuoteBlockDataSchema = z.object({
  content: z.string().min(1, 'Quote content cannot be empty'),
  author: z.string().optional(),
  source: z.string().optional(),
})

// Discriminated Union for Block Data
export const BlockDataSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('text'),
    data: TextBlockDataSchema,
  }),
  z.object({
    type: z.literal('image'),
    data: ImageBlockDataSchema,
  }),
  z.object({
    type: z.literal('quote'),
    data: QuoteBlockDataSchema,
  }),
])

// Article Block Schema
export const ArticleBlockSchema = z.object({
  id: z.number().optional(), // Optional for creation
  type: BlockTypeSchema,
  data: z.record(z.string(), z.any()), // JSON field, validated separately by BlockDataSchema
  position: z.number().int().min(0),
})

// Annotation Schema
export const AnnotationSchema = z.object({
  id: z.number().int().positive(),
  content: z.string().min(1, 'Annotation content cannot be empty'),
  url: z.string().url('Invalid annotation URL').optional().or(z.literal('')),
})

// Video Schema
export const VideoSchema = z.object({
  url: z.string().url('Invalid video URL'),
})

// Podcast Schema
export const PodcastSchema = z.object({
  url: z.string().url('Invalid podcast URL'),
})

// Complete Article Creation Schema
export const CreateArticleSchema = z.object({
  author: z.string().min(1, 'Author is required'),
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  coverImage: z.string().url('Invalid cover image URL').min(1, 'Cover image is required'),
  slug: z.string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  publishedAt: z.string().datetime().optional(),
  
  // Blocks
  blocks: z.array(ArticleBlockSchema).min(1, 'At least one block is required'),
  
  // Annotations
  annotations: z.array(AnnotationSchema).optional(),
  
  // Videos and Podcasts (optional)
  videos: z.array(VideoSchema).optional(),
  podcasts: z.array(PodcastSchema).optional(),
  
  // Keywords and NineBlocks (IDs)
  keywordIds: z.array(z.string()).optional(),
  newKeywords: z.array(z.string()).optional(), // New keywords to create
  nineBlockIds: z.array(z.string()).optional(),
  cakeCategoryId: z.array(z.string()).optional(), // Cake category IDs
})

// Article Update Schema (all fields optional except id)
export const UpdateArticleSchema = CreateArticleSchema.partial().extend({
  id: z.number().int().positive(),
})

// Export types
export type BlockType = z.infer<typeof BlockTypeSchema>
export type TextBlockData = z.infer<typeof TextBlockDataSchema>
export type ImageBlockData = z.infer<typeof ImageBlockDataSchema>
export type QuoteBlockData = z.infer<typeof QuoteBlockDataSchema>
export type ArticleBlock = z.infer<typeof ArticleBlockSchema>
export type Annotation = z.infer<typeof AnnotationSchema>
export type Video = z.infer<typeof VideoSchema>
export type Podcast = z.infer<typeof PodcastSchema>
export type CreateArticleInput = z.infer<typeof CreateArticleSchema>
export type UpdateArticleInput = z.infer<typeof UpdateArticleSchema>
