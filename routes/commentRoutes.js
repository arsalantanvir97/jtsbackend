const express = require('express')
const router = express.Router()
const {
  createComment,
  getComments,
} = require('../controllers/commentController')
const { protect } = require('../middlewares/authMIddleware.js')

router.post('/createComment', protect, createComment)
router.get('/getComments', protect, getComments)

module.exports = router
