BEGIN;

-- Clear existing data and reset identities
-- Note: RESTART IDENTITY CASCADE will reset the identity columns of all referenced tables
TRUNCATE TABLE 
  "game_platform", "challenge_review", "participation_review", "user_role", "participation",
  "challenge", "game", "platform", "level", "category", "role", "user" RESTART IDENTITY CASCADE;

-- Seeding the "user" table
INSERT INTO "user" ("lastname", "firstname", "email", "avatar", "username", "password", "created_at", "updated_at") VALUES
('Dupont', 'Jean', 'jean.dupont@example.com', 'avatar1.png', 'jdupont', 'password123', NOW(), NOW()),
('Martin', 'Marie', 'marie.martin@example.com', 'avatar2.png', 'mmartin', 'password456', NOW(), NOW()),
('Lemoine', 'Paul', 'paul.lemoine@example.com', 'avatar3.png', 'plemoine', 'password789', NOW(), NOW()),
('Berger', 'Sophie', 'sophie.berger@example.com', 'avatar4.png', 'sberger', 'password000', NOW(), NOW());

-- Seeding the "role" table
INSERT INTO "role" ("name", "created_at", "updated_at") VALUES
('admin', NOW(), NOW()),
('user', NOW(), NOW());

-- Seeding the "user_role" table
INSERT INTO "user_role" ("role_id", "user_id", "created_at", "updated_at") VALUES
(1, 1, NOW(), NOW()), -- Jean en admin
(2, 2, NOW(), NOW()), -- Marie en user
(2, 3, NOW(), NOW()), -- Paul en user
(2, 4, NOW(), NOW()); -- Sophie en user

-- Seeding the "platform" table
INSERT INTO "platform" ("name", "brand_color", "created_at", "updated_at") VALUES
('ps5', '#003D8A', NOW(), NOW()),
('pc', '#00A4A9', NOW(), NOW()),
('xbox', '#107C10', NOW(), NOW());

-- Seeding the "category" table
INSERT INTO "category" ("name", "created_at", "updated_at") VALUES
('speedrun', NOW(), NOW()),
('challenges', NOW(), NOW()),
('combat', NOW(), NOW()),
('puzzle', NOW(), NOW()),
('exploration', NOW(), NOW());

-- Seeding the "level" table
INSERT INTO "level" ("name", "level_color", "created_at", "updated_at") VALUES
('beginner', '#00FF00', NOW(), NOW()),
('easy', '#66FF33', NOW(), NOW()),
('medium', '#FFFF00', NOW(), NOW()),
('hard', '#FF6600', NOW(), NOW()),
('very_hard', '#FF0000', NOW(), NOW());

-- Seeding the "game" table
INSERT INTO "game" ("name", "game_image", "genre", "description", "developer", "publisher", "pegi", "release_date", "platform_id", "created_at", "updated_at") VALUES
('The Last of Us', 'lastofus.jpg', 'Action', 'A gripping action-adventure game', 'Naughty Dog', 'Sony', '18', '2023-06-15', 1, NOW(), NOW()),
('Elden Ring', 'eldenring.jpg', 'RPG', 'An open-world RPG with epic battles', 'FromSoftware', 'Bandai Namco', '18', '2022-02-25', 2, NOW(), NOW()),
('Halo Infinite', 'haloinfinite.jpg', 'Action', 'A first-person shooter game', '343 Industries', 'Microsoft', '16', '2021-12-08', 3, NOW(), NOW()),
('Minecraft', 'minecraft.jpg', 'Survival', 'A sandbox game with endless possibilities', 'Mojang', 'Mojang', '7', '2011-11-18', 2, NOW(), NOW()),
('Super Mario Odyssey', 'supermario.jpg', 'Adventure', 'A fun-filled adventure game', 'Nintendo', 'Nintendo', '3', '2017-10-27', 1, NOW(), NOW());

-- Seeding the "challenge" table
INSERT INTO "challenge" ("name", "challenge_image", "description", "rules", "is_open", "user_id", "category_id", "level_id", "game_id", "created_at", "updated_at") VALUES
('Speedrun Last of Us', 'speedrun1.jpg', 'Complete the game in the fastest time possible', 'No cheats, complete the story', true, 1, 1, 5, 1, NOW(), NOW()),
('Elden Ring Hard Mode', 'eldenringchallenge.jpg', 'Complete Elden Ring on hard mode', 'Must be on hard mode, no co-op', true, 2, 2, 4, 2, NOW(), NOW()),
('Halo Infinite Team Battle', 'halobattle.jpg', 'Win a team battle on the hardest map', 'No respawn cheats', false, 3, 3, 4, 3, NOW(), NOW()),
('Survival Minecraft', 'minecraftsurvival.jpg', 'Survive in Minecraft for 30 days', 'No mods, build shelter, gather resources', true, 4, 4, 2, 4, NOW(), NOW()),
('Mario Speedrun', 'mariospeedrun.jpg', 'Complete Super Mario Odyssey in the fastest time', 'No glitches allowed', true, 1, 1, 5, 5, NOW(), NOW()),
('Final Boss Halo', 'finalbosshalo.jpg', 'Defeat the final boss of Halo Infinite on any difficulty', 'No cheats', false, 2, 3, 3, 3, NOW(), NOW()),
('Endgame Elden Ring', 'eldenringfinal.jpg', 'Reach the final area of Elden Ring without dying', 'No respawn', true, 3, 2, 4, 2, NOW(), NOW()),
('Minecraft Redstone Puzzle', 'minecraftredstone.jpg', 'Complete a redstone puzzle in Minecraft', 'Must use only redstone', true, 4, 4, 3, 4, NOW(), NOW()),
('Super Mario Odyssey Completion', 'mariocompletion.jpg', 'Complete all objectives in Mario Odyssey', 'Collect all moons, no cheats', true, 1, 5, 5, 5, NOW(), NOW()),
('Halo Infinite Campaign', 'halo_campaign.jpg', 'Complete the entire Halo Infinite campaign', 'Must finish the game, no skipping', true, 2, 3, 2, 3, NOW(), NOW());

-- Seeding the "participation" table
INSERT INTO "participation" ("video_link", "is_validated", "user_id", "challenge_id", "created_at", "updated_at") VALUES
('https://www.youtube.com/watch?v=1', true, 1, 1, NOW(), NOW()),
('https://www.youtube.com/watch?v=2', true, 2, 2, NOW(), NOW()),
('https://www.youtube.com/watch?v=3', false, 3, 3, NOW(), NOW()),
('https://www.youtube.com/watch?v=4', true, 4, 4, NOW(), NOW()),
('https://www.youtube.com/watch?v=5', true, 1, 5, NOW(), NOW()),
('https://www.youtube.com/watch?v=6', false, 2, 6, NOW(), NOW());

-- Seeding the "participation_review" table
INSERT INTO "participation_review" ("rating", "user_id", "participation_id", "created_at", "updated_at") VALUES
(5, 1, 1, NOW(), NOW()),
(4, 2, 2, NOW(), NOW()),
(5, 3, 4, NOW(), NOW()),
(3, 4, 5, NOW(), NOW());

-- Seeding the "game_platform" table
INSERT INTO "game_platform" ("game_id", "platform_id", "created_at", "updated_at") VALUES
(1, 1, NOW(), NOW()), -- The Last of Us sur PS5
(2, 2, NOW(), NOW()), -- Elden Ring sur PC
(3, 3, NOW(), NOW()), -- Halo Infinite sur Xbox
(4, 2, NOW(), NOW()), -- Minecraft sur PC
(5, 1, NOW(), NOW()); -- Super Mario Odyssey sur PS5

-- Seeding the "challenge_review" table
INSERT INTO "challenge_review" ("rating", "user_id", "challenge_id", "created_at", "updated_at") VALUES
(5, 1, 1, NOW(), NOW()), -- Jean vote 5 pour Speedrun Last of Us
(4, 2, 2, NOW(), NOW()), -- Marie vote 4 pour Elden Ring Hard Mode
(5, 3, 3, NOW(), NOW()), -- Paul vote 5 pour Halo Infinite Team Battle
(3, 4, 4, NOW(), NOW()); -- Sophie vote 3 pour Survival Minecraft

COMMIT;