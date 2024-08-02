const express = require("express");
const bodyParser = require("body-parser");
const db = require("./models");

const userRoutes = require("./routes/userRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const cors = require("cors");

const app = express();

app.use(cors());
// app.use(setTimezone);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/users", userRoutes);
app.use("/employees", employeeRoutes);

// Middleware untuk melayani file statis dari direktori 'uploads'
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

db.sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
});
