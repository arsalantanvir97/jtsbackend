const express = require('express')
const router = express.Router()
const {
  authAdmin,
  registerAdmin,
  recoverPassword,
  verifyRecoverCode,
  resetPassword,
  userAuth,
  userRegister,
  editProfile,
  changepassword,
  userDetails,
  adminDetails,
  createHomeScreenData,
  gethomeScreenData,
  userLogs,
} = require('../controllers/authController.js')
const { protect } = require('../middlewares/authMIddleware.js')

router.post('/adminRegister', registerAdmin)
router.post('/adminLogin', authAdmin)
router.post('/userLogin', userAuth)
router.post('/userRegister', userRegister)
router.post('/createHomeScreenData', createHomeScreenData)
router.get('/gethomeScreenData', gethomeScreenData)

router.post('/recoverPassword', recoverPassword)
router.post('/verifyRecoverCode', verifyRecoverCode)
router.post('/resetPassword', resetPassword)
router.post('/editProfile', protect, editProfile)
router.post('/changepassword', protect, changepassword)
router.get('/userDetails', protect, userDetails)
router.get('/adminDetails', protect, adminDetails)

router.get('/userLogs', protect, userLogs)

module.exports = router
