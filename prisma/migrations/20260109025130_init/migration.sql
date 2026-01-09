/*
  Warnings:

  - You are about to drop the `nine_blocks` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `coverImage` to the `articles` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "article_nine_blocks" DROP CONSTRAINT "article_nine_blocks_nineBlockId_fkey";

-- AlterTable
ALTER TABLE "articles" ADD COLUMN     "coverImage" TEXT NOT NULL;

-- DropTable
DROP TABLE "nine_blocks";

-- CreateTable
CREATE TABLE "NineBlocks" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "NineBlocks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "article_nine_blocks" ADD CONSTRAINT "article_nine_blocks_nineBlockId_fkey" FOREIGN KEY ("nineBlockId") REFERENCES "NineBlocks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
