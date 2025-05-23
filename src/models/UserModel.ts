import { Optional } from 'sequelize';
import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsToMany, HasMany, AfterCreate } from 'sequelize-typescript';

import { Role } from './RoleModel';
import { UserRole } from './UserRoleModel';
import { Participation } from './ParticipationModel';
import { Challenge } from './ChallengeModel';
import { ChallengeReview } from './ChallengeReviewModel';
import { ParticipationReview } from './ParticipationReviewModel';

import { tokenService } from 'services/tokenService';
import { v4 as uuidv4 } from 'uuid';
import { redisService } from 'services/redisService';

interface UserAttributes {
  id: number;
  lastname: string;
  firstname: string;
  email: string;
  avatar?: string | null;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCreationAttributes
  extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

@Table({
  tableName: "app_user",
  modelName: "User",
  timestamps: true,
})

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes{
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare lastname: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare firstname: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare avatar: string | null;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    unique: true,
  })
  declare username: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare password: string;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

  // * Associations
  // N:N relationship with Role through UserRole
  // This means that a user can have multiple roles and a role can belong to multiple users
  @BelongsToMany(() => Role, () => UserRole)
  declare roles?: Role[];

  // 1:N relationship with Participation
  // This means that a user can have multiple participations in challenges
  @HasMany((): typeof Participation => Participation)
  declare participations?: Participation[];

  // 1:N relationship with Challenge
  // This is the challenge created by the user
  @HasMany((): typeof Challenge => Challenge)
  declare challenges?: Challenge[];

  // 1:N relationship with ParticipationReview
  // This means that a user can review multiple participations
  @HasMany((): typeof ParticipationReview => ParticipationReview)
  declare participationReviews?: ParticipationReview[];

  // 1:N relationship with ChallengeReview
  // This means that a user can review multiple challenges
  @HasMany((): typeof ChallengeReview => ChallengeReview)
  declare challengeReviews?: ChallengeReview[];
  
  // Hook to create a default UserRole after a User is created
  @AfterCreate
  static async assignDefaultRole(user: User) {
    await UserRole.create({
      userId: user.id,
      roleId: 1, // Default role ID for "user"
    });
  }

  // instance methods
  async generateAccessToken(): Promise<string> {
    const payload = {
      id: this.id,
      role: this.roles ? this.roles[0].name : 'user',
      username: this.username,
      jti: uuidv4(),
    };
    const whitelistSuccess = await redisService.setAccessWhitelist(this.id, payload.jti, 60 * 10);

    if (!whitelistSuccess) {
      throw new Error("❌ Failed to store token in Redis whitelist");
    }

    return tokenService.generateAccessToken(payload);
  }

  async generateRefreshToken(): Promise<string> {
    const payload = {
      id: this.id,
      jti: uuidv4(),
    };
    const whitelistSuccess = await redisService.setRefreshWhitelist(this.id, payload.jti, 60 * 60 * 24 * 7);
    if (!whitelistSuccess) {
      throw new Error("❌ Failed to store token in Redis whitelist");
    }
    return tokenService.generateRefreshToken(payload);
  }
}