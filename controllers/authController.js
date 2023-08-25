const asyncHandler = require('express-async-handler')

const Admin = require('../models/AdminModel')
const Reset = require('../models/ResetModel')

const { generateJWTtoken } = require('../utills/generateJWTtoken.js')
const { generateEmail } = require('../services/generate_email.js')
const { generateCode } = require('../services/generate_code.js')
const {
  createResetToken,
  verifyPassword,
  comparePassword,
  generateHash,
} = require('../queries')
const User = require('../models/UserModel')
const HomeScreen = require('../models/HomeScreenMode')

exports.registerAdmin = asyncHandler(async (req, res) => {
  const { fullName, email, phone, password } = req.body
  let _image =
    req.files &&
    req.files._image &&
    req.files._image[0] &&
    req.files._image[0].path

  const AdminExists = await Admin.findOne({ email })

  if (AdminExists) {
    return res.status(400).json({ message: 'Admin already exists' })
  }

  const admin = await Admin.create({
    fullName,
    email,
    phone,
    _image,
    password,
  })

  if (admin) {
    res.status(201).json({
      success: true,
      message: 'Admin Successfully Created',
      _id: admin._id,
      fullName: admin.fullName,
      _image: admin._image,
      phone: admin.phone,
      email: admin.email,

      token: generateJWTtoken(admin._id),
    })
  } else {
    return res.status(400).json({ message: 'Invalid Admin Data' })
  }
})

exports.authAdmin = asyncHandler(async (req, res) => {
  console.log('authAdmin')
  const { email, password } = req.body

  const admin = await Admin.findOne({ email })

  if (admin && (await admin.matchPassword(password))) {
    res.json({
      success: true,
      message: 'Login succefully',

      _id: admin._id,

      phone: admin.phone,
      _image: admin._image,

      fullName: admin.fullName,
      email: admin.email,
      token: generateJWTtoken(admin._id),
    })
  } else {
    console.log('error')
    return res.status(400).json({
      message: 'Invalid User Data',
    })
  }
})
exports.userRegister = asyncHandler(async (req, res) => {
  const { fullName, email, password, confirm_password } = req.body

  if (!comparePassword(password, confirm_password))
    return res.status(400).json({ message: 'Password does not match' })

  const UserExists = await User.findOne({ email })

  if (UserExists) {
    return res.status(400).json({ message: 'User already exists' })
  }

  const user = await User.create({
    fullName,
    email,
    password,
  })

  if (user) {
    res.status(201).json({
      success: true,
      message: 'User Successfully Created',
      _id: user._id,
      fullName: user.fullName,
      email: user.email,

      token: generateJWTtoken(user._id),
    })
  } else {
    return res.status(400).json({ message: 'Invalid User Data' })
  }
})
exports.userAuth = asyncHandler(async (req, res) => {
  console.log('authAdmin')
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (user && (await user.matchPassword(password))) {
    res.json({
      success: true,
      message: 'Login succefully',

      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      token: generateJWTtoken(user._id),
    })
  } else {
    console.log('error')
    return res.status(400).json({
      message: 'Invalid User Data',
    })
  }
})

exports.recoverPassword = asyncHandler(async (req, res) => {
  console.log('recoverPassword')
  const { email } = req.body

  const admin = await Admin.findOne({ email })
  if (!admin) {
    console.log('!admin')
    return res.status(400).json({
      message: 'Invalid Email',
    })
  } else {
    const status = generateCode()
    await createResetToken(email, status)

    const html = `<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.
        \n\n Your verification status is ${status}:\n\n
        \n\n If you did not request this, please ignore this email and your password will remain unchanged.           
        </p>`
    await generateEmail(email, 'Blood Moon - Password Reset', html)
    return res.status(201).json({
      success: true,

      message: 'An OTP is send to your email please check your email address',
    })
  }
})
exports.verifyRecoverCode = asyncHandler(async (req, res) => {
  const { code, email } = req.body

  const reset = await Reset.findOne({ email, code })
  console.log('reset', reset)

  if (reset) {
    return res
      .status(200)
      .json({ success: true, message: 'Token Validated successfully' })
  } else {
    return res.status(400).json({ message: 'Invalid Token status' })
  }
})

exports.resetPassword = asyncHandler(async (req, res) => {
  const { password, confirm_password, code, email } = req.body

  if (!comparePassword(password, confirm_password))
    return res.status(400).json({ message: 'Password Not Equal' })
  const reset = await Reset.findOne({ email, code })
  console.log('reset', reset)
  if (!reset)
    return res.status(400).json({ message: 'Invalid Recovery status' })
  const updatedadmin = await Admin.findOne({ email })
  updatedadmin.password = await password
  await updatedadmin.save()
  res.status(201).json({
    success: true,
    message: 'Password Updated',
  })
})

exports.editProfile = async (req, res) => {
  try {
    const { fullName, phone } = req.body
    let _image =
      req.files &&
      req.files._image &&
      req.files._image[0] &&
      req.files._image[0].path

    const admin = await Admin.findOne({ _id: req.id })
    admin.fullName = fullName
    admin.phone = phone

    admin._image = _image ? _image : admin._image
    await admin.save()
    // await res.status(201).json({
    //   message: "Admin Update",
    //   admin,
    // });
    await res.status(201).json({
      success: true,
      message: 'Profile Updated succefully',
      _id: admin._id,
      fullName: admin.fullName,
      phone: admin.phone,
      email: admin.email,
      _image: admin._image,
      token: generateJWTtoken(admin._id),
    })
  } catch (error) {
    return res.status(400).json({ message: error.toString() })
  }
}

exports.changepassword = async (req, res) => {
  try {
    console.log('reset')

    const { existingpassword, newpassword, confirm_password } = req.body

    console.log('req.body', req.body)
    const admin = await Admin.findOne({ _id: req.id })

    if (admin && (await admin.matchPassword(existingpassword))) {
      console.log('block1')
      if (!comparePassword(newpassword, confirm_password)) {
        console.log('block2')
        return res.status(400).json({ message: 'Password does not match' })
      } else {
        console.log('block3')
        admin.password = newpassword
        await admin.save()
        console.log('admin', admin)
        res.status(201).json({
          success: true,
          message: 'Password Updated succefully',
          _id: admin._id,
          fullName: admin.fullName,
          phone: admin.phone,
          email: admin.email,
          _image: admin._image,
          token: generateJWTtoken(admin._id),
        })
      }
    } else {
      console.log('block4')

      return res.status(401).json({ message: 'Wrong Password' })
    }
  } catch (error) {
    console.log('error', error)
    return res.status(400).json({ message: error.toString() })
  }
}
exports.userDetails = async (req, res) => {
  try {
    const user = await User.findById(req.id).lean().select('-password')
    await res.status(201).json({
      success: true,
      message: 'User Details',
      user,
    })
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    })
  }
}
exports.adminDetails = async (req, res) => {
  try {
    const admin = await Admin.findById(req.id).lean().select('-password')
    await res.status(201).json({
      success: true,
      message: 'User Details',
      admin,
    })
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    })
  }
}
exports.createHomeScreenData = asyncHandler(async (req, res) => {
  let data
  let _image =
    req.files &&
    req.files._image &&
    req.files._image[0] &&
    req.files._image[0].path
  data = await HomeScreen.findOne()
  if (data) {
    data.banner = _image
  } else {
    data = await HomeScreen.create({
      banner: _image,
    })
  }

  const newData = await data.save()
  if (newData) {
    res.status(201).json({
      success: true,
      message: 'Data Uploaded Successfully',
      newData,
    })
  } else {
    return res.status(400).json({ message: 'Error' })
  }
})
exports.gethomeScreenData = async (req, res) => {
  try {
    const homescreen = await HomeScreen.findOne()
    await res.status(201).json({
      success: true,
      message: 'Home Screen Data',
      homescreen,
    })
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    })
  }
}

exports.userLogs = async (req, res) => {
  try {
    console.log('req.query.searchString', req.query.searchString)
    const searchParam = req.query.searchString
      ? // { $text: { $search: req.query.searchString } }
        {
          $or: [
            {
              fullName: { $regex: `${req.query.searchString}`, $options: 'i' },
            },
          ],
        }
      : {}
    const from = req.query.from
    const to = req.query.to
    let dateFilter = {}
    if (from && to)
      dateFilter = {
        createdAt: {
          $gte: moment.utc(new Date(from)).startOf('day'),
          $lte: moment.utc(new Date(to)).endOf('day'),
        },
      }

    const users = await User.paginate(
      {
        ...searchParam,
        ...dateFilter,
      },
      {
        page: req.query.page,
        limit: req.query.perPage,
        lean: true,
        sort: '-_id',
      }
    )
    await res.status(200).json({
      success: true,
      message: 'User Logs',

      users,
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: err.toString(),
    })
  }
}
