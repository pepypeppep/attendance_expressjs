"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Presence extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Presence.belongsTo(models.Employee, {
        foreignKey: "employeeId",
        as: "Employee",
      });
      Presence.belongsTo(models.PresenceType, {
        foreignKey: "presenceTypeId",
        as: "PresenceType",
      });
    }
  }
  Presence.init(
    {
      employeeId: DataTypes.INTEGER,
      presenceTypeId: DataTypes.INTEGER,
      checkIn: DataTypes.STRING,
      checkOut: DataTypes.STRING,
      checkInImage: DataTypes.STRING,
      checkOutImage: DataTypes.STRING,
      checkInCoordinates: DataTypes.STRING,
      checkOutCoordinates: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Presence",
      paranoid: true,
    }
  );
  return Presence;
};
