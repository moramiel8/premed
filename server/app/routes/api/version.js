import express from 'express'
const router = express.Router()

router.get('/', (req, res) => {
  res.json({
    buildTime: process.env.BUILD_TIME || null,
    gitSha: process.env.GIT_SHA || null,
  })
})

module.exports = router
