const mongoose = require('mongoose')

const NewsSchema = mongoose.Schema(
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
NewsSchema.index({ '$**': 'text' })
module.exports = News = mongoose.model('News', NewsSchema)
