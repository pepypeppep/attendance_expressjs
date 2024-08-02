const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const db = require("../models");
const { check, validationResult } = require("express-validator");
const { deleteFile } = require("../utils/fileUtils");
const upload = require("../middleware/upload");
const moment = require("moment-timezone");
const { where, Op } = require("sequelize");
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

// router.get("/", presenceController.index);
// router.get("/:id", presenceController.show);
// router.post("/checkin", validatePresence, presenceController.checkin);
// router.post("/checkout", validatePresence, presenceController.checkout);
// router.delete("/:id", presenceController.delete);

router.get("/", async (req, res) => {
  try {
    // const file = req.file;
    // if (!file) {
    //   return res.status(400).json({
    //     message: "File not found!",
    //   });
    // }
    const schedule = await db.Schedule.findOne({
      where: { day: moment().tz("Asia/Jakarta").locale("id").format("dddd") },
    });
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (req.file && req.file.path) {
        await deleteFile(req.file.path);
      }
      return res.status(422).json({ errors: errors.array() });
    }
    const { employeeId } = req.body;
    // const { employeeId, presenceTypeId } = req.body;
    // const checkInTime = req.currentTime().format(); // Waktu GMT +7
    // const checkInTime = Date.now(); // Waktu GMT +7
    // "2024-07-30T12:17:04+07:00"
    const checkInTime = moment().tz("Asia/Jakarta").format();
    const nowDate = moment()
      .tz("Asia/Jakarta")
      .locale("id")
      .format("YYYY-MM-D");
    const tolerant = moment(nowDate + "T" + schedule.clockIn + "+07:00")
      .add(-30, "minutes")
      .format();

    if (checkInTime < tolerant) {
      return res.status(400).json({
        message: "Belum waktunya presensi!",
      });
    }

    var presenceTypeId;
    // 1 tepat waktu
    // 2 terlambat
    if (checkInTime < schedule.clockIn) {
      presenceTypeId = 1;
    } else if (checkInTime > schedule.clockIn) {
      presenceTypeId = 2;
    }

    let coordinates = {};
    if (req.body.coordinates) {
      let lat, lng;
      [lat, lng] = req.body.coordinates.split(",").map(Number);
      if (!isNaN(lat) && !isNaN(lng)) {
        // -7.8867345,110.3274732 android
        // -7.886703014373779,110.32807922363281 FAKE GPS
        if (req.body.source.toLowerCase() == "android") {
          if (
            lat.toString().split(".")[1].length > 7 ||
            lng.toString().split(".")[1].length > 7
          ) {
            return res.status(400).json({
              message: "Fake GPS Terdeteksi!",
            });
          }
        }
        coordinates = {
          type: "Point",
          coordinates: [lat, lng], // GeoJSON expects [longitude, latitude]
        };
      } else {
        console.error("Invalid coordinates provided");
      }
    }

    const presence = await db.Presence.findOne({
      where: {
        employeeId,
        checkIn: {
          [db.Sequelize.Op.gte]: moment()
            .tz("Asia/Jakarta")
            .locale("id")
            .startOf("day"),
          [db.Sequelize.Op.lt]: moment()
            .tz("Asia/Jakarta")
            .locale("id")
            .endOf("day"),
        },
      },
      order: [["checkIn", "ASC"]],
    });

    // if(presence) {
    //   return res.status(202).json({
    //     message: "Anda telah melakukan presensi hari ini!",
    //   });
    // }

    const newPresence = await db.Presence.create({
      employeeId,
      presenceTypeId,
      checkIn: checkInTime,
      checkInImages: "file",
      // checkInImages: req.file.path,
      checkInCoordinates: coordinates,
    });
    res.json(newPresence);
  } catch (error) {
    // Hapus file yang diupload jika ada error
    if (req.file && req.file.path) {
      await deleteFile(req.file.path);
    }

    // Mengembalikan response error
    res.status(500).json({
      error: "An error occurred during check-in",
      details: error.message,
    });
  }
});

router.post(
  "/checkin",
  upload.single("images"),
  validatePresence,
  async (req, res) => {
    try {
      // const file = req.file;
      // if (!file) {
      //   return res.status(400).json({
      //     message: "File not found!",
      //   });
      // }
      const schedule = await db.Schedule.findOne({
        where: { day: moment().tz("Asia/Jakarta").locale("id").format("dddd") },
      });
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        if (req.file && req.file.path) {
          await deleteFile(req.file.path);
        }
        return res.status(422).json({ errors: errors.array() });
      }
      const { employeeId } = req.body;
      // const { employeeId, presenceTypeId } = req.body;
      // const checkInTime = req.currentTime().format(); // Waktu GMT +7
      // const checkInTime = Date.now(); // Waktu GMT +7
      // "2024-07-30T12:17:04+07:00"
      const checkInTime = moment().tz("Asia/Jakarta").format();
      const nowDate = moment()
        .tz("Asia/Jakarta")
        .locale("id")
        .format("YYYY-MM-DD");
      const tolerant = moment(nowDate + "T" + schedule.clockIn + "+07:00")
        .add(-30, "minutes")
        .format();
      // res.json({
      //   checkin: checkInTime,
      //   schedule: schedule.clockIn,
      //   tolerant: tolerant,
      // });

      if (checkInTime < tolerant) {
        return res.status(400).json({
          message: "Belum waktunya presensi!",
        });
      }

      var presenceTypeId;
      // 1 tepat waktu
      // 2 terlambat
      if (checkInTime < schedule.clockIn) {
        presenceTypeId = 1;
      } else if (checkInTime > schedule.clockIn) {
        presenceTypeId = 2;
      }

      let coordinates = {};
      if (req.body.coordinates) {
        let lat, lng;
        [lat, lng] = req.body.coordinates.split(",").map(Number);
        if (!isNaN(lat) && !isNaN(lng)) {
          // -7.8867345,110.3274732 android
          // -7.886703014373779,110.32807922363281 FAKE GPS
          if (req.body.source.toLowerCase() == "android") {
            if (
              lat.toString().split(".")[1].length > 7 ||
              lng.toString().split(".")[1].length > 7
            ) {
              return res.status(400).json({
                message: "Fake GPS Terdeteksi!",
              });
            }
          }
          coordinates = {
            type: "Point",
            coordinates: [lat, lng], // GeoJSON expects [longitude, latitude]
          };
        } else {
          console.error("Invalid coordinates provided");
        }
      }

      // const presence = await db.Presence.findOne({
      //   where: {
      //     employeeId,
      //     checkIn: {
      //       [db.Sequelize.Op.gte]: moment()
      //         .tz("Asia/Jakarta")
      //         .locale("id")
      //         .startOf("day"),
      //       [db.Sequelize.Op.lt]: moment()
      //         .tz("Asia/Jakarta")
      //         .locale("id")
      //         .endOf("day"),
      //     },
      //   },
      //   order: [["checkIn", "ASC"]],
      // });

      // if(presence) {
      //   return res.status(202).json({
      //     message: "Anda telah melakukan presensi hari ini!",
      //   });
      // }

      const newPresence = await db.Presence.create({
        employeeId,
        presenceTypeId,
        checkIn: checkInTime,
        checkInImages: "file",
        // checkInImages: req.file.path,
        checkInCoordinates: coordinates,
      });
      res.json(newPresence);
    } catch (error) {
      // Hapus file yang diupload jika ada error
      if (req.file && req.file.path) {
        await deleteFile(req.file.path);
      }

      // Mengembalikan response error
      res.status(500).json({
        error: "An error occurred during check-in",
        details: error.message,
      });
    }
  }
);

router.post("/checkout", upload.single("images"), async (req, res) => {
  try {
    // const file = req.file;
    // if (!file) {
    //   return res.status(400).json({
    //     message: "File not found!",
    //   });
    // }

    const schedule = await db.Schedule.findOne({
      where: { day: moment().tz("Asia/Jakarta").locale("id").format("dddd") },
    });
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (req.file && req.file.path) {
        await deleteFile(req.file.path);
      }
      return res.status(422).json({ errors: errors.array() });
    }

    const { employeeId } = req.body;

    // const now = req.currentTime().format();
    const now = moment().tz("Asia/Jakarta").format();
    const nowDate = moment()
      .tz("Asia/Jakarta")
      .locale("id")
      .format("YYYY-MM-D");
    const tolerant = moment(nowDate + "T" + schedule.clockOut + "+07:00")
      .add(+30, "minutes")
      .format();

    if (now > tolerant) {
      return res.status(400).json({
        message: "Melebihi batas waktu presensi!",
      });
    }

    let coordinates = {};
    if (req.body.coordinates) {
      let lat, lng;
      [lat, lng] = req.body.coordinates.split(",").map(Number);
      if (!isNaN(lat) && !isNaN(lng)) {
        if (req.body.source.toLowerCase() == "android") {
          if (
            lat.toString().split(".")[1].length > 7 ||
            lng.toString().split(".")[1].length > 7
          ) {
            return res.status(400).json({
              message: "Fake GPS Terdeteksi!",
            });
          }
        }
        coordinates = {
          type: "Point",
          coordinates: [lat, lng], // GeoJSON expects [longitude, latitude]
        };
      } else {
        console.error("Invalid coordinates provided");
      }
    }

    // res.json({
    //   asli: "2024-08-02T00:00:01+07:00",
    //   indo: moment().tz("Asia/Jakarta").startOf("day").format(),
    //   generate: moment(now).startOf("day"),
    //   generate2: moment().tz("Asia/Jakarta").locale("id").startOf("day"),
    // });

    const presence = await db.Presence.findOne({
      where: {
        employeeId,
        checkOut: null,
        checkIn: {
          [db.Sequelize.Op.gte]: moment()
            .tz("Asia/Jakarta")
            .startOf("day")
            .format(),
          [db.Sequelize.Op.lt]: moment()
            .tz("Asia/Jakarta")
            .endOf("day")
            .format(),
        },
        // checkIn: {
        //   [db.Sequelize.Op.gte]: "2024-08-02T00:00:01+07:00Z",
        //   [db.Sequelize.Op.lt]: "2024-08-02T23:59:59+07:00Z",
        // },
      },
      order: [["checkIn", "ASC"]],
    });

    if (presence) {
      presence.checkOut = now;
      // presence.checkOutImages = req.file.path;
      presence.checkOutCoordinates = coordinates;
      await presence.save();

      upload.single("checkOutImages");
      res.json(presence);
    } else {
      res.status(400).send("No active check-in found");
    }
  } catch (error) {
    if (req.file && req.file.path) {
      await deleteFile(req.file.path);
    }
    res.status(500).json({
      error: "An error occurred during check-in",
      details: error.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const presence = await db.Presence.findByPk(req.params.id);
    if (!presence) {
      return res.status(400).json({
        message: "Presence not found!",
      });
    }
    res.json(presence);
  } catch (error) {
    res.status(500).json({
      error: "An error occurred during process",
      details: error.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await db.Presence.destroy({
      where: {
        presenceId: req.params.id,
      },
    });
    res.json({ message: "Presence deleted successfully" });
  } catch (error) {
    res.status(500).json({
      error: "An error occurred during delete process",
      details: error.message,
    });
  }
});

module.exports = router;
