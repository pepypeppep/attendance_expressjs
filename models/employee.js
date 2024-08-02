"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Employee.belongsTo(models.Unit, {
        foreignKey: "unitId",
        as: "Unit",
      });
      Employee.hasMany(models.Presence, {
        foreignKey: "employeeId",
        as: "Presences",
      });
    }
  }
  Employee.init(
    {
      nik: DataTypes.STRING,
      name: DataTypes.STRING,
      unitId: DataTypes.INTEGER,
      isActive: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Employee",
      paranoid: true,
    }
  );
  return Employee;
};
