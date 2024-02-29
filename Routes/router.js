const { request } = require("express");

const { bookListing } = require("../Controller/bookController");
const express = require("express");

const router = express.Router();

router.post("/book", bookListing);

module.exports = router;
