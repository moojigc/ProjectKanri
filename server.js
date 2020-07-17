const express = require("express"),
	session = require("express-session"),
	mongoose = require("mongoose"),
	MongoDBStore = require("connect-mongodb-session")(session),
	passport = require("./server/config/passport"),
	compression = require("compression"),
	{ join } = require("path"),
	cors = require("cors"),
	PORT = process.env.PORT || 3500,
	MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/projectkanri",
	productionEnv = process.env.NODE_ENV === "production";

// Connect to database
mongoose
	.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
	.then((conn) => {
		if (conn) console.log(`Connected to ${conn.connections[0].db.databaseName}`);
	})
	.catch(console.error);

// NPM package that automatically handles our user sessions in our Mongo database
const Store = new MongoDBStore({
	uri: MONGODB_URI,
	collection: "user-sessions"
});
Store.on("error", (error) => console.log(error));

const app = express();
// Server up the static files when in production (otherwise React dev server handles that)
if (productionEnv) app.use(express.static(join(__dirname, "client/build")));
app.use(express.urlencoded({ extended: true }))
	.use(express.json())
	// Allows cross-origin requests from our React dev server
	.use(cors({ credentials: true, origin: `http://localhost:3000` }))
	// Session middleware
	.use(
		session({
			secret: process.env.SESS_SECRET || "secret",
			resave: false,
			saveUninitialized: true,
			store: Store,
			cookie: {
				maxAge: 60000 * 60 * 24,
				sameSite: true,
				httpOnly: true,
				secure: false
			}
		})
	)
	// Init passport middleware
	.use(passport.initialize())
	.use(passport.session())
	// Send compressed files to client
	.use(compression());
// Set routes
require("./server/routes/user-routes")(app);
require("./server/routes/project-routes")(app);
require("./server/routes/task-router")(app);

if (productionEnv)
	app.get("*", (req, res) => {
		res.sendFile(join(__dirname, "client", "build", "index.html"));
	});
app.listen(PORT, (error) => {
	if (error) throw error;
	else console.log(`😀 Listening on port ${PORT}!`);
});
