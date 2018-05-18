const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')

async function login(parent, args, context, info) {
  const user = await context.db.query.user({ where: { email: args.email } }, `{ id password }`)
  if (!user) {
    throw new Error('Sorry, we couldn\'t find a user with that name.')
  }

  const valid = await bcrypt.compare(args.password, user.password)
  if (!valid) {
    throw new Error('Sorry, that\'s not the right password.')
  }

  return {
    token: jwt.sign({ userId: user.id }, APP_SECRET),
    user,
  }
}

async function signup(parent, args, context, info) {
  const password = await bcrypt.hash(args.password, 10)
  const user = await context.db.mutation.createUser({
    data: { ...args, password },
}, `{ id }`)

  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  return {
    token,
    user,
  }
}

function deleteLink(parent, args, context, info) {
  return context.db.mutation.deleteLink({
    data: {
      id: args.id,
    },
  }, info)
}

function postLink(parent, args, context, info) {
  const userId = getUserId(context)

  // Create the new link to add to the feed
  return context.db.mutation.createLink(
    {
      data: {
        url: args.url,
        description: args.description,
        postedBy: { connect: { id: userId } },
      },
    },
    info,
  )
}

function updateLink(parent, args, context, info) {
  return context.db.mutation.updateLink({
    data: {
      url: args.url,
      description: args.description,
    },
  }, info)
}

module.exports = {
  login,
  postLink,
  signup,
  updateLink,
}