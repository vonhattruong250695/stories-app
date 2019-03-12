// add modules
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

// add graphql modules
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express')
const { makeExecutableSchema } = require('graphql-tools')
const { typeDefs } = require('./schema')
const { resolvers } = require('./resolvers')

// mongoose models
const User = require('./models/User')

// config environment
dotenv.config()

// connect MongoDB
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true })
	.then(() => console.log('MongoDB connected'))
	.catch((err) => console.log(err))


const schema = makeExecutableSchema({ typeDefs, resolvers })

const app = express()

const PORT = process.env.PORT || 5000

// allow client connect to server
app.use(cors())

// add middlewate to check header request
app.use(async (req, res, next) => {
	const token = req.headers.authorization

	if (token && token !== null) {
		try {
			const currentUser = await jwt.verify(token, process.env.SECRET)
			req.currentUser = currentUser
		} catch (err) {
			console.log(err)
		}
	}

	return next()
})

app.use('/graphql', bodyParser.json(), graphqlExpress({
	schema
}))

app.use('/graphiql', graphiqlExpress({
	endpointURL: '/graphql'
}))

// run server
app.listen(PORT, 
	() => console.log(`Server is running on port ${PORT}`))
