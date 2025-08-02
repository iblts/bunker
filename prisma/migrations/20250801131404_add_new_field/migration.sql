-- DropIndex
DROP INDEX "Player_name_key";

-- AlterTable
ALTER TABLE "Data" ADD COLUMN     "extra" TEXT;

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "opened" TEXT,
ALTER COLUMN "name" DROP NOT NULL;
