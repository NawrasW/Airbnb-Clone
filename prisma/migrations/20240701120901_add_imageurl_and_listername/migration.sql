-- Create a new table with the desired schema
CREATE TABLE "new_Listing" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "price" REAL NOT NULL,
  "imageUrl" TEXT NOT NULL DEFAULT 'default_image_url',
  "listerName" TEXT NOT NULL DEFAULT 'default_lister_name'
);

-- Copy data from the old table to the new table
INSERT INTO "new_Listing" ("id", "title", "description", "price")
SELECT "id", "title", "description", "price"
FROM "Listing";

-- Drop the old table
DROP TABLE "Listing";

-- Rename the new table to the original table name
ALTER TABLE "new_Listing" RENAME TO "Listing";

-- (Optional) Remove the default values if you don't want them permanently
-- SQLite does not support ALTER COLUMN to drop defaults, so this step is skipped
