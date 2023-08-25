const Page = require('../models/PageModel')

exports.createPage = async (req, res) => {
  const { pageName, pageData } = req.body
  console.log('req.body', req.body)
  try {
    const pageExists = await Page.findOne({ pageName })

    if (pageExists) {
      return res.status(400).json({ message: 'Page already exists' })
    }

    const page = new Page({
      pageName,
      pageData,
    })
    console.log('page', page)
    //   const feedbackcreated = await Feedback.create(
    //     feedback
    //   );
    //   console.log('feedbackcreated',feedbackcreated)
    const pagecreated = await page.save()
    console.log('pagecreated', pagecreated)
    if (pagecreated) {
      res.status(201).json({
        success: true,
        message: 'Page Successfully Created',
      })
    }
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    })
  }
}
exports.pageLogs = async (req, res) => {
  try {
    console.log('req.query.searchString', req.query.searchString)
    const searchParam = req.query.searchString
      ? // { $text: { $search: req.query.searchString } }
        {
          $or: [
            {
              pageName: { $regex: `${req.query.searchString}`, $options: 'i' },
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

    const pagedata = await Page.paginate(
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
      message: 'Page Logs',

      pagedata,
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: err.toString(),
    })
  }
}

exports.getPageDetails = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id)
    await res.status(201).json({
      page,
      success: true,
      message: 'Page Details',
    })
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    })
  }
}
exports.toggleActiveStatus = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id)
    console.log('page', page)
    page.status = page.status == true ? false : true
    console.log('page', page)

    await page.save()
    console.log('service2', page)

    await res.status(201).json({
      success: true,

      message: page.status ? 'Page Activated' : 'Page Inactivated',
    })
  } catch (err) {
    console.log('error', err)

    res.status(500).json({
      message: err.toString(),
    })
  }
}
exports.editPage = async (req, res) => {
  const { pageName, pageData } = req.body
  const page = await Page.findOne({ pageName })
  page.pageName = pageName ? pageName : page.pageName
  page.pageData = pageData ? pageData : page.pageData
  await page.save()
  await res.status(201).json({
    success: true,
    message: 'Page Updated Successfully',
  })
}
