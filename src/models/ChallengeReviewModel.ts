import { Optional } from 'sequelize';
import { Table, Column, DataType, CreatedAt, UpdatedAt, ForeignKey, Model, BelongsTo } from 'sequelize-typescript';

import { User } from './UserModel';
import { Challenge } from './ChallengeModel';

interface ChallengeReviewAttributes {
  id: number;
  rating: number;
  userId: number;
  challengeId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChallengeReviewCreation
  extends Optional<ChallengeReviewAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export interface ChallengeReviewUpdate
  extends Optional<ChallengeReviewAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

@Table({
  tableName: "challenge_review",
  modelName: "ChallengeReview",
  timestamps: true,
  // indexes: [
  //   {
  //     unique: true,
  //     fields: ['userId', 'challengeId'], // Contrainte unique sur userId et ChallengeId
  //   },
  // ],
})

export class ChallengeReview extends Model<ChallengeReviewAttributes, ChallengeReviewCreation> implements ChallengeReviewAttributes {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
  },
  })
  declare rating: number;

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

  // * Associations
  // 1:N relationship with User
  // This means that a user can have many reviews but a review belongs to one user
  @BelongsTo(() => User)
  declare user?: User;
  
  // 1:N relationship with Challenge
  // This means that a challenge can have many reviews but a review belongs to one challenge
  @BelongsTo(() => Challenge)
  declare challenge?: Challenge;
}