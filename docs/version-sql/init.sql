-- Start transaction
BEGIN;

DROP VIEW IF EXISTS "challenge_with_rating", "participation_with_rating";
DROP TABLE IF EXISTS "user_role", "participation_review", "challenge_review", "game_platform", "participation", "role", "challenge", "level", "category", "game", "platform", "user";
DROP DOMAIN IF EXISTS "email_type", "positive_int", "hex_color_type";

-- DOMAIN
CREATE DOMAIN "email_type" AS text
CHECK(
    value ~ '(?:[a-z0-9!#$%&''*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&''*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])'
);
CREATE DOMAIN "positive_int" AS NUMERIC CHECK (VALUE > 0);
CREATE DOMAIN "hex_color_type" AS VARCHAR(7) CHECK (VALUE ~ '^#[A-F0-9]{6}$');

-- PART 1 - Main Table
CREATE TABLE "role" (
    "id" INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ 
);

CREATE TABLE "user" (
    "id" INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "lastname" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "email" email_type NOT NULL UNIQUE,
    "avatar" TEXT,
    "username" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ 
);

CREATE TABLE "category" (
    "id" INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ 
);

CREATE TABLE "level" (
    "id" INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "level_color" hex_color_type NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ 
);

CREATE TABLE "platform" (
    "id" INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "brand_color" hex_color_type NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ 
);

CREATE TABLE "game" (
    "id" INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "game_image" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "developer" TEXT NOT NULL,
    "publisher" TEXT NOT NULL,
    "pegi" TEXT NOT NULL,
    "release_date" DATE NOT NULL,
    "platform_id" INT NOT NULL REFERENCES "platform" ("id"),
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ 
);

CREATE TABLE "challenge" (
    "id" INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" TEXT NOT NULL,
    "challenge_image" TEXT,
    "description" TEXT NOT NULL,
    "rules" TEXT NOT NULL,
    "is_open" BOOLEAN NOT NULL DEFAULT FALSE,
    "user_id" INT NOT NULL REFERENCES "user" ("id"),
    "category_id" INT NOT NULL REFERENCES "category" ("id"),
    "level_id" INT NOT NULL REFERENCES "level" ("id"),
    "game_id" INT NOT NULL REFERENCES "game" ("id"),
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ 
);

CREATE TABLE "participation" ( 
    "id" INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "video_link" TEXT,
    "is_validated" BOOLEAN NOT NULL DEFAULT FALSE,
    "user_id" INT NOT NULL REFERENCES "user" ("id"),
    "challenge_id" INT NOT NULL REFERENCES "challenge" ("id"),
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ 
);

-- PART 2 - Association Table
CREATE TABLE "user_role" (
    "id" INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "role_id" INT NOT NULL REFERENCES "role" ("id") ON DELETE CASCADE,
    "user_id" INT NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ,
    CONSTRAINT "unique_user_role" UNIQUE ("role_id", "user_id")
);

CREATE TABLE "participation_review" (
    "id" INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "rating" positive_int NOT NULL,
    "user_id" INT NOT NULL REFERENCES "user" ("id"),
    "participation_id" INT NOT NULL REFERENCES "participation" ("id"),
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ,
    CONSTRAINT "unique_user_vote_participation" UNIQUE ("user_id", "participation_id")
);

CREATE TABLE "challenge_review" (
    "id" INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "rating" positive_int NOT NULL,
    "user_id" INT NOT NULL REFERENCES "user" ("id"),
    "challenge_id" INT NOT NULL REFERENCES "challenge" ("id"),
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ,
    CONSTRAINT "unique_user_vote_challenge" UNIQUE ("user_id", "challenge_id")
);

CREATE TABLE "game_platform" (
    "id" INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "game_id" INT NOT NULL REFERENCES "game" ("id"),
    "platform_id" INT NOT NULL REFERENCES "platform" ("id"),
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ,  
    CONSTRAINT "unique_game_platform" UNIQUE ("game_id", "platform_id")
);

-- Average rating challenge VIEW
CREATE VIEW "challenge_with_rating" AS
SELECT 
    "challenge".*,
    COUNT("challenge_review"."rating") AS "rating_count",
    -- COALESCE -> retourne la première valeur non NULL dans la liste
    -- COALESCE(..., 0) -> Si aucune note n'est disponible, retourne 0 pour éviter les valeurs NULL
    -- ROUND -> Arrondit le résultat au nombre entier le plus proche
    -- AVG("challenge_review"."rating") -> Calcule la moyenne des notes
    -- ...::NUMERIC -> Convertit la moyenne en type NUMERIC pour des calculs précis
    -- (... / 10) * 100 -> Transforme la moyenne en pourcentage
    COALESCE(ROUND((AVG("challenge_review"."rating")::NUMERIC / 10) * 100), 0) AS "avg_rating_percentage"
FROM 
    "challenge"
LEFT JOIN 
    "challenge_review"
ON 
    "challenge"."id" = "challenge_review"."challenge_id"
GROUP BY 
    "challenge"."id", "challenge"."name";

-- Average rating participation VIEW
CREATE VIEW "participation_with_rating" AS
SELECT 
    "participation".*,
    COUNT("participation_review"."rating") AS "rating_count",
    COALESCE(ROUND((AVG("participation_review"."rating")::NUMERIC / 10) * 100), 0) AS "avg_rating_percentage"
FROM 
    "participation"
LEFT JOIN 
    "participation_review"
ON 
    "participation"."id" = "participation_review"."participation_id"
GROUP BY 
    "participation"."id", "participation"."user_id";

-- End of transaction
COMMIT;