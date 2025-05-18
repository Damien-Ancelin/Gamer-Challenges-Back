import { Optional } from 'sequelize';
import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsToMany, HasMany } from 'sequelize-typescript';
import { Role } from './RoleModel';
import { UserRole } from './UserRoleModel';
import { Participation } from './ParticipationModel';
import { Challenge } from './ChallengeModel';
import { ChallengeReview } from './ChallengeReviewModel';
import { ParticipationReview } from './ParticipationReview';

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

  // Associations
  @BelongsToMany(() => Role, () => UserRole)
  declare roles?: Role[];

  @HasMany((): typeof Participation => Participation)
  declare participations?: Participation[];

  @HasMany((): typeof Challenge => Challenge)
  declare challenges?: Challenge[];

  @HasMany((): typeof ParticipationReview => ParticipationReview)
  declare participationReviews?: ParticipationReview[];

  @HasMany((): typeof ChallengeReview => ChallengeReview)
  declare challengeReviews?: ChallengeReview[];
}