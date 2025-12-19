const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const authAdmin = require('../../middleware/authAdmin');

// Anouncement model
const Anouncement = require('../../models/Anouncement');
const modelName = 'anouncement';

// Errors
const ancMessage = require('../../messages/anouncements');
const { AncNotExist, SuccessDelete } = ancMessage;

// @route   GET api/anouncements/:id
// @desc    Get anouncement by id
// @access  Public
router.get('/:id', (req, res, next) => {
  Anouncement.findById(req.params.id)
    .select('-userId')
    .then((anc) => {
      if (!anc) return res.status(AncNotExist.status).json(AncNotExist.msg);
      return res.json(anc);
    })
    .catch(next);
});

// @route   GET api/anouncements
// @desc    Get all anouncements without author Id
// @access  Public
router.get('/', (req, res, next) => {
  const date = new Date();

  Anouncement.find({
    date: {
      $lte: Date.now(),
      $gte: date.setMonth(date.getMonth() - 2)
    }
  })
    .select('-userId')
    .populate('group')
    .sort({ date: '-1' })
    .then((anc) => res.json(anc))
    .catch(next);
});

// @route   GET api/anouncements/all/extended
// @desc    Get all anouncements with author Id
// @access  Admin
router.get('/all/extended', [auth, authAdmin], (req, res, next) => {
  Anouncement.find()
    .then((anc) => res.json(anc))
    .catch(next);
});

// @route   POST api/anouncements
// @desc    Create new anouncement
// @access  Admin
router.post('/', [auth, authAdmin], (req, res, next) => {
  const { title, content } = req.body;

  // Accept both formats:
  // { groupId: "..." } OR { group: { value: "..." } }
  const groupId = req.body.groupId ?? (req.body.group && req.body.group.value);

  res.locals.model = modelName;
  const userId = res.locals.user.id;

  if (!groupId) {
    return res.status(400).json({ msg: 'groupId is required' });
  }

  const newAnc = new Anouncement({
    title,
    content,
    userId,
    group: groupId
  });

  newAnc
    .save()
    .then((anc) => res.json(anc)) // no populate needed for create response
    .catch(next);
});

// @route   PUT api/anouncements/:id
// @desc    Update anouncement
// @access  Admin
router.put('/:id', [auth, authAdmin], (req, res, next) => {
  const { title, content } = req.body;

  // Accept both formats on update as well
  const groupId = req.body.groupId ?? (req.body.group && req.body.group.value);

  res.locals.model = modelName;

  const ancId = req.params.id;
  const userId = res.locals.user.id;

  if (!groupId) {
    return res.status(400).json({ msg: 'groupId is required' });
  }

  Anouncement.findById(ancId)
    .then((anc) => {
      if (!anc) return res.status(AncNotExist.status).send(AncNotExist.msg);

      anc.title = title;
      anc.content = content;
      anc.userId = userId;
      anc.group = groupId;

      anc
        .save()
        .then((saved) => res.json(saved)) // avoid execPopulate compatibility issues
        .catch(next);
    })
    .catch(next);
});

// @route   DELETE api/anouncements/:id
// @desc    Delete anouncement
// @access  Admin
router.delete('/:id', [auth, authAdmin], (req, res, next) => {
  const ancId = req.params.id;

  Anouncement.findById(ancId)
    .then((anc) => {
      if (!anc) return res.status(AncNotExist.status).send(AncNotExist.msg);

      anc
        .remove()
        .then(() => res.send(SuccessDelete.msg))
        .catch(next);
    })
    .catch(next);
});

module.exports = router;
