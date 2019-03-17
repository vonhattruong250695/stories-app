const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

exports.resolvers = {
	Query: {
		getCurrentUser: async (root, args, { currentUser, User }) => {
			// check empty currentUser
			if (!currentUser) {
				return null
			}
			const user = await User.findOne({ username: currentUser.username })
			return user 
		}
	},
	Mutation: {
		addStory: async (root, { title, 
								imageUrl,
								description, 
								text, 
								category 
							}, { currentUser, Story }) => {
			if (!currentUser) {
				throw new Error('Unauthorized')
			}
	
			const newStory = await new Story({
				title,
				description,
				text,
				imageUrl,
				category,
				author: currentUser.username
			}).save()

			return newStory
		},
		signupUser: async (root, { username, password, email }, { User }) => {
			// find user with username
			const user = await User.findOne({ username })
			if (user) {
				throw new Error('Username was used')
			}
			// create hash password
			const salt = bcrypt.genSaltSync(10)
			const hash_password = bcrypt.hashSync(password, salt)
			// save new user to database
			const newUser = new User({ 
				username, 
				password: hash_password, 
				email 
			})
			await newUser.save()
			// create token with user data
			const token = jwt.sign({ username, email }, process.env.SECRET, { expiresIn: '1d' })
			// return token to client
			return { token }
		},
		signinUser: async (root, { username, password }, { User }) => {
			// find user with username
			const user = await User.findOne({ username })
			if (!user) {
				throw new Error('User not found')
			}
			// check password and hash password is same
			const isMatch = bcrypt.compareSync(password, user.password)
			if (!isMatch) {
				throw new Error('Password invalid')
			}
			// create token with user data
			const token = jwt.sign(
				{ 
					username, email: user.email 
				}, 
				process.env.SECRET, 
				{ expiresIn: '1d'}
			)
			// return token to client
			return { token }
		}
	}
}