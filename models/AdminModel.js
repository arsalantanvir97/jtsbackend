const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const AdminSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },

    _image: { type: String },
  },
  {
    timestamps: true,
  }
)

AdminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

AdminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }

  const salt = await bcrypt.genSalt(12)
  this.password = await bcrypt.hash(this.password, salt)
})

module.exports = Admin = mongoose.model('Admin', AdminSchema)
