# Mammoth CMS

A modern Content Management System built with Next.js, Prisma, and PostgreSQL.

## Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# Cloudinary (Required for image uploads)
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

**📚 See [docs/CLOUDINARY_SETUP.md](docs/CLOUDINARY_SETUP.md) for detailed Cloudinary setup instructions**

### 3. Setup Database
```bash
npx prisma migrate dev
npx tsx scripts/seed-nine-blocks.ts  # Seed initial data
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Features

### ✅ Article Management
- Rich block-based content editor
- Text, Image, and Quote blocks
- Drag-and-drop block reordering
- Reference annotations with validation
- Multiple videos and podcasts per article

### ✅ Image Handling
- **Cloudinary Integration** - All images stored in Cloudinary CDN
- Automatic image optimization
- Cover image support (required for each article)
- Content block images
- Image preview and management

### ✅ Metadata & Classification
- Nine Blocks categorization (九宮格分類)
- Cake Category (蛋糕圖分類)
- Keywords (up to 6 per article)
- Custom slug generation

### ✅ Security
- User authentication with bcrypt
- Input validation with Zod
- SQL injection prevention
- CSRF protection

## Project Structure

```
mammoth/
├── app/
│   ├── api/              # API routes
│   │   ├── articles/     # Article CRUD
│   │   ├── auth/         # Authentication
│   │   ├── metadata/     # Metadata fetching
│   │   └── upload-image/ # Cloudinary image upload
│   ├── dashboard/        # Admin dashboard
│   └── login/            # Login page
├── lib/
│   ├── cloudinary.ts     # Cloudinary configuration
│   ├── prisma.ts         # Prisma client
│   └── validation/       # Zod schemas
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── migrations/       # Database migrations
├── scripts/
│   └── seed-*.ts         # Database seeding scripts
└── docs/                 # Documentation
```

## Documentation

- **[Cloudinary Setup](docs/CLOUDINARY_SETUP.md)** - Complete guide for image upload integration
- **[Validation Usage](VALIDATION_USAGE.md)** - Article validation patterns

## Technology Stack

- **Frontend**: Next.js 16, React 19, TailwindCSS 4
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Image Storage**: Cloudinary CDN
- **Validation**: Zod
- **Authentication**: bcrypt + custom session

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
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

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
