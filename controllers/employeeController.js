const { validationResult } = require("express-validator");
const db = require("../models");
const { where, Op } = require("sequelize");

exports.index = async (req, res) => {
  try {
    const employee = await db.Employee.findAll();
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.show = async (req, res) => {
  try {
    const employee = await db.Employee.findOne({
      where: { id: req.params.id },
    });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.store = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const newEmployee = await db.Employee.create(req.body);
    res.json(newEmployee);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.update = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updateEmployee = await db.Employee.update(req.body, {
      where: { id: req.params.id },
    });
    res.json(updateEmployee);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.delete = async (req, res) => {
  try {
    await db.Employee.destroy({ where: { id: req.params.id } });
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.archive = async (req, res) => {
  try {
    const employee = await db.Employee.findAll({
      where: { deletedAt: { [Op.not]: null } },
      paranoid: false,
    });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
