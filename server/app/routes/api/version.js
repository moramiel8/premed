import express from 'express'
const router = express.Router()

// @route   GET api/version
// @desc    Get server build/deploy time
// @access  Public
router.get('/', (req, res) => {
  return res.send({
    buildTime: process.env.BUILD_TIME || null
  })
})

module.exports = router
