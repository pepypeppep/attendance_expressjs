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
      "Units",
      [
        {
          name: "Unit 1",
          latitude: "-7.8865850810832425",
          logitude: "110.3275414114449",
          radius: 20,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Unit 2",
          latitude: "-7.886200424543141",
          logitude: "110.32840064585568",
          radius: 20,
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
    await queryInterface.bulkDelete("Units", null, {});
  },
};
