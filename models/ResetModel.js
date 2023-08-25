const mongoose = require('mongoose')

const ResetSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    code: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)
module.exports = Reset = mongoose.model('Reset', ResetSchema)
