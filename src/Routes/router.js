const { request } = require("express");

const { bookListing } = require("../Controller/bookController");
const { author } = require("../Controller/authorController");
const { library } = require("../Controller/libraryController");
const { transaction } = require("../Controller/tranjectionController");

const express = require("express");

const router = express.Router();

router.post("/book", bookListing);
router.post("/author", author);
router.post("/library", library);
router.post("/transaction", transaction);

module.exports = router;
