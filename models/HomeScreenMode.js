const mongoose = require('mongoose')

const HomeScreenSchema = mongoose.Schema(
  {
    banner: {
      type: String,
    },
    text: {
      type: String,
    },
    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
)
HomeScreenSchema.index({ '$**': 'text' })
module.exports = HomeScreen = mongoose.model('HomeScreen', HomeScreenSchema)
