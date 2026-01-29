CREATE TABLE "link"(
    "id" SERIAL PRIMARY KEY, 
    "originalUrl" TEXT NOT NULL, 
    "shortCode" TEXT NOT NULL, 
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT  ,

    CONSTRAINT fk_user
    FOREIGN KEY("userId")
    REFERENCES "user"("id")
    ON DELETE CASCADE,
    UNIQUE("shortCode")
); 

CREATE INDEX idx_link_user_id ON "link"("userId"); 
CREATE INDEX idx_link_short_code ON "link"("shortCode"); 
