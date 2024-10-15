-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Comment_id_seq";

-- AlterTable
ALTER TABLE "Review" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Review_id_seq";
