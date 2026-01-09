# Cloudinary Image Upload Integration

All image uploads in the Mammoth CMS are now handled by Cloudinary, providing:
- ✅ Automatic image optimization
- ✅ CDN delivery for fast loading
- ✅ Automatic format conversion (WebP, AVIF)
- ✅ No local storage needed
- ✅ Image transformations on-the-fly

## Setup Instructions

### 1. Create a Cloudinary Account

1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Sign up for a free account (generous free tier)
3. After signup, you'll be taken to the Dashboard

### 2. Get Your Credentials

From your Cloudinary Dashboard:

1. Find the **Account Details** section
2. Copy these three values:
   - **Cloud Name** (e.g., `dxxxxx`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz`)

### 3. Configure Environment Variables

Update your `.env` file with the values from step 2:

```env
CLOUDINARY_CLOUD_NAME="your_actual_cloud_name"
CLOUDINARY_API_KEY="your_actual_api_key"
CLOUDINARY_API_SECRET="your_actual_api_secret"
```

⚠️ **Important**: Replace `your_actual_*` with your real credentials

### 4. Restart Your Development Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## How It Works

### Upload Flow

1. User selects an image in the article editor
2. Frontend sends image to `/api/upload-image`
3. Backend uploads to Cloudinary using the SDK
4. Cloudinary returns a secure URL
5. URL is stored in the database
6. Image is rendered from Cloudinary CDN

### Storage Location

Images are organized in Cloudinary under:
```
mammoth/
  └── articles/
      ├── image1.jpg
      ├── image2.png
      └── ...
```

### Automatic Optimizations

Cloudinary automatically:
- Compresses images for optimal size
- Converts to modern formats (WebP, AVIF)
- Serves from CDN (fast worldwide delivery)
- Generates responsive image variants

## Usage in Code

### Upload API Endpoint
**Location**: `/app/api/upload-image/route.ts`

**Features**:
- Accepts images up to 10MB
- Validates file type (images only)
- Uploads to `mammoth/articles/` folder
- Returns secure HTTPS URL

**Response**:
```json
{
  "success": true,
  "url": "https://res.cloudinary.com/your-cloud/image/upload/v123456/mammoth/articles/abc.jpg",
  "publicId": "mammoth/articles/abc",
  "width": 1920,
  "height": 1080
}
```

### Frontend Integration

**Cover Image Upload**: `app/dashboard/upload/article/page.tsx`
- Uses `handleCoverImageUpload()` function
- Displays upload progress with spinner
- Shows preview after upload
- Stores Cloudinary URL in database

**Content Block Images**: Same page
- Uses `handleImageUpload()` function
- Each image block can have its own image
- All stored as Cloudinary URLs

## Benefits

### Performance
- ⚡ Fast CDN delivery worldwide
- 📉 Automatic compression (smaller file sizes)
- 🖼️ Modern formats (WebP, AVIF)
- 📱 Responsive image delivery

### Storage
- ☁️ No local file system storage needed
- 💾 No disk space concerns
- 🔄 Easy backup and recovery
- 🌐 Accessible from anywhere

### Management
- 🎨 Image transformations on-demand
- 📊 Usage analytics in Cloudinary dashboard
- 🗑️ Easy bulk operations
- 🔍 Search and organize images

## Troubleshooting

### "Upload failed" Error

**Check**:
1. Environment variables are set correctly in `.env`
2. Development server was restarted after adding variables
3. Cloudinary credentials are valid
4. Internet connection is working

### "Image not loading" Error

**Check**:
1. URL starts with `https://res.cloudinary.com/`
2. Cloudinary account is active
3. Image wasn't deleted from Cloudinary
4. Browser console for CORS or network errors

### Console Errors

View detailed error logs:
```bash
# Check terminal where npm run dev is running
# Look for "Upload error:" messages
```

## Free Tier Limits

Cloudinary free tier includes:
- ✅ 25 GB storage
- ✅ 25 GB bandwidth per month
- ✅ Unlimited transformations
- ✅ All optimization features

This is sufficient for most small to medium projects.

## Migration from Local Storage

If you had images stored locally before:

1. Old URLs: `/uploads/images/filename.jpg`
2. New URLs: `https://res.cloudinary.com/.../filename.jpg`

**Note**: Old local images will continue to work if files exist. New uploads automatically use Cloudinary.

To migrate existing images:
1. Upload them manually via Cloudinary dashboard, or
2. Create a migration script to bulk upload to Cloudinary

## Advanced Configuration

### Custom Transformations

Edit `/lib/cloudinary.ts` to add global transformations:

```typescript
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Always use HTTPS
})
```

### Custom Upload Options

Edit `/app/api/upload-image/route.ts` upload options:

```typescript
const uploadStream = cloudinary.uploader.upload_stream({
  folder: 'mammoth/articles',
  resource_type: 'image',
  transformation: [
    { quality: 'auto', fetch_format: 'auto' },
    { width: 2000, crop: 'limit' }, // Max width
  ]
})
```

## Security

- ✅ API credentials stored in environment variables (not in code)
- ✅ `.env` file excluded from git (via `.gitignore`)
- ✅ Secure HTTPS URLs only
- ✅ File type validation before upload
- ✅ File size limits enforced

## Support

- 📚 [Cloudinary Documentation](https://cloudinary.com/documentation)
- 🎓 [Cloudinary Academy](https://training.cloudinary.com/)
- 💬 [Cloudinary Support](https://support.cloudinary.com/)
