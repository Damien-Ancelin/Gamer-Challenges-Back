import "dotenv/config";
import debug from "debug";
import { fakerFR as faker } from "@faker-js/faker";
import * as argon2 from "argon2";

import sequelize from "../configs/sequelize";

import { Role } from "models/RoleModel";
import { User } from "models/UserModel";
import { UserRole } from "models/UserRoleModel";
import { Level } from "models/LevelModel";
import { Category } from "models/CategoryModel";
import { Participation } from "models/ParticipationModel";
import { Game } from "models/GameModel";
import { Platform } from "models/PlatformModel";
import { GamePlatform } from "models/GamePlatformModel";
import { Challenge } from "models/ChallengeModel";
import { ChallengeReview } from "models/ChallengeReviewModel";
import { ParticipationReview } from "models/ParticipationReviewModel";

const sequelizeDebug = debug("migration:sequelize");

(async () => {
  sequelizeDebug("🔄 Seeding database...");

  try {
    // * Drop Data
    await User.destroy({
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });

    await Role.destroy({
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });

    await UserRole.destroy({
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });

    await Level.destroy({
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });

    await Category.destroy({
      truncate: true,
      restartIdentity: true,
      cascade: true,
    })

    await Game.destroy({
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });

    await Platform.destroy({
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });

    await GamePlatform.destroy({
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });

    await Challenge.destroy({
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });

    await Participation.destroy({
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });

    await ChallengeReview.destroy({
      truncate: true,
      restartIdentity: true,
      cascade: true,
    })

    await ParticipationReview.destroy({
      truncate: true,
      restartIdentity: true,
      cascade: true,
    })

    sequelizeDebug("✅ All models were dropped successfully.");
    
    // * Init Data

    // 1. Create Roles
    const roles = await Role.bulkCreate([{ name: "user" }, { name: "admin" }]);
    sequelizeDebug("✅ Roles created successfully.");

    // 2. Create Users
    const users = [];
    users.push({
      lastname: "Anc",
      firstname: "Dam",
      email: "test@mail.io",
      username: "AncDam",
      password: await argon2.hash("test1234"),
    });

    for (let i = 0; i < 10; i++) {
      users.push({
        lastname: faker.person.lastName(),
        firstname: faker.person.firstName(),
        email: faker.internet.email(),
        avatar: faker.image.avatar(),
        username: faker.internet.displayName(),
        password: await argon2.hash("test1234"),
      });
    }

    const createdUsers = await User.bulkCreate(users);

    sequelizeDebug("✅ Users created successfully.");


    // 3. Associate Users with Roles
    const userRoles = createdUsers.map((user) => ({
      userId: user.id,
      roleId: roles[0].id, // Assign 'user' role to all users
    }));
    await UserRole.bulkCreate(userRoles);
    sequelizeDebug("✅ User roles created successfully.");

    // 4. Create Levels
    const levels = await Level.bulkCreate([
      { name: "Beginner", levelColor: "#00FF00" },
      { name: "Intermediate", levelColor: "#FFFF00" },
      { name: "Advanced", levelColor: "#FFA500" },
      { name: "Expert", levelColor: "#FF0000" },
      { name: "Master", levelColor: "#800080" },
    ]);

    // 5. Create Categories
    const categories = await Category.bulkCreate([
      { name: "Speedrun" },
      { name: "No Hit" },
      { name: "100%" },
      { name: "Low%"},
      { name: "Pacifist" },
      { name: "Glitchless" },
      { name: "Randomizer" },
      { name: "Ironman" },
      { name: "Permadeath" },
      { name: "One Life" },
      { name: "Time Attack" },
      { name: "Score Attack" },
      { name: "Challenge Custom" },
    ]);

    // 6. Create Games
    const games = await Game.bulkCreate([
      { 
        name: "The Legend of Zelda: Ocarina of Time",
        gameImage: faker.image.url(),
        genre: "Action-adventure",
        description: "An action-adventure game where players control Link, a young hero tasked with stopping the evil king Ganondorf.",
        developer: "Nintendo",
        publisher: "Nintendo",
        pegi: "7",
        releaseDate: new Date("1998-11-21")
      },
      { 
        name: "Super Mario 64",
        gameImage: faker.image.url(),
        genre: "Platformer",
        description: "A 3D platformer where players control Mario as he navigates through various worlds to rescue Princess Peach.",
        developer: "Nintendo",
        publisher: "Nintendo",
        pegi: "3",
        releaseDate: new Date("1996-06-23")
      },
      { 
        name: "Dark Souls",
        gameImage: faker.image.url(),
        genre: "Action RPG",
        description: "An action RPG known for its challenging gameplay and intricate world design, where players explore the kingdom of Lordran.",
        developer: "FromSoftware",
        publisher: "Bandai Namco Entertainment",
        pegi: "16",
        releaseDate: new Date("2011-09-22")
      },
      {
        name: "The Witcher 3: Wild Hunt",
        gameImage: faker.image.url(),
        genre: "Action RPG",
        description: "An open-world RPG where players control Geralt of Rivia, a monster hunter searching for his adopted daughter.",
        developer: "CD Projekt Red",
        publisher: "CD Projekt",
        pegi: "18",
        releaseDate: new Date("2015-05-19")
      },
      {
        name: "Minecraft",
        gameImage: faker.image.url(),
        genre: "Sandbox",
        description: "A sandbox game that allows players to build and explore virtual worlds made up of blocks.",
        developer: "Mojang Studios",
        publisher: "Mojang Studios",
        pegi: "7",
        releaseDate: new Date("2011-11-18")
      }, 
      {
        name: "Overwatch",
        gameImage: faker.image.url(),
        genre: "First-person shooter",
        description: "A team-based multiplayer first-person shooter where players choose from a roster of heroes with unique abilities.",
        developer: "Blizzard Entertainment",
        publisher: "Blizzard Entertainment",
        pegi: "12",
        releaseDate: new Date("2016-05-24")
      },
      {
        name: "The Legend of Zelda: Breath of the Wild",
        gameImage: faker.image.url(),
        genre: "Action-adventure",
        description: "An open-world action-adventure game where players control Link as he awakens from a long slumber to defeat Calamity Ganon.",
        developer: "Nintendo",
        publisher: "Nintendo",
        pegi: "12",
        releaseDate: new Date("2017-03-03")
      },
      {
        name: "Final Fantasy VII Remake",
        gameImage: faker.image.url(),
        genre: "Action RPG",
        description: "A remake of the classic JRPG that follows Cloud Strife and his allies as they fight against the Shinra Corporation.",
        developer: "Square Enix",
        publisher: "Square Enix",
        pegi: "16",
        releaseDate: new Date("2020-04-10")
      },
    ])

    // 7. Create Platforms
    const platforms = await Platform.bulkCreate([
      { name: "PC", brandColor: "#00FF00" },
      { name: "PlayStation 5", brandColor: "#0000FF" },
      { name: "Xbox Series X", brandColor: "#FF0000" },
      { name: "Nintendo Switch", brandColor: "#FFFF00" },
      { name: "PlayStation 4", brandColor: "#FF00FF" },
      { name: "Xbox One", brandColor: "#00FFFF" },
      { name: "Nintendo 3DS", brandColor: "#FFA500" },
      { name: "Nintendo Wii U", brandColor: "#800080" },
      { name: "Nintendo Wii", brandColor: "#008000" },
      { name: "Nintendo DS", brandColor: "#FFC0CB" },
      { name: "Nintendo GameCube", brandColor: "#A52A2A" },
      { name: "Nintendo 64", brandColor: "#808080" },
    ]);

    // 8. Create GamePlatforms
    const gamePlatforms = [];
    for (const game of games) {
      const randomPlatforms = platforms.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * platforms.length));
      for (const platform of randomPlatforms) {
        gamePlatforms.push({
          gameId: game.id,
          platformId: platform.id,
        });
      }
    }
    await GamePlatform.bulkCreate(gamePlatforms);
    sequelizeDebug("✅ Game platforms created successfully.");

    // 9. Create Challenges
    const challenges = [];
    for (let i = 0; i < 10; i++) {
      const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const randomLevel = levels[Math.floor(Math.random() * levels.length)];
      const randomGame = games[Math.floor(Math.random() * games.length)];
      challenges.push({
        name: randomGame.name + " " + randomCategory.name,
        challengeImage: faker.image.url(),
        description: faker.lorem.paragraph(),
        rules: faker.lorem.paragraph(),
        isOpen: Math.random() < 0.5,
        userId: randomUser.id,
        categoryId: randomCategory.id,
        levelId: randomLevel.id,
        gameId: randomGame.id,
      });
    }
    const createdChallenges = await Challenge.bulkCreate(challenges);
    sequelizeDebug("✅ Challenges created successfully.");

    // 10. Create Participations
    const participations = [];
    for (let i = 0; i < 10; i++) {
      const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const randomChallenge = createdChallenges[Math.floor(Math.random() * createdChallenges.length)];
      participations.push({
        videoLink: faker.internet.url(),
        isValidated: Math.random() < 0.5,
        userId: randomUser.id,
        challengeId: randomChallenge.id,
     });
    }
    const createdParticipations = await Participation.bulkCreate(participations);
    
    // 11. Create Challenge Reviews
    const challengeReviews = [];
    for (let i = 0; i < 10; i++) {
      const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const randomChallenge = createdChallenges[Math.floor(Math.random() * createdChallenges.length)];
      challengeReviews.push({
        content: faker.lorem.paragraph(),
        rating: Math.floor(Math.random() * 5) + 1,
        userId: randomUser.id,
        challengeId: randomChallenge.id,
      });
    }
    await ChallengeReview.bulkCreate(challengeReviews);

    // 12. Create Participation Reviews
    const participationReviews = [];
    for (let i = 0; i < 10; i++) {
      const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const randomParticipation = createdParticipations[Math.floor(Math.random() * createdParticipations.length)];
      participationReviews.push({
        content: faker.lorem.paragraph(),
        rating: Math.floor(Math.random() * 5) + 1,
        userId: randomUser.id,
        participationId: randomParticipation.id,
      });
    }
    await ParticipationReview.bulkCreate(participationReviews);

    sequelizeDebug("✅ Seeding completed successfully.");
  } catch (error) {
    sequelizeDebug("❌ Error seeding database:", (error as Error).message);
  } finally {
    await sequelize.close();
  }
})();
