const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const db = require("../models");
const presenceController = require("../controllers/presenceController");

const validatePresence = [
  check("employeeId")
    .isLength({ min: 1 })
    .withMessage("Employe is required")
    .custom((value) => {
      return db.Employee.findOne({ where: { id: value } }).then((employee) => {
        if (!employee) {
          return Promise.reject("Employee does not valid");
        }
      });
    }),
  // check('presenceTypeId').optional().isLength({min:1}).withMessage("Presence type is required"),
  check("coordinates").isLength({ min: 1 }).withMessage("Location is required"),
  check("source").isLength({ min: 1 }).withMessage("Source is required"),
];

router.get("/", presenceController.index);
router.get("/:id", presenceController.show);
router.post("/checkin", validatePresence, presenceController.checkin);
router.post("/checkout", validatePresence, presenceController.checkout);
router.delete("/:id", presenceController.delete);

module.exports = router;
