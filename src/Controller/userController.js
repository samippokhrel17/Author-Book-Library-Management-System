// const { executeQuery } = require("../dbConnect");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const sqlString = require("sqlstring");

// const generateTokens = (userId) => {
//   const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
//     expiresIn: "15m",
//   });
//   const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
//     expiresIn: "7d",
//   });
//   return { accessToken, refreshToken };
// };

// const registerUser = async (req, res) => {
//   try {
//     console.log("received registration request:", req.body);
//     let { firstName, lastName, email, password, phoneNumber } = req.body;

//     if (!firstName || !lastName || !email || !password || !phoneNumber)
//       return res.status(400).json("All fields are required");

//     let emailCheckQuery = sqlString.format(
//       `SELECT count(*) AS count FROM Library.user WHERE email = ?`,
//       [email]
//     );

//     let emailCheckResult = await executeQuery(emailCheckQuery);

//     if (emailCheckResult[0].count > 0) {
//       return res.status(400).json("Email already exists");
//     }

//     let phoneNumberCheckQuery = sqlString.format(
//       `SELECT count(*) AS count FROM Library.user WHERE phoneNumber = ?`,
//       [phoneNumber]
//     );

//     let phoneNumberCheckResult = await executeQuery(phoneNumberCheckQuery);

//     if (phoneNumberCheckResult[0].count > 0) {
//       return res.status(400).json("Phone number already exists");
//     }

//     const salt = await bcrypt.genSalt(10);
//     let hashpassword = await bcrypt.hash(password, salt);

//     // Insert user data into database
//     let insertObject = {
//       firstName: firstName,
//       lastName: lastName,
//       email: email,
//       password: hashpassword,
//       phoneNumber: phoneNumber,
//     };

//     let query = sqlString.format(`INSERT INTO Library.user SET ?`, [
//       insertObject,
//     ]);

//     let result = await executeQuery(query);

//     console.log("Database operation result:", result);

//     if (result.affectedRows > 0) return res.status(200).send("Success");
//     return res.status(200).send("Successfully inserted");
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json(error);
//   }
// };

// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password)
//       return res.status(400).json("Email and password are required");

//     let emailCheckQuery = sqlString.format(
//       `SELECT * FROM Library.user WHERE email = ?`,
//       [email]
//     );

//     let user = await executeQuery(emailCheckQuery);

//     if (user.length === 0) {
//       return res.status(404).json("User not found");
//     }

//     const hashedPassword = user[0].password;

//     const passwordMatch = await bcrypt.compare(password, hashedPassword);

//     if (!passwordMatch) {
//       return res.status(401).json("Invalid password");
//     }

//     // User authenticated, generate JWT tokens
//     const { accessToken, refreshToken } = generateTokens(user[0].id);

//     return res.status(200).json({
//       firstName: user[0].firstName,
//       lastName: user[0].lastName,
//       mobileNumber: user[0].phoneNumber,
//       email: user[0].email,
//       accessToken,
//       refreshToken,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json(error);
//   }
// };

// module.exports = { registerUser, login };

const { executeQuery } = require("../helper/db /dbConnect");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sqlString = require("sqlstring");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({});
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

const registerUser = async (req, res) => {
  try {
    console.log("received registration request:", req.body);
    let { firstName, lastName, email, password, phoneNumber } = req.body;

    if (!firstName || !lastName || !email || !password || !phoneNumber)
      return res.status(400).json("All fields are required");

    let emailCheckQuery = sqlString.format(
      `SELECT count(*) AS count FROM Library.user WHERE email = ?`,
      [email]
    );

    let emailCheckResult = await executeQuery(emailCheckQuery);

    if (emailCheckResult[0].count > 0) {
      return res.status(400).json("Email already exists");
    }

    let phoneNumberCheckQuery = sqlString.format(
      `SELECT count(*) AS count FROM Library.user WHERE phoneNumber = ?`,
      [phoneNumber]
    );

    let phoneNumberCheckResult = await executeQuery(phoneNumberCheckQuery);

    if (phoneNumberCheckResult[0].count > 0) {
      return res.status(400).json("Phone number already exists");
    }

    const salt = await bcrypt.genSalt(10);
    let hashpassword = await bcrypt.hash(password, salt);

    // Insert user data into database
    let insertObject = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashpassword,
      phoneNumber: phoneNumber,
      role: "librarian", // Assigning 'librarian' role during registration
    };

    let query = sqlString.format(`INSERT INTO Library.user SET ?`, [
      insertObject,
    ]);

    let result = await executeQuery(query);

    console.log("Database operation result:", result);

    if (result.affectedRows > 0) return res.status(200).send("Success");
    return res.status(200).send("Successfully inserted");
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json("Email and password are required");

    let emailCheckQuery = sqlString.format(
      `SELECT * FROM Library.user WHERE email = ?`,
      [email]
    );

    let user = await executeQuery(emailCheckQuery);

    if (user.length === 0) {
      return res.status(404).json("User not found");
    }

    const hashedPassword = user[0].password;

    const passwordMatch = await bcrypt.compare(password, hashedPassword);

    if (!passwordMatch) {
      return res.status(401).json("Invalid password");
    }

    // Check if user has librarian role
    if (user[0].role !== "librarian") {
      return res
        .status(403)
        .json("Access denied. Only librarians are allowed to log in.");
    }

    // User authenticated, generate JWT tokens

    const { accessToken, refreshToken } = generateTokens(user[0].id);
    return res.status(200).json({
      firstName: user[0].firstName,
      lastName: user[0].lastName,
      mobileNumber: user[0].phoneNumber,
      email: user[0].email,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

// const getInfo = async (req, res) => {
//   try {
//     // user authentication using jwt token
//     const token = req.headers.authorization;
//     if (!token) {
//       return res.status(401).json("Authentication required");
//     }
//     //user id from jwt token
//     const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//     const userId = decodedToken.userId;
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json(error);
//   }
// };

const getInfo = async (req, res) => {
  try {
    // User authentication using JWT token
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json("Authentication required");
    }
    // User ID from JWT token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decodedToken.userId;

    // Extract author name from request body
    const { author_name } = req.body;

    if (!author_name) {
      return res.status(400).json("Author name is required");
    }

    // Formulate the SQL query string with the dynamically provided author name
    let query = `
      SELECT *
      FROM bookListing
      INNER JOIN author ON bookListing.author_name = author.author_name
      WHERE author.author_name = '${author_name}';
    `;

    // Execute the SQL query
    let result = await executeQuery(query);

    // Handle the query result
    if (result.length === 0) {
      return res.status(404).json("No data found");
    }

    // If data found, return it
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

module.exports = { registerUser, login, getInfo };

// SELECT *
// FROM bookListing
// INNER JOIN author ON bookListing.author_name = author.author_name
// WHERE author.author_name = 'Laxmi Pd Devkota';
