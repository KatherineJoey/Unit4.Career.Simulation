-- AlterTable
CREATE SEQUENCE comment_id_seq;
ALTER TABLE "Comment" ALTER COLUMN "id" SET DEFAULT nextval('comment_id_seq');
ALTER SEQUENCE comment_id_seq OWNED BY "Comment"."id";

-- AlterTable
CREATE SEQUENCE item_id_seq;
ALTER TABLE "Item" ALTER COLUMN "id" SET DEFAULT nextval('item_id_seq');
ALTER SEQUENCE item_id_seq OWNED BY "Item"."id";

-- AlterTable
CREATE SEQUENCE review_id_seq;
ALTER TABLE "Review" ALTER COLUMN "id" SET DEFAULT nextval('review_id_seq');
ALTER SEQUENCE review_id_seq OWNED BY "Review"."id";

-- AlterTable
CREATE SEQUENCE user_id_seq;
ALTER TABLE "User" ALTER COLUMN "id" SET DEFAULT nextval('user_id_seq');
ALTER SEQUENCE user_id_seq OWNED BY "User"."id";
