-- CreateTable
CREATE TABLE "Player" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "sex" TEXT,
    "age" TEXT,
    "height" TEXT,
    "profession" TEXT,
    "health" TEXT,
    "hobby" TEXT,
    "phobia" TEXT,
    "character" TEXT,
    "inventory" TEXT,
    "extra" TEXT,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Data" (
    "id" SERIAL NOT NULL,
    "place" TEXT,
    "size" TEXT,
    "time" TEXT,
    "food" TEXT,
    "rooms" TEXT,
    "problem" TEXT,

    CONSTRAINT "Data_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_name_key" ON "Player"("name");
