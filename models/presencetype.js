"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PresenceType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PresenceType.hasMany(models.Presence, {
        foreignKey: "presenceTypeId",
        as: "Presences",
      });
    }
  }
  PresenceType.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "PresenceType",
      paranoid: true,
    }
  );
  return PresenceType;
};
