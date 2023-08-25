const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const PageSchema = mongoose.Schema(
  {
    pageName: {
      type: String,
    },
    pageData: {
      type: String,
    },
    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
)
PageSchema.plugin(mongoosePaginate)
PageSchema.index({ '$**': 'text' })
module.exports = Page = mongoose.model('Page', PageSchema)
