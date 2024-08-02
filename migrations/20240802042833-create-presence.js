"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Presences", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      employeeId: {
        type: Sequelize.INTEGER,
      },
      presenceTypeId: {
        type: Sequelize.INTEGER,
      },
      checkIn: {
        type: Sequelize.STRING,
      },
      checkOut: {
        type: Sequelize.STRING,
      },
      checkInImage: {
        type: Sequelize.STRING,
      },
      checkOutImage: {
        type: Sequelize.STRING,
      },
      checkInCoordinates: {
        type: Sequelize.GEOMETRY("POINT", 4326),
        allowNull: true,
      },
      checkOutCoordinates: {
        type: Sequelize.GEOMETRY("POINT", 4326),
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Presences");
  },
};
