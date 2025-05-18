import 'dotenv/config';
import debug from "debug";

import sequelize from "../configs/sequelize";
import { Role } from 'models/RoleModel';
import { User } from 'models/UserModel';
import { UserRole } from 'models/UserRoleModel';

const sequelizeDebug = debug('migration:sequelize');

sequelizeDebug("🔄 Seeding database...");

try {
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

  sequelizeDebug("✅ Seeding completed successfully.");
} catch (error) {
    sequelizeDebug("❌ Error seeding database:", (error as Error).message);
} finally {
    await sequelize.close();
  }