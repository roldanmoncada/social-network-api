const { Thought, User } = require('../models');

const userController = {
    getUsers(req, res) {
        User.find()
        .select('-__v')
        .then((allUsers) => {
            res.json(allUsers)
        })
        .catch((err) => {
            res.status(500).json(err)
        })
    },

    getSingleUser(req, res) {
        User.findOne({_id: req.params.userId})
        .select('-__v')
        .populate('friends')
        .populate('thoughts')
        .then((singleUserData) => {
            if (!singleUserData) {
                return res.status(404).json({ message: 'No user found!'})
            }
            res.json(singleUserData)
        })
        .catch((err) => {
            res.status(500).json(err)
        })
    },

    createUser(req, res) {
        User.create(req.body)
        .then((userData) => {
            res.json(userData)
        })
        .catch((err) => {
            res.status(500).json(err)
        })
    },

    updateUser(req, res) {
        User.findOneAndUpdate({
            _id: req.params.userId
        },
        {
            $set: req.body
        },
        {
            runValidators: true,
            new: true,
        })
        .then((updateData) => {
            if (!updateData) {
                return res.status(404).json({ message: 'No user found!'})
            }
            res.json(updateData)
        })
        .catch((err) => {
            res.status(500).json(err)
        })
    },

    deleteUser(req, res) {
        User.findOneAndDelete({_id: req.params.userId})
        .then((deletedUser) => {
            if (!deletedUser) {
                return res.status(404).json({ message: 'No user found!'})
            }
            return Thought.deleteMany({_id: {$in: deletedUser.thoughts}})
        })
        .then(() => {
            res.json({ message: 'User and thoughts successfully deleted!'})
        })
        .catch((err) => {
            res.status(500).json(err)
        })
    },

    addFriend(req, res) {
        User.findOneAndUpdate({
            _id: req.params.userId
        },
        {
            $addToSet: {friends: req.params.friendId}
        })
        .then((addFriendData) => {
            if (!addFriendData) {
                return res.status(404).json({ message: 'Could not add user!'})
            }
            res.json(addFriendData)
        })
        .catch((err) => {
            res.status(500).json(err)
        })
    },

    removeFriend(req, res) {
        User.findOneAndUpdate({
            _id: req.params.userId
        },
        {
            $pull: {friends: req.params.friendId}
        })
        .then((addFriendData) => {
            if (!addFriendData) {
                return res.status(404).json({ message: 'Could not add user!'})
            }
            res.json(addFriendData)
        })
        .catch((err) => {
            res.status(500).json(err)
        })
    }
}

module.exports = userController;