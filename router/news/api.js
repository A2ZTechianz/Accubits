const express = require("express");
const router = express.Router();
const verifyToken = require('../helper/validate_token');


const {
    signupSchema,
    signup,
    newsletter
} = require("./news");


router.post("/signup", signupSchema, signup);
router.post("/send-newsletter", verifyToken, newsletter);


module.exports = router;