/*
  Warnings:

  - You are about to drop the `NineBlocks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "article_nine_blocks" DROP CONSTRAINT "article_nine_blocks_nineBlockId_fkey";

-- DropTable
DROP TABLE "NineBlocks";

-- CreateTable
CREATE TABLE "nine_blocks" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "iconSrc" TEXT NOT NULL,
    "number" INTEGER NOT NULL,

    CONSTRAINT "nine_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "nine_blocks_categoryId_key" ON "nine_blocks"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "nine_blocks_number_key" ON "nine_blocks"("number");

-- AddForeignKey
ALTER TABLE "article_nine_blocks" ADD CONSTRAINT "article_nine_blocks_nineBlockId_fkey" FOREIGN KEY ("nineBlockId") REFERENCES "nine_blocks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
