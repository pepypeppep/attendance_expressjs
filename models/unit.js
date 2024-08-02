"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Unit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Unit.hasMany(models.Employee, {
        foreignKey: "unitId",
        as: "Employees",
      });
    }
  }
  Unit.init(
    {
      name: DataTypes.STRING,
      latitude: DataTypes.STRING,
      logitude: DataTypes.STRING,
      radius: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Unit",
      paranoid: true,
    }
  );
  return Unit;
};
