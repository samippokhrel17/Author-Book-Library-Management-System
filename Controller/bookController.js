const { executeQuery } = require("../helper/dbConnect");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sqlString = require("sqlstring");

const bookListing = async (req, res) => {
  try {
    console.log("received Book details:", req.body);
    let {
      book_name,
      book_price,
      published_date,
      publication_name,
      is_sold,
      is_deleted,
    } = req.body;

    if (
      //   !book_name ||
      //   !book_price ||
      //   !published_date ||
      //   !publication_name ||
      //   !is_sold ||
      !is_deleted
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Insert book listing data into the database
    let insertObject = {
      book_name: book_name,
      book_price: book_price,
      published_date: published_date,
      publication_name: publication_name,
      is_sold: is_sold,
      is_deleted: is_deleted,
    };
    let query = sqlString.format(`INSERT INTO Library.bookListing SET ?`, [
      insertObject,
    ]);

    let result = await executeQuery(query);
    console.log("Database operation result:", result);

    if (result.affectedRows > 0) {
      return res.status(200).send("Success");
    }
    return res.status(200).send("Success fully inserted");
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

module.exports = { bookListing };
