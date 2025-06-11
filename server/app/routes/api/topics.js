const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

// Models
const Topic = require('../../models/Topic');
const Page = require('../../models/Page');
const modelName = 'topic';

// Errors
const topicMessages = require('../../messages/topics');
const pageMessages = require('../../messages/pages');
const authAdmin = require('../../middleware/authAdmin');
const { SuccessDelete, PageRequired, ItemDetailsRequired, 
    LinkDetailsRequired, TopicNotExist, ItemNotExist, 
    CommentNotOwned, CommentNotExist, 
    CannotLikeOwnComment } = topicMessages;
const { PageNotExist, SubpageNotExist } = pageMessages;

// @route   GET api/topics/:id
// @desc    Get topic by id
// @access  Private
router.get('/:id', auth, (req, res, next) => {
    const topicId = req.params.id;

    Topic.findById(topicId)
        .then(topic => {
            if(!topic) return res.status(TopicNotExist.status).send(TopicNotExist.msg);
            
            return res.send(topic);
        })
        .catch(next)
})

// @route   GET api/topics
// @desc    Get all topics
// @access  Private
router.get('/', auth, (req, res, next) => {
    Topic.find()
         .then(topic => res.json(topic))
         .catch(next)
})

// @route   POST api/topics
// @desc    Create new topic
// @access  Admin
router.post('/', [auth,authAdmin], (req, res, next) => {
    const { 
        name,
        description,
        url,
        parentId,
        pageId
    } = req.body;

    res.locals.model = modelName;

    if(!pageId) 
        return res.status(PageRequired.status)
                  .send(PageRequired.msg)

    // Check that page assigned exists
    Page.findById(pageId)
        .then(page => {
            if(!page) 
            return res.status(PageNotExist.status)
                      .send(PageNotExist.msg)

            Topic.findById(parentId)
                 .then(topic => {
                    if(!topic && parentId) 
                        return res.status(TopicNotExist.status).send(TopicNotExist.msg)

                    const newTopic = new Topic({
                        name: name,
                        description: description,
                        url: url,
                        parent: parentId,
                        page: pageId
                    })
        
                    newTopic.save()
                            .then(topic => {
                                return res.send(topic)
                            })
                            .catch(next)
                    })
                    .catch(next);
        })
        .catch(next)
})

// @route   PUT api/topics/:id
// @desc    Update topic details
// @access  Admin
router.put('/:id', [auth, authAdmin], (req, res, next) => {
    const { 
        name,
        description,
        url,
        parentId } = req.body;

    res.locals.model = modelName;

    const topicId = req.params.id;

    Topic.findById(topicId)
         .then(topic => {
            if(!topic) 
                return res.status(TopicNotExist.status)
                          .send(TopicNotExist.msg)
            
            Topic.findById(parentId)
                 .then(parentTopic => {
                    if(!parentTopic && parentId)
                      return res.status(TopicNotExist.status).send(TopicNotExist.msg)
              
                    topic.name = name;
                    topic.description = description;
                    topic.url = url,
                    topic.parent = parentId

                    topic.save()
                        .then(topic => {
                            return res.send(topic);
                        })
                        .catch(next);
                 })
                 .catch(next);
         })
         .catch(next);
})

// @route   PUT api/topics/:id/item
// @desc    Create new item
// @access  Admin
router.put('/:id/item', [auth, authAdmin], (req, res, next) => {
    const { 
        name,
        icon,
        link
    } = req.body;

    res.locals.model = modelName;
    const topicId = req.params.id;

    if(!name)
        return res.status(ItemDetailsRequired.status).send(ItemDetailsRequired.msg)

    Topic.findById(topicId)
         .then(topic => {
             if(!topic) return res.status(TopicNotExist.status).send(TopicNotExist.msg)

             const newItem = {
                 name: name,
                 icon: icon,
                 link: link
             }

             topic.items.push(newItem)
             topic.save()
                  .then(topic => {
                      return res.send(topic)
                  })
                  .catch(next);
         })
         .catch(next);
})


// @route   PUT api/topics/:id/item/:itemId
// @desc    Update item
// @access  Admin
router.put('/:id/:itemId', [auth, authAdmin], (req, res, next) => {
    const { 
        name,
        icon,
        link 
    } = req.body;

    res.locals.model = modelName;
    const topicId = req.params.id;
    const itemId = req.params.itemId

    if(!name)
        return res.status(ItemDetailsRequired.status).send(ItemDetailsRequired.msg)

    Topic.findById(topicId)
         .then(topic => {
            if(!topic) return res.status(TopicNotExist.status).send(TopicNotExist.msg)
        
            const item = topic.items.id(itemId)
            if(!item)
                return res.status(ItemNotExist.status).msg(ItemNotExist.msg)
            
            item.set({
                name: name,
                icon: icon,
                link: link
            })

            topic.save()
                 .then(topic => {
                     return res.send(topic)
                 })
                 .catch(next)
         })
         .catch(next);
})

// @route   PUT api/topics/:id/:itemId/toggleUpvote
// @desc    Toggle upvote of item
// @access  Private
router.put('/:id/:itemId/toggleUpvote', auth, (req, res, next) => {
    const topicId = req.params.id
    const itemId = req.params.itemId
    const userId = res.locals.user.id

    Topic.findById(topicId)
         .then(topic => {
            if(!topic)
                return res.status(TopicNotExist.status).send(TopicNotExist.msg)
            
            const item = topic.items.id(itemId)
            if(!item)
                return res.status(ItemNotExist.status).send(ItemNotExist.msg)
        
            // Check if user has already upvoted the item
            const { upvotes, downvotes } = item 
            const upvoteIndex = upvotes.findIndex(upvote => 
                String(upvote) === userId) 
        
            // If user has already upvoted
            if(upvoteIndex !== -1) {
                upvotes.splice(upvoteIndex, 1)
            }

            /* If user hasn't upvoted, check if they downvoted, 
                and remove from downvotes */
            else {
                const downvoteIndex = downvotes.findIndex(downvote => 
                    String(downvote) === userId)

                if(downvoteIndex !== -1) {
                    downvotes.splice(downvoteIndex, 1)
                }

                upvotes.push(userId)
            }

            topic.save()
                .then(topic => {
                    return res.send({
                        downvotes,
                        upvotes
                    })
                })
                .catch(next);
         })
         .catch(next);
})


// @route   PUT api/topics/:id/:itemId/toggleDownvote
// @desc    Toggle downvote of item
// @access  Private
router.put('/:id/:itemId/toggleDownvote', auth, (req, res, next) => {
    const topicId = req.params.id
    const itemId = req.params.itemId
    const userId = res.locals.user.id

    Topic.findById(topicId)
         .then(topic => {
            if(!topic)
                return res.status(TopicNotExist.status).send(TopicNotExist.msg)
            
            const item = topic.items.id(itemId)
            if(!item)
                return res.status(ItemNotExist.status).send(ItemNotExist.msg)
        
            // Check if user has already downvoted or upvoted the item
            const { upvotes, downvotes } = item;
            const downvoteIndex = downvotes.findIndex(downvote => 
                String(downvote) === userId) 
        
            // If user has already downvoted
            if(downvoteIndex !== -1) {
                downvotes.splice(downvoteIndex, 1)
            }

            /* If user hasn't downvoted, check if they upvoted, 
                and remove from downvotes */
            else {
                const upvoteIndex = upvotes.findIndex(upvote => 
                    String(upvote) === userId)

                if(upvoteIndex !== -1) {
                    upvotes.splice(upvoteIndex, 1)
                }

                downvotes.push(userId)
            }

            topic.save()
                .then(topic => {
                    return res.send({
                        upvotes,
                        downvotes
                    })
                })
                .catch(next);
         })
         .catch(next);
})


// @route   PUT api/topics/:id/:itemId/remove
// @desc    Remove item
// @access  Admin
router.put('/:id/:itemId/remove', [auth, authAdmin], (req, res, next) => {

    const topicId = req.params.id;
    const itemId = req.params.itemId;

    Topic.findById(topicId)
    .then(topic => {
       if(!topic) return res.status(TopicNotExist.status).send(TopicNotExist.msg)
   
       const item = topic.items.id(itemId)
       if(!item)
           return res.status(ItemNotExist.status).send(ItemNotExist.msg)
       
       item.remove()
       topic.save()
            .then(topic => {
                return res.send(topic)
            })
            .catch(next)
    })
    .catch(next);
})


// @route   DELETE api/topics/:id
// @desc    Delete topic
// @access  Admin
router.delete('/:id', [auth, authAdmin], (req, res, next) => {

    const topicId = req.params.id;

    Topic.findById(topicId)
        .then(topic => {
            if(!topic) return res.status(TopicNotExist.status).send(TopicNotExist.msg);

            // Delete ref from children
            topic.remove()
                 .then(() => {
                     res.send(SuccessDelete.msg)
                 })
                 .catch(next);
            })
            .catch(next);
})



module.exports = router;
