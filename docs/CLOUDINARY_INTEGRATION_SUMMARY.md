# Cloudinary Integration Summary

## ✅ What Changed

### Files Created
1. **`lib/cloudinary.ts`** - Cloudinary SDK configuration
2. **`docs/CLOUDINARY_SETUP.md`** - Complete setup guide
3. **`.env.example`** - Environment variables template

### Files Modified
1. **`app/api/upload-image/route.ts`** - Updated to use Cloudinary instead of local filesystem
2. **`.env`** - Added Cloudinary credentials (you need to fill these in)
3. **`package.json`** - Added `cloudinary` dependency (v2.8.0)
4. **`README.md`** - Updated with Cloudinary setup instructions

## 🔧 How It Works Now

### Before (Local Storage)
```
User uploads image 
  ↓
Saved to public/uploads/images/
  ↓
URL: /uploads/images/filename.jpg
```

### After (Cloudinary)
```
User uploads image 
  ↓
Uploaded to Cloudinary CDN
  ↓
URL: https://res.cloudinary.com/your-cloud/image/upload/v123/mammoth/articles/abc.jpg
  ↓
Stored in database
  ↓
Served from Cloudinary CDN (fast worldwide)
```

## 📋 Setup Checklist

- [x] Install Cloudinary package
- [x] Create Cloudinary configuration
- [x] Update upload API endpoint
- [x] Add environment variables template
- [x] Create documentation
- [ ] **You need to**: Get Cloudinary credentials
- [ ] **You need to**: Update `.env` file with real credentials
- [ ] **You need to**: Restart development server

## 🚀 Next Steps (Required)

### 1. Sign Up for Cloudinary

Go to: https://cloudinary.com
- Sign up for free account
- Navigate to Dashboard

### 2. Get Your Credentials

From Cloudinary Dashboard, copy:
- **Cloud Name** (e.g., `dxxxxx`)
- **API Key** (e.g., `123456789012345`)
- **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz123`)

### 3. Update .env File

Open `/Users/katydu/Desktop/mammoth/.env` and replace:

```env
CLOUDINARY_CLOUD_NAME="your_cloud_name"     # ← Replace with your cloud name
CLOUDINARY_API_KEY="your_api_key"           # ← Replace with your API key
CLOUDINARY_API_SECRET="your_api_secret"     # ← Replace with your API secret
```

### 4. Restart Server

```bash
# Stop current server (Ctrl+C in terminal)
npm run dev
```

## 🎯 What Works Out of the Box

### Cover Image Upload
- Article editor → 封面照片 section
- Click to upload or drag & drop
- Uploads to Cloudinary automatically
- Shows preview after upload

### Content Block Images
- Article editor → Add Image Block
- Same upload flow as cover image
- Each block can have different image

### All Images Features
- ✅ Automatic optimization
- ✅ Automatic format conversion (WebP, AVIF)
- ✅ CDN delivery (fast worldwide)
- ✅ Up to 10MB per image
- ✅ Secure HTTPS URLs
- ✅ Image dimensions returned

## 📊 Upload API Response

### Success Response
```json
{
  "success": true,
  "url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/mammoth/articles/abc123.jpg",
  "publicId": "mammoth/articles/abc123",
  "width": 1920,
  "height": 1080
}
```

### Error Response
```json
{
  "success": false,
  "error": "圖片大小不能超過 10MB"
}
```

## 🔍 Verification

After setup, test by:

1. Go to http://localhost:3000/dashboard/upload/article
2. Upload a cover image
3. Check browser Network tab - should show upload to `/api/upload-image`
4. Check response - should have Cloudinary URL starting with `https://res.cloudinary.com/`
5. Go to Cloudinary Dashboard - should see image under `mammoth/articles/`

## 💡 Benefits

### Storage
- 25 GB free storage on Cloudinary
- No local disk space used
- No need to backup local files

### Performance
- Served from global CDN
- Automatic compression
- Modern formats (WebP, AVIF)
- Lazy loading compatible

### Management
- View all images in Cloudinary Dashboard
- Bulk operations available
- Analytics included
- Easy to organize with folders

## 🛠️ Troubleshooting

### "Upload failed" error
**Cause**: Cloudinary credentials not set or invalid
**Solution**: 
1. Check `.env` file has correct values
2. Restart development server
3. Check Cloudinary Dashboard for valid credentials

### Image not displaying
**Cause**: URL not saved to database
**Solution**: Check browser console for API errors

### "Module not found: cloudinary"
**Cause**: Package not installed
**Solution**: Run `npm install cloudinary`

## 📚 Documentation

- **Complete Setup Guide**: [docs/CLOUDINARY_SETUP.md](../docs/CLOUDINARY_SETUP.md)
- **Cloudinary Dashboard**: https://cloudinary.com/console
- **Cloudinary Docs**: https://cloudinary.com/documentation

## ⚠️ Important Notes

1. **Environment Variables**: The `.env` file is not committed to git (in `.gitignore`)
2. **Security**: Never commit API secrets to git
3. **Free Tier**: 25GB storage, 25GB bandwidth/month
4. **Images**: Stored in `mammoth/articles/` folder in Cloudinary
5. **Old Images**: Existing local images will still work if files exist

## 🎉 Ready to Use

Once you've completed the 4 setup steps above, all image uploads will automatically use Cloudinary!

No code changes needed - the frontend already sends images to the API, and the API now handles Cloudinary upload automatically.
