const cors = require('cors')
const express = require('express')
const dotenv = require('dotenv')
var path = require('path')
const logger = require('morgan')
const { connectDB } = require('./config/db.js')
const authRoutes = require('./routes/authRoutes.js')
const multer = require('multer')
const pageRoutes = require('./routes/pageRoutes.js')
const commentRoutes = require('./routes/commentRoutes.js')
const supportRoutes = require('./routes/supportRoutes.js')

const { fileFilter, fileStorage } = require('./multer.js')

dotenv.config()

connectDB()
const app = express()
app.use(cors())
app.options('*', cors())
app.use(express.json())
app.use(logger('dev'))

app.use(
  multer({
    storage: fileStorage,
    fileFilter: fileFilter,
  }).fields([
    {
      name: '_image',
      maxCount: 1,
    },
    {
      name: 'vid',
      maxCount: 1,
    },
  ])
)

app.use('/api/auth', authRoutes)
app.use('/api/page', pageRoutes)
app.use('/api/comment', commentRoutes)
app.use('/api/support', supportRoutes)

app.get('/uploads/:name', (req, res) => {
  // const myURL  = new URL(req.url)
  // console.log(myURL.host);

  res.sendFile(path.join(__dirname, `./uploads/${req.params.name}`))
})

app.get('/', (req, res) => {
  res.send('API is running....')
})

app.listen(5000, console.log('Server running on port 5000'))
