const express = require('express')
const router = express.Router()
const {
  createPage,
  getPageDetails,
  pageLogs,
  editPage,
  toggleActiveStatus,
} = require('../controllers/pageController.js')
const { protect } = require('../middlewares/authMIddleware.js')

router.get('/toggle-active/:id', protect, toggleActiveStatus)

router.get('/page-details/:id', protect, getPageDetails)

router.post('/createPage', protect, createPage)
router.get('/pageLogs', protect, pageLogs)

router.post('/editPage', protect, editPage)

module.exports = router
