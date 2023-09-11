const mongoose = require('mongoose')

const SupportSchema = mongoose.Schema(
  {
    filetype: {
      type: String,
    },
    filecontent: {
      type: String,
    },
    text: {
      type: String,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
)
SupportSchema.index({ '$**': 'text' })
module.exports = Support = mongoose.model('Support', SupportSchema)
