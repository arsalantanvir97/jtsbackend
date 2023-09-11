const Comment = require('../models/SupportModel')

exports.createSupportComment = async (req, res) => {
  const { text, filetype } = req.body
  console.log('req.body', req.body)
  let filee
  if (filetype == 'null') {
    filee = null
  } else {
    filee =
      req.files && req.files._image
        ? req.files._image[0].path
        : req.files.vid[0].path
  }
  try {
    const comment = new Comment({
      filetype,
      filecontent: filee,
      text,
      user: req.id,
    })
    console.log('comment', comment)
    //   const feedbackcreated = await Feedback.create(
    //     feedback
    //   );
    //   console.log('feedbackcreated',feedbackcreated)
    const commentcreated = await comment.save()
    console.log('commentcreated', commentcreated)
    if (commentcreated) {
      res.status(201).json({
        success: true,
        message: 'Comment Successfully Created',
      })
    }
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    })
  }
}
exports.getSupportComments = async (req, res) => {
  try {
    const comments = await Comment.find()
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order
      .populate('user')
      .lean()
    await res.status(201).json({
      success: true,
      message: 'Comments',
      comments,
    })
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    })
  }
}
