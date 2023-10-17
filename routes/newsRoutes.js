const express = require('express')
const router = express.Router()
const {
  createNewsComment,
  geNewsComments,
} = require('../controllers/newscommentController')
const { protect } = require('../middlewares/authMIddleware.js')

router.post('/createNewsComment', protect, createNewsComment)
router.get('/geNewsComments', protect, geNewsComments)

module.exports = router
