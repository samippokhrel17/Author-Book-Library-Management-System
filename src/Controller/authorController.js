const { executeQuery } = require("../helper/db /dbConnect");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sqlString = require("sqlstring");

const author = async (req, res) => {
  try {
    console.log("received Book details:", req.body);
    let { author_name, author_address, author_number, author_DOB } = req.body;
    if (
      !author_name ||
      !author_address ||
      !author_number ||
      !author_DOB // Check if is_deleted is undefined
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Insert book listing data into the database
    let insertObject = {
      author_name: author_name,
      author_address: author_address,
      author_number: author_number,
      author_DOB: author_DOB,
    };
    let query = sqlString.format(`INSERT INTO Library.author SET ?`, [
      insertObject,
    ]);

    let result = await executeQuery(query);
    console.log("Database operation result:", result);

    if (result.affectedRows > 0) {
      return res.status(200).send("Success");
    }
    return res.status(200).send("Success fully inserted Author Information");
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

module.exports = { author };
