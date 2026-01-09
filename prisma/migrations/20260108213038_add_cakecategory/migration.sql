-- CreateTable
CREATE TABLE "CakeCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "CakeCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article_cake_categories" (
    "articleId" TEXT NOT NULL,
    "cakeCategoryId" TEXT NOT NULL,

    CONSTRAINT "article_cake_categories_pkey" PRIMARY KEY ("articleId","cakeCategoryId")
);

-- AddForeignKey
ALTER TABLE "article_cake_categories" ADD CONSTRAINT "article_cake_categories_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_cake_categories" ADD CONSTRAINT "article_cake_categories_cakeCategoryId_fkey" FOREIGN KEY ("cakeCategoryId") REFERENCES "CakeCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
