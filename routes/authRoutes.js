const express = require("express");
const authControllers = require("../controllers/authControllers");

const router = express.Router();

router.get("/login", authControllers.login_get);
router.get("/signup", authControllers.signup_get);
router.post("/login", authControllers.login_post);
router.post("/signup", authControllers.signup_post);
router.get("/logout", authControllers.logout_get);

module.exports = router;
