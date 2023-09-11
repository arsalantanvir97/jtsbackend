const express = require('express')
const router = express.Router()
const {
  createSupportComment,
  getSupportComments,
} = require('../controllers/supportcommentController')
const { protect } = require('../middlewares/authMIddleware.js')

router.post('/createSupportComment', protect, createSupportComment)
router.get('/getSupportComments', protect, getSupportComments)

module.exports = router
