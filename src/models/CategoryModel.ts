import { Optional } from "sequelize";
import { Column, Table, DataType, Model, CreatedAt, UpdatedAt, HasMany } from "sequelize-typescript";

import { Challenge } from "./ChallengeModel";

interface CategoryAttributes {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryCreation
  extends Optional<CategoryAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

@Table({
  tableName: 'category',
  modelName: 'Category',
  timestamps: true,
})

export class Category extends Model<CategoryAttributes, CategoryCreation> implements CategoryAttributes {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    unique: true,
  })
  declare name: string;

  @CreatedAt
    declare createdAt: Date;
  
  @UpdatedAt
    declare updatedAt: Date;
  
  // Associations
  // 1:N relationship with Challenge
  // This means that a category can have many challenges but a challenge can only belong to one category
  @HasMany((): typeof Challenge => Challenge)
  declare challenges: Challenge[];
}