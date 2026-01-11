# TIPC Admin System

A modern Content Management System built with Next.js, Prisma, and PostgreSQL for TIPC (Taiwan Indigenous People Cultural Park). Manage articles, photographs, videos, books, events, partners, and archives with a unified admin interface.

## Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database (Use Neon PostgreSQL or local PostgreSQL)
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"

# Cloudinary (Required for image uploads)
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

**📚 See [docs/CLOUDINARY_SETUP.md](docs/CLOUDINARY_SETUP.md) for detailed Cloudinary setup instructions**

### 3. Setup Database
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed initial data
npx tsx scripts/seed-nine-blocks.ts

# Create test user (optional)
npx tsx scripts/create-test-user.ts
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) - you'll be redirected to the login page.

## Features

### ✅ Content Management
- **Articles** - Rich block-based content editor with text, image, and quote blocks
- **Photographs** - Photo gallery management with metadata
- **Videos** - Video content management
- **Books** - Book catalog with author and publisher information
- **Events** - Event listings with dates and images
- **Partners** - Partner organization management
- **Archives** - Document archive system
### ✅ Content Features
- Drag-and-drop block reordering
- Reference annotations with validation
- Multiple videos and podcasts per article
- Keyword tagging and search
- Content filtering and sorting in dashboard

### ✅ Image Handling
- **Cloudinary Integration** - All images stored in Cloudinary CDN
- Automatic image optimization and transformation
- Cover image support for all content types
- Content block images with captions
- Image preview and metadata management

### ✅ Metadata & Classification
- Nine Blocks categorization (九宮格分類)
- Cake Category (蛋糕圖分類)
- Dynamic keyword management (up to 6 per article)
- Custom slug generation
- Multi-language support (Chinese/English titles)

### ✅ Security & Authentication
- User authentication with bcrypt
- Role-based access control (admin/editor)
- Input validation with Zod schemas
- SQL injection prevention via Prisma
- CSRF protection
- Secure password hashing

## Deployment

### Vercel Deployment

This project is configured for seamless deployment on Vercel:

1. **Push to GitHub**
   ```bash
   git push
   ```

2. **Connect to Vercel**
   - Import your GitHub repository
   - Vercel will auto-detect Next.js configuration

3. **Configure Environment Variables**
   Add these in Vercel dashboard:
   - `DATABASE_URL`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

4. **Deploy**
   - Vercel will automatically run `prisma generate` via `postinstall` script
   - Database migrations are applied automatically

**Note**: The `postinstall` script ensures Prisma client is generated during build.

## Project Structure

```
TIPC_adminSystem/
├── app/
│   ├── api/                    # API routes
│   │   ├── articles/           # Article CRUD operations
│   │   ├── photographs/        # Photograph management
│   │   ├── videos/             # Video management
│   │   ├── books/              # Book catalog
│   │   ├── events/             # Event management
│   │   ├── partners/           # Partner management
│   │   ├── archives/           # Archive management
│   │   ├── auth/login/         # User authentication
│   │   ├── keywords/search/    # Keyword search & autocomplete
│   │   ├── metadata/           # Metadata fetching
│   │   └── upload-image/       # Cloudinary image upload
│   ├── dashboard/              # Admin dashboard
│   │   ├── page.tsx            # Unified content dashboard
│   │   ├── upload/             # Content creation pages
│   │   │   ├── article/
│   │   │   ├── photograph/
│   │   │   ├── video/
│   │   │   ├── book/
│   │   │   ├── event/
│   │   │   ├── partner/
│   │   │   └── archive/
│   │   └── update/             # Content editing pages
│   │       ├── article/[id]
│   │       ├── photograph/[id]
│   │       ├── video/[id]
│   │       ├── book/[id]
│   │       ├── event/[id]
│   │       ├── partner/[id]
│   │       └── archive/[id]
│   └── login/                  # Login page
├── lib/
│   ├── cloudinary.ts           # Cloudinary configuration
│   ├── prisma.ts               # Prisma client with pg adapter
│   └── validation/             # Zod validation schemas
│       ├── article.schema.ts   # Article validation rules
│       ├── reference-integrity.ts # Reference validation
│       └── index.ts            # Validation exports
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── migrations/             # Database migrations
├── scripts/
│   ├── seed-nine-blocks.ts     # Seed 九宮格 categories
│   ├── create-cakecategory.ts  # Seed cake categories
│   └── create-test-user.ts     # Create test admin user
├── types/
│   └── article.ts              # TypeScript type definitions
└── docs/                       # Documentation
    ├── CLOUDINARY_SETUP.md
    ├── DATA_MODEL_RATIONALE.md
    └── IMAGE_METADATA_STORAGE.md
```

## Documentation

- **[Cloudinary Setup](docs/CLOUDINARY_SETUP.md)** - Complete guide for image upload integration
- **[Data Model Rationale](docs/DATA_MODEL_RATIONALE.md)** - Database design decisions
- **[Image Metadata Storage](docs/IMAGE_METADATA_STORAGE.md)** - How images are stored and managed
- **[Validation Usage](VALIDATION_USAGE.md)** - Article validation patterns and examples

## Technology Stack

- **Frontend**: Next.js 16.1.1 (App Router), React 19, TailwindCSS 4
- **Backend**: Next.js API Routes, Prisma ORM 7.2.0
- **Database**: PostgreSQL (Neon) with @prisma/adapter-pg
- **Image Storage**: Cloudinary CDN
- **Validation**: Zod 4.3.5 schema validation
- **Authentication**: bcrypt password hashing
- **TypeScript**: Full type safety throughout

## Database Schema

The system manages multiple content types with shared metadata:

- **Articles** - Main content with blocks, annotations, videos, podcasts
- **Photographs** - Image gallery with metadata
- **Videos** - Video content
- **Books** - Publication catalog
- **Events** - Event listings
- **Partners** - Organization directory
- **Archives** - Document archive
- **KeyWords** - Shared keyword taxonomy
- **NineBlock** - 九宮格 categories
- **CakeCategory** - 蛋糕圖 categories
- **User** - Admin authentication

## Development

### Run Database Migrations
```bash
npx prisma migrate dev --name your_migration_name
```

### Reset Database
```bash
npx prisma migrate reset
```

### Generate Prisma Client
```bash
npx prisma generate
```

### View Database
```bash
npx prisma studio
```

## Scripts

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

The `postinstall` script automatically runs `prisma generate` after dependency installation.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | ✅ |
| `CLOUDINARY_API_KEY` | Cloudinary API key | ✅ |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | ✅ |

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
