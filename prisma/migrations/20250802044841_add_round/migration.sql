-- CreateTable
CREATE TABLE "Round" (
    "id" SERIAL NOT NULL,
    "isStarted" BOOLEAN NOT NULL DEFAULT false,
    "mustOpen" INTEGER NOT NULL DEFAULT 3,
    "players" TEXT,
    "activePlayer" INTEGER,
    "activePlayerOpened" INTEGER NOT NULL,

    CONSTRAINT "Round_pkey" PRIMARY KEY ("id")
);
