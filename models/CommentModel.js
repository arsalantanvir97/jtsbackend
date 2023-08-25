const mongoose = require('mongoose')

const CommentSchema = mongoose.Schema(
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
CommentSchema.index({ '$**': 'text' })
module.exports = Comment = mongoose.model('Comment', CommentSchema)
