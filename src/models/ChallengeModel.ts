import { Optional } from 'sequelize';
import { Table, Column, DataType, CreatedAt, UpdatedAt, Model, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';

import { User } from './UserModel';
import { Participation } from './ParticipationModel';
import { ChallengeReview } from './ChallengeReviewModel';
import { Category } from './CategoryModel';

interface ChallengeAttributes {
  id: number;
  name: string;
  challenge_image?: string | null;
  description: string;
  rules: string;
  isOpen: boolean;
  userId: number;
  categoryId: number;
  //!levelId: number;
  //!gameId: number;
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
  declare challenge_image: string | null;

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

  // ! FK level
  // ! FK game

  @CreatedAt
    declare createdAt: Date;
  
  @UpdatedAt
    declare updatedAt: Date;

  // Associations
  @BelongsTo((): typeof User => User)
    declare user?: User;

  @HasMany((): typeof Participation => Participation)
    declare participations?: Participation[];

  @HasMany((): typeof ChallengeReview => ChallengeReview)
    declare reviews?: ChallengeReview[];
  
  @BelongsTo((): typeof Category => Category)
    declare category?: Category;

  // !Level
  // !Game
}