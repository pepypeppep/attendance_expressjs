const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const employeeController = require("../controllers/employeeController");

const validateEmployee = [
  check("nik")
    .isLength({ min: 3 })
    .withMessage("NIK requires a minimum of 2 character.")
    .custom(async (value, { req }) => {
      const id = req.params.id || null;
      const employee = await db.Employee.findOne({
        where: { nik: value },
        paranoid: false,
      });
      console.log(employee);
      if (employee) {
        if (id != employee.id) {
          return Promise.reject("NIK " + employee.nik + " already registered");
        }
      }
    }),

  check("name")
    .isString()
    .withMessage("Name must be string.")
    .isLength({ min: 2 })
    .withMessage("The name requires a minimum of 2 characters"),
  check("unit")
    .isLength({ min: 2 })
    .withMessage("The unit requires a minimum of 2 characters"),
];

router.get("/", employeeController.index);
router.get("/:id", employeeController.show);
router.post("/store", validateEmployee, employeeController.store);
router.put("/:id", validateEmployee, employeeController.update);
router.delete("/:id", employeeController.delete);
router.get("/archive", employeeController.archive);

module.exports = router;
