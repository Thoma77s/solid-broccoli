const { User, Book } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
  me: async (parent, args, context) => {
    if (context.user) {
      const userData = await User.findOne({ _id: context.user._id })
      .select('-__v -password')
      return userData;
    }
    throw new AuthenticationError('You are not logged in!');
  }
},
Mutation: {
  addUser: async (parent, args) => {
    const user = await User.create(args);
    const token = signToken(user);

    return { token, user };
  },
  login: async (parent, { email, password }) => {
    const user = await User.findOne( { email });
    if (!user) {
      throw new AuthenticationError('Invalid login information');
    }
    const token = signToken(user);
    return { token, user };
  },
  saveBook: async (parent, { book }, context) => {
    if (context.user) {
      const updatedUser = await User.findOneAndUpdate(
        {_id: context.user._id},
        { $pull: { savedBooks: { bookId: bookId } } },
        { new: true }
      )
      return updatedUser;
    }
  },
  removeBook: async (parent, args, context) => {
    if(context.user) {
      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $pull: { savedBooks: { bookId: args.bookId } } },
        { new: true }
      );
      return updatedUser
    }
    throw new AuthenticationError('You must be logged in!');
  }
}
};

module.exports = resolvers