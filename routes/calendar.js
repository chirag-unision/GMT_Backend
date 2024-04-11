const express = require("express")
const router = express.Router()

const { setCalendar } = require("../controllers/calenderController")

// const { auth } = require("../middleware/auth")

router.post("/setCalendar", setCalendar)

module.exports = router