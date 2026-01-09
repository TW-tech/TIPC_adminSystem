-- CreateEnum
CREATE TYPE "BlockType" AS ENUM ('text', 'image', 'quote');

-- CreateTable
CREATE TABLE "KeyWords" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "KeyWords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NineBlocks" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "NineBlocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article_keywords" (
    "articleId" TEXT NOT NULL,
    "keyWordId" TEXT NOT NULL,

    CONSTRAINT "article_keywords_pkey" PRIMARY KEY ("articleId","keyWordId")
);

-- CreateTable
CREATE TABLE "article_nine_blocks" (
    "articleId" TEXT NOT NULL,
    "nineBlockId" TEXT NOT NULL,

    CONSTRAINT "article_nine_blocks_pkey" PRIMARY KEY ("articleId","nineBlockId")
);

-- CreateTable
CREATE TABLE "articles" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article_blocks" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "type" "BlockType" NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "article_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article_annotations" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "marker" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "url" TEXT,
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "article_annotations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article_videos" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "duration" INTEGER,
    "thumbnailUrl" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "article_videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article_podcasts" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "duration" INTEGER,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "article_podcasts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "articles_slug_key" ON "articles"("slug");

-- CreateIndex
CREATE INDEX "articles_slug_idx" ON "articles"("slug");

-- CreateIndex
CREATE INDEX "articles_publishedAt_idx" ON "articles"("publishedAt");

-- CreateIndex
CREATE INDEX "article_blocks_articleId_position_idx" ON "article_blocks"("articleId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "article_blocks_articleId_position_key" ON "article_blocks"("articleId", "position");

-- CreateIndex
CREATE INDEX "article_annotations_articleId_position_idx" ON "article_annotations"("articleId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "article_annotations_articleId_marker_key" ON "article_annotations"("articleId", "marker");

-- CreateIndex
CREATE UNIQUE INDEX "article_annotations_articleId_position_key" ON "article_annotations"("articleId", "position");

-- AddForeignKey
ALTER TABLE "article_keywords" ADD CONSTRAINT "article_keywords_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_keywords" ADD CONSTRAINT "article_keywords_keyWordId_fkey" FOREIGN KEY ("keyWordId") REFERENCES "KeyWords"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_nine_blocks" ADD CONSTRAINT "article_nine_blocks_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_nine_blocks" ADD CONSTRAINT "article_nine_blocks_nineBlockId_fkey" FOREIGN KEY ("nineBlockId") REFERENCES "NineBlocks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_blocks" ADD CONSTRAINT "article_blocks_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_annotations" ADD CONSTRAINT "article_annotations_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_videos" ADD CONSTRAINT "article_videos_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_podcasts" ADD CONSTRAINT "article_podcasts_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
