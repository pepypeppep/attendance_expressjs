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
      "Employees",
      [
        {
          nik: "12345678",
          name: "Agus",
          unitId: 1,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nik: "12345679",
          name: "Budi",
          unitId: 2,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nik: "12345680",
          name: "Caca",
          unitId: 1,
          isActive: true,
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
    await queryInterface.bulkDelete("Employees", null, {});
  },
};
