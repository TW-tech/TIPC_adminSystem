# Image Block Metadata Storage

## Overview

When images are uploaded via Cloudinary, the system now stores complete metadata for each image block in the database.

## Stored Fields

### Image Block Data Structure

```typescript
{
  url: string          // Cloudinary CDN URL (e.g., https://res.cloudinary.com/...)
  publicId?: string    // Cloudinary public ID (e.g., "TIPC/articles/abc123")
  width?: number       // Image width in pixels (e.g., 1920)
  height?: number      // Image height in pixels (e.g., 1080)
  alt?: string         // Alt text for accessibility
  caption?: string     // Image caption (may contain [1], [2] reference markers)
}
```

## Upload Flow

```
1. User uploads image file
   ↓
2. Frontend sends to /api/upload-image
   ↓
3. Backend uploads to Cloudinary
   ↓
4. Cloudinary returns metadata:
   - secure_url (HTTPS URL)
   - public_id (unique identifier)
   - width (pixels)
   - height (pixels)
   ↓
5. Frontend stores ALL metadata in block.data:
   {
     url: result.secure_url,
     publicId: result.public_id,
     width: result.width,
     height: result.height,
     alt: '',
     caption: ''
   }
   ↓
6. Article saved → All metadata stored in ArticleBlock.data (JSON column)
```

## Database Storage

### Prisma Schema

```prisma
model ArticleBlock {
  id        String    @id @default(cuid())
  articleId String
  position  Int
  type      BlockType  // "image", "text", or "quote"
  data      Json       // Stores the ImageBlockData JSON
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
```

### Example Data in Database

```json
{
  "id": "clx123abc",
  "articleId": "clx456def",
  "position": 1,
  "type": "image",
  "data": {
    "url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/TIPC/articles/abc123.jpg",
    "publicId": "TIPC/articles/abc123",
    "width": 1920,
    "height": 1080,
    "alt": "Article header image",
    "caption": "This is an example image [1]"
  }
}
```

## Benefits of Storing Metadata

### 1. Image Dimensions
- Can calculate aspect ratio without loading image
- Useful for responsive layouts
- Prevent layout shift (CLS)

```typescript
const aspectRatio = block.data.width / block.data.height
```

### 2. Cloudinary Public ID
- Can generate transformations on-the-fly
- Delete specific images from Cloudinary
- Track which images are used

```typescript
// Generate thumbnail
const thumbnailUrl = `https://res.cloudinary.com/your-cloud/image/upload/w_300/${block.data.publicId}.jpg`

// Delete image from Cloudinary
await cloudinary.uploader.destroy(block.data.publicId)
```

### 3. Original URL
- Direct access to optimized CDN image
- No need to reconstruct URL

## Frontend Usage

### Displaying Image Block

```tsx
{block.type === 'image' && (
  <div>
    <img 
      src={block.data.url}
      alt={block.data.alt || 'Article image'}
      width={block.data.width}
      height={block.data.height}
      loading="lazy"
    />
    {block.data.caption && (
      <p className="caption">{block.data.caption}</p>
    )}
  </div>
)}
```

### Responsive Images

```tsx
// Use Cloudinary transformations based on stored dimensions
const generateResponsiveUrl = (publicId: string, maxWidth: number) => {
  return `https://res.cloudinary.com/your-cloud/image/upload/w_${maxWidth},q_auto,f_auto/${publicId}`
}

// In component
<picture>
  <source 
    media="(max-width: 640px)" 
    srcSet={generateResponsiveUrl(block.data.publicId, 640)} 
  />
  <source 
    media="(max-width: 1024px)" 
    srcSet={generateResponsiveUrl(block.data.publicId, 1024)} 
  />
  <img src={block.data.url} alt={block.data.alt} />
</picture>
```

## Validation

The Zod schema ensures data integrity:

```typescript
export const ImageBlockDataSchema = z.object({
  url: z.string().url('Invalid image URL'),
  publicId: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  alt: z.string().optional(),
  caption: z.string().optional(),
})
```

## API Response Example

### Upload Image API Response

```json
{
  "success": true,
  "url": "https://res.cloudinary.com/demo/image/upload/v1234567890/TIPC/articles/sample.jpg",
  "publicId": "TIPC/articles/sample",
  "width": 2400,
  "height": 1600
}
```

### Article Block Data

After upload, the frontend stores:

```typescript
{
  type: 'image',
  data: {
    url: "https://res.cloudinary.com/.../sample.jpg",
    publicId: "TIPC/articles/sample",
    width: 2400,
    height: 1600,
    alt: "",
    caption: ""
  },
  position: 0
}
```

## Cover Image

**Note**: Currently, cover images only store the URL. If you need metadata for cover images too, you can:

1. Add fields to Article model:
```prisma
model Article {
  coverImage       String
  coverImagePublicId String?
  coverImageWidth    Int?
  coverImageHeight   Int?
}
```

2. Update frontend to save metadata:
```typescript
setCoverImage(result.url)
setCoverImagePublicId(result.publicId)
setCoverImageWidth(result.width)
setCoverImageHeight(result.height)
```

## Migration Notes

- **No database migration needed** - metadata stored in existing JSON `data` field
- **Backward compatible** - old image blocks without metadata still work
- **Optional fields** - publicId, width, height are optional (validation passes without them)
- **Automatic** - all new uploads automatically include metadata

## Advanced Use Cases

### 1. Image Management Dashboard

Query all images with metadata:

```typescript
const articles = await prisma.article.findMany({
  include: {
    blocks: {
      where: { type: 'image' }
    }
  }
})

// Extract all Cloudinary public IDs
const imageIds = articles.flatMap(article => 
  article.blocks
    .filter(block => block.data.publicId)
    .map(block => block.data.publicId)
)
```

### 2. Bulk Image Operations

```typescript
// Delete unused images from Cloudinary
const imagesToDelete = ['TIPC/articles/abc', 'TIPC/articles/xyz']
await Promise.all(
  imagesToDelete.map(id => cloudinary.uploader.destroy(id))
)
```

### 3. Image Analytics

```typescript
// Calculate total storage used
const totalPixels = articles.reduce((sum, article) => {
  return sum + article.blocks
    .filter(block => block.type === 'image')
    .reduce((blockSum, block) => 
      blockSum + (block.data.width * block.data.height || 0), 0
    )
}, 0)
```

## Troubleshooting

### Missing Metadata

**Symptoms**: `publicId`, `width`, or `height` are undefined

**Causes**:
1. Image uploaded before metadata storage was implemented
2. Upload API error (check console logs)
3. Cloudinary response didn't include metadata

**Solution**:
- New uploads automatically include metadata
- Old images can be re-uploaded or manually updated

### Invalid URLs

**Symptoms**: Images not loading

**Check**:
1. URL starts with `https://res.cloudinary.com/`
2. publicId matches the URL
3. Cloudinary account is active

## Related Files

- **Upload API**: `/app/api/upload-image/route.ts`
- **Validation**: `/lib/validation/article.schema.ts`
- **Frontend**: `/app/dashboard/upload/article/page.tsx`
- **Schema**: `/prisma/schema.prisma`
