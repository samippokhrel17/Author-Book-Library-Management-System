const { executeQuery } = require("../helper/db /dbConnect");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sqlString = require("sqlstring");

const transaction = async (req, res) => {
  try {
    console.log("Received Transaction Details:", req.body);
    let { customer_name, phone_numbers, amount_of_book, email, is_success } =
      req.body;
    if (
      !customer_name ||
      !phone_numbers ||
      !amount_of_book ||
      !email ||
      is_success === undefined // Check if is_deleted is undefined
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Insert book listing data into the database
    let insertObject = {
      customer_name: customer_name,
      phone_numbers: phone_numbers,
      amount_of_book: amount_of_book,
      email: email,
      is_sold: is_sold,
      is_success: is_success,
    };
    let query = sqlString.format(`INSERT INTO Library.tranjection SET ?`, [
      insertObject,
    ]);

    let result = await executeQuery(query);
    console.log("Database operation result:", result);

    if (result.affectedRows > 0) {
      return res.status(200).send("Tranjection Data Saved Successfully");
    }
    return res.status(200).send("Successfully inserted");
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

module.exports = { transaction };
