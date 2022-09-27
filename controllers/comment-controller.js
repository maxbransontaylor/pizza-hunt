const { Comment, Pizza } = require("../models");

const commentController = {
  addComment({ params, body }, res) {
    console.log(body);
    Comment.create(body)
      .then(({ _id }) => {
        return Pizza.findOneAndUpdate(
          { _id: params.pizzaId },
          { $push: { comments: _id } },
          { new: true }
        ).then((dbPizzaData) => {
          if (!dbPizzaData) {
            console.log("no pizza found");
          }
          res.json(dbPizzaData);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  },
  removeComment({ params }, res) {
    Comment.findOneAndDelete({ _id: params.commentId })
      .then((deletedComment) => {
        if (!deletedComment) {
          console.log("couldnt find");
          return;
        }
        return Pizza.findOneAndUpdate(
          { _id: params.pizzaId },
          { $pull: { comments: params.commentId } },
          { new: true }
        );
      })
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this id!" });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => console.log(err));
  },
};

module.exports = commentController;
