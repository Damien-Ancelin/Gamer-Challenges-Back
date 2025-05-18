import "dotenv/config";
import debug from "debug";
import { fakerFR as faker } from "@faker-js/faker";
import * as argon2 from "argon2";

import sequelize from "../configs/sequelize";
import { Role } from "models/RoleModel";
import { User } from "models/UserModel";
import { UserRole } from "models/UserRoleModel";

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
    sequelizeDebug("✅ All models were dropped successfully.");
    
    // * Init Data

    // 1. Create Roles
    const roles = await Role.bulkCreate([{ name: "user" }, { name: "admin" }]);
    sequelizeDebug("✅ Roles created successfully.");

    // 2. Create Users
    const users = [];
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
    sequelizeDebug("users", users);
    const createdUsers = await User.bulkCreate(users);
    sequelizeDebug("✅ Users created successfully.");


    // 3. Associate Users with Roles
    const userRoles = createdUsers.map((user) => ({
      userId: user.id,
      roleId: roles[0].id, // Assign 'user' role to all users
    }));
    await UserRole.bulkCreate(userRoles);
    sequelizeDebug("✅ User roles created successfully.");

    sequelizeDebug("✅ Seeding completed successfully.");
  } catch (error) {
    sequelizeDebug("❌ Error seeding database:", (error as Error).message);
  } finally {
    await sequelize.close();
  }
})();
