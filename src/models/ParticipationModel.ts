import { Optional } from 'sequelize';
import { Table, Column, DataType, CreatedAt, UpdatedAt, ForeignKey, Model, BelongsTo, HasMany } from 'sequelize-typescript';

import { User } from "./UserModel";
import { Challenge } from './ChallengeModel';
import { ParticipationReview } from './ParticipationReviewModel';

interface ParticipationAttributes {
  id: number;
  videoLink?: string | null;
  isValidated: boolean;
  userId: number;
  challengeId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ParticipationCreation
  extends Optional<ParticipationAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

@Table({
  tableName: "participation",
  modelName: "Participation",
  timestamps: true,
})

export class Participation extends Model<ParticipationAttributes, ParticipationCreation> implements ParticipationAttributes {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare videoLink: string | null;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare isValidated: boolean;

  @ForeignKey(() => User)
    @Column({
      type: DataType.INTEGER,
      allowNull: false,
    })
    declare userId: number

  @ForeignKey(() => Challenge)
    @Column({
      type: DataType.INTEGER,
      allowNull: false,
    })
    declare challengeId: number

  @CreatedAt
    declare createdAt: Date;
  
  @UpdatedAt
    declare updatedAt: Date;

  // Associations
  // 1:N relationship with User
  // This means that a user can have many participations but a participation belongs to one user
  @BelongsTo((): typeof User => User)
  declare user?: User;
  
  // 1:N relationship with Challenge
  // This means that a challenge can have many participations but a participation belongs to one challenge
  @BelongsTo((): typeof Challenge => Challenge)
  declare challenge?: Challenge;
  
  // 1:N relationship with ParticipationReview
  // This means that a participation can have many reviews but a review belongs to one participation
  @HasMany((): typeof ParticipationReview => ParticipationReview)
  declare reviews?: ParticipationReview[];
}