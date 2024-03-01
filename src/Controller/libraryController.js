const { executeQuery } = require("../helper/db /dbConnect");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sqlString = require("sqlstring");

const library = async (req, res) => {
  try {
    console.log("Received Library Details:", req.body);
    let {
      libraryName,
      libraryAccout_details,
      bookNumber,
      totalAmountTrajection,
      accept,
      reject,
    } = req.body;
    if (
      !libraryName ||
      !libraryAccout_details ||
      !bookNumber ||
      !totalAmountTrajection ||
      accept === undefined ||
      reject === undefined
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Insert book listing data into the database
    let insertObject = {
      libraryName: libraryName,
      libraryAccout_details: libraryAccout_details,
      bookNumber: bookNumber,
      totalAmountTrajection: totalAmountTrajection,
      accept: is_sold,
      reject: is_deleted,
    };
    let query = sqlString.format(`INSERT INTO Library.library SET ?`, [
      insertObject,
    ]);

    let result = await executeQuery(query);
    console.log("Database operation result:", result);

    if (result.affectedRows > 0) {
      return res.status(200).send("Library Data Saved Successfully");
    }
    return res.status(200).send("Successfully inserted");
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

module.exports = { library };
