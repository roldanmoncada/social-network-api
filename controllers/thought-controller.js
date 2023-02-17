const { Thought, User } = require('../models');

const thoughtController = {
    getThoughts(req, res) {
        Thought.find()
        .sort({createAt: -1})
        .then((allThoughts) => {
            res.json(allThoughts)
        })
        .catch((err) => {
            res.status(500).json(err)
        })
    },

    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId})
        .then((singleThoughtData) => {
            if (!singleThoughtData) {
                return res.status(404).json({ message: "No thought found!"})
            }
            res.json(singleThoughtData)
        })
        .catch((err) => {
            res.status(500).json(err)   
        })
    },

    createThought(req, res) {
        Thought.create(req.body)
        .then((createdThoughtData) => {
            return User.findOneAndUpdate(
                {
                    _id: req.body.userId
                },
                {
                    $push: {thoughts: createdThoughtData._id}
                },
                {
                    new: true
                },
            )
        })
        .then((singleUserData) => {
            if (!singleUserData) {
                return res.status(400).json({ message: 'No user found!'})
            }
            res.json({message: 'Thought successfully created!!'})
        })
        .catch((err) => {
            res.status(500).json(err)
        })
    },

    updateThought(req, res) {
        Thought.findOneAndUpdate({ _id: req.params.thoughtId}, {$set: req.body}, {runValidators: true, new: true})
        .then((updatedThoughtData) => {
            if (!updatedThoughtData) {
                return res.status(404).json({ message: 'Could not update thought'})
            }
            res.json(updatedThoughtData, { message: 'Thought updated successfully'})
        })
        .catch((err) => {
            res.status(500).json(err)
        })
    },

    deleteThought(req, res) {
        Thought.findOneAndDelete({ _id: req.params.thoughtId})
        .then((deletedThoughtData) => {
            if (!deletedThoughtData) {
                return res.status(404).json({ message: 'No thought to delete!'})
            }
            return User.findOneAndUpdate(
                {thoughts: req.params.thoughtId}, {$pull: {thoughts: req.params.thoughtId}}, { new: true}
            )
        })
        .then((deletedThoughtData) => {
            if (!deletedThoughtData) {
                return res.status(404).json({message: 'Thought created but could not find user with specified ID'})
            }
            res.json({message: 'Thought deleted successfully!'})
        })
        .catch((err) => {
            res.status(500).json(err)
        })
    },

    addReaction(req, res) {

    },

    removeReaction(req, res) {
        
    }
}

module.exports = thoughtController;