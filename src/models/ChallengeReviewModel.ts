import { Optional } from 'sequelize';
import { Table, Column, DataType, CreatedAt, UpdatedAt, ForeignKey, Model, BelongsTo } from 'sequelize-typescript';

import { User } from './UserModel';
import { Challenge } from './ChallengeModel';

interface ChallengeReviewAttributes {
  id: number;
  rating: number;
  userId: number;
  ChallengeId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChallengeReviewCreation
  extends Optional<ChallengeReviewAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

@Table({
  tableName: "challenge_review",
  modelName: "ChallengeReview",
  timestamps: true,
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
    declare ChallengeId: number

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

  // Associations
  @BelongsTo(() => User)
  declare user?: User;

  @BelongsTo(() => Challenge)
  declare challenge?: Challenge;
}