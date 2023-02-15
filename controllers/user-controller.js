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
                return status(404).json({ message: 'No user found!'})
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

    },

    deleteUser(req, res) {

    },

    addFriend(req, res) {

    },

    removeFriend(req, res) {
        
    }
}

module.exports = userController;