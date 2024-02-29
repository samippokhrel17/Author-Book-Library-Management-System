const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const connection = require("./helper/dbConnect");
const { executeQuery } = require("./helper/dbConnect");
const app = express();
const router = require("./Routes/router");

dotenv.config();
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.json());
let PORT = process.env.PORT || 5000;

app.use("/", router);

app.get("/", async (req, res) => {
  res.send("Welcome to Our Library");
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
