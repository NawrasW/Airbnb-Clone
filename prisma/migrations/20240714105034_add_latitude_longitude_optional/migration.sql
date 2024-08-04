-- AlterTable
ALTER TABLE "Listing" ADD COLUMN "latitude" REAL;
ALTER TABLE "Listing" ADD COLUMN "longitude" REAL;

-- AlterTable
ALTER TABLE "Review" ADD COLUMN "listerName" TEXT;
