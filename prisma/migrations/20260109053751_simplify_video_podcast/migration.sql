/*
  Warnings:

  - You are about to drop the column `description` on the `article_podcasts` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `article_podcasts` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `article_podcasts` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `article_podcasts` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `article_videos` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `article_videos` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `article_videos` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnailUrl` on the `article_videos` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `article_videos` table. All the data in the column will be lost.
  - You are about to drop the column `coverImageHeight` on the `articles` table. All the data in the column will be lost.
  - You are about to drop the column `coverImagePublicId` on the `articles` table. All the data in the column will be lost.
  - You are about to drop the column `coverImageWidth` on the `articles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "article_podcasts" DROP COLUMN "description",
DROP COLUMN "duration",
DROP COLUMN "position",
DROP COLUMN "title";

-- AlterTable
ALTER TABLE "article_videos" DROP COLUMN "description",
DROP COLUMN "duration",
DROP COLUMN "position",
DROP COLUMN "thumbnailUrl",
DROP COLUMN "title";

-- AlterTable
ALTER TABLE "articles" DROP COLUMN "coverImageHeight",
DROP COLUMN "coverImagePublicId",
DROP COLUMN "coverImageWidth";
