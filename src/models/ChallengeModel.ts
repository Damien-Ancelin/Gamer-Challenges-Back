import { Optional } from 'sequelize';
import { Table, Column, DataType, CreatedAt, UpdatedAt, Model, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';

import { User } from './UserModel';
import { Participation } from './ParticipationModel';
import { ChallengeReview } from './ChallengeReviewModel';
import { Category } from './CategoryModel';
import { Level } from './LevelModel';
import { Game } from './GameModel';

interface ChallengeAttributes {
  id: number;
  name: string;
  challengeImage?: string | null;
  description: string;
  rules: string;
  isOpen: boolean;
  userId: number;
  categoryId: number;
  levelId: number;
  gameId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChallengeCreation
  extends Optional<ChallengeAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

@Table({
  tableName: "challenge",
  modelName: "Challenge",
  timestamps: true,
})

export class Challenge extends Model<ChallengeAttributes, ChallengeCreation> implements ChallengeAttributes {
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
  declare name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare challengeImage: string | null;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare description: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare rules: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare isOpen: boolean;

  @ForeignKey(() => User)
    @Column({
      type: DataType.INTEGER,
      allowNull: false,
    })
    declare userId: number

  @ForeignKey(() => Category)
    @Column({
      type: DataType.INTEGER,
      allowNull: false,
    })
    declare categoryId: number

  @ForeignKey(() => Level)
    @Column({
      type: DataType.INTEGER,
      allowNull: false,
    })
    declare levelId: number

  @ForeignKey(() => Game)
    @Column({
      type: DataType.INTEGER,
      allowNull: false,
    })
    declare gameId: number

  @CreatedAt
    declare createdAt: Date;
  
  @UpdatedAt
    declare updatedAt: Date;

  // Associations
  // 1:N relationship with User
  // this means that a challenge belongs to a user and a user can have many challenges
  @BelongsTo((): typeof User => User)
    declare user?: User;

  // 1:N relationship with Game
  // this means that a challenge belongs to a game and a game can have many challenges
  @HasMany((): typeof Participation => Participation)
    declare participations?: Participation[];

  // 1:N relationship with Participation
  // this means that a challenge can have many participations but a participation belongs to one challenge
  @HasMany((): typeof ChallengeReview => ChallengeReview)
    declare reviews?: ChallengeReview[];
  
  // 1:N relationship with Category
  // this means that a challenge belongs to a category and a category can have many challenges
  @BelongsTo((): typeof Category => Category)
    declare category?: Category;
  
  // 1:N relationship with Level
  // this means that a challenge belongs to a level and a level can have many challenges
  @BelongsTo((): typeof Level => Level)
    declare level?: Level;
  
  // 1:N relationship with Game
  // this means that a challenge belongs to a game and a game can have many challenges
  @BelongsTo((): typeof Game => Game)
    declare game?: Game;
}