"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      "Schedules",
      [
        {
          day: "Senin",
          clockIn: "08:00",
          clockOut: "17:00",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          day: "Selasa",
          clockIn: "08:00",
          clockOut: "17:00",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          day: "Rabu",
          clockIn: "08:00",
          clockOut: "17:00",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          day: "Kamis",
          clockIn: "08:00",
          clockOut: "17:00",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          day: "Jumat",
          clockIn: "08:00",
          clockOut: "17:00",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Schedules", null, {});
  },
};
