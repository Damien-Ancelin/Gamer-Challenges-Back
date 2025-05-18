import { Optional } from 'sequelize';
import { Table, Column, DataType, CreatedAt, UpdatedAt, ForeignKey, Model, BelongsTo } from 'sequelize-typescript';

import { User } from './UserModel';
import { Participation } from './ParticipationModel';

interface ParticipationReviewAttributes {
  id: number;
  rating: number;
  userId: number;
  ParticipationId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ParticipationReviewCreation
  extends Optional<ParticipationReviewAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

@Table({
  tableName: "participation_review",
  modelName: "ParticipationReview",
  timestamps: true,
})

export class ParticipationReview extends Model<ParticipationReviewAttributes, ParticipationReviewCreation> implements ParticipationReviewAttributes {
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
  
  @ForeignKey(() => Participation)
    @Column({
      type: DataType.INTEGER,
      allowNull: false,
    })
    declare ParticipationId: number

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

  // Associations
  @BelongsTo(() => User)
  declare user?: User;
  
  @BelongsTo(() => Participation)
  declare participation?: Participation;
}