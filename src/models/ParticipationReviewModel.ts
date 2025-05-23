import { Optional } from 'sequelize';
import { Table, Column, DataType, CreatedAt, UpdatedAt, ForeignKey, Model, BelongsTo } from 'sequelize-typescript';

import { User } from './UserModel';
import { Participation } from './ParticipationModel';

interface ParticipationReviewAttributes {
  id: number;
  rating: number;
  userId: number;
  participationId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ParticipationReviewCreation
  extends Optional<ParticipationReviewAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

  @Table({
    tableName: "participation_review",
    modelName: "ParticipationReview",
    timestamps: true,
    indexes: [
      {
        name: 'idx_app_user_participation',
        unique: true,
        fields: ['user_id', 'participation_id'], // Contrainte unique sur user_id (lié à de app_user en bdd) et participation_id
      },
    ],
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
    declare participationId: number

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

  // Associations
  // 1:N relationship with User
  // This means that a participation review belongs to a user
  @BelongsTo(() => User)
  declare user?: User;
  
  // 1:N relationship with Participation
  // This means that a participation review belongs to a participation
  @BelongsTo(() => Participation)
  declare participation?: Participation;
}