-- CreateTable
CREATE TABLE "colors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hex_code" TEXT NOT NULL,

    CONSTRAINT "colors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "colors_name_key" ON "colors"("name");
