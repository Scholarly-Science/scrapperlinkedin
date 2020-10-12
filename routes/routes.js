const express = require("express");

const { getCompanyList } = require("../controller/data");

const router = express.Router();

//Category
router.get("/company", getCompanyList);

module.exports = router;
