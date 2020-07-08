const mongoose = require("mongoose");
const db = require("../server/models");

// This file empties the Users collection and inserts the books below

const users = [
	{
		email: "admin.moojig@test.com",
		username: "admin.moojig",
		password: "password"
	},
	{
		email: "admin.pia@test.com",
		username: "admin.pia",
		password: "password"
	},
	{
		email: "admin.sam@test.com",
		username: "admin.sam",
		password: "password"
	},
	{
		email: "user.sam@test.com",
		username: "user.sam",
		password: "password"
	},
	{
		email: "user.pia@test.com",
		username: "user.pia",
		password: "password"
	},
	{
		email: "user.moojig@test.com",
		username: "user.moojig",
		password: "password"
	}
];

const comments = (userOne, userTwo) => {
	let randomOne = Math.floor(Math.random() * 100);
	let randomTwo = Math.floor(Math.random() * 100);

	return [
		{
			body: `TEST COMMENT: RANDOM ${randomOne} `,
			creator: userOne._id
		},
		{
			body: `test comment: random ${randomTwo} `,
			creator: userTwo._id
		}
	];
};

const tasks = (creators, theComments) => {
	let newTasks = [];

	for (let i = 1; i < 17; i++) {
		let randCreate = Math.floor(Math.random() * creators.length);
		let randAssign = Math.floor(Math.random() * creators.length);
		let rand1 = Math.floor(Math.random() * theComments.length);
		let rand2 = Math.floor(Math.random() * theComments.length);
		let statuses = ["New To Do", "In Progress", "In Review", "Completed"];

		let tmpObj = {
			title: `Task ${i}`,
			description: `This is a test description for task ${i}`,
			comments: [theComments[rand1]._id, theComments[rand2]._id],
			creator: creators[randCreate]._id,
			assignedUser: creators[randAssign]._id,
			status: statuses[Math.floor(Math.random() * 3)]
		};

		newTasks.push(tmpObj);
	}

	return newTasks;
};

const projects = (theUsers, theTasks) => {
	return [
		{
			title: "Keikaku",
			description: "Project to do projects",
			tasks: theTasks,
			admins: [theUsers[0]._id],
			members: theUsers.slice(1).map((u) => u._id),
			creator: theUsers[0]._id
		},
		{
			title: "Sakusen",
			description: "Project for tactics",
			tasks: theTasks,
			admins: [theUsers[0]._id],
			members: theUsers.slice(1).map((u) => u._id),
			creator: theUsers[0]._id
		}
	];
};

const populateEverything = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/projectkanri");
		//delete and create users
		await db.User.deleteMany({});
		let insertUsers = await db.User.insertMany(users);

		//create comments
		let commentsOne = comments(insertUsers[0], insertUsers[1]);
		let commentsTwo = comments(insertUsers[2], insertUsers[3]);
		let commentsThree = comments(insertUsers[4], insertUsers[5]);
		//store in one array
		let allComments = commentsOne.concat(commentsTwo).concat(commentsThree);
		//delete and insert Comments
		await db.TaskComment.deleteMany({});
		let insertComments = await db.TaskComment.insertMany(allComments);

		let seedTasks = tasks(insertUsers, insertComments);
		await db.Task.deleteMany({});
		let insertTasks = await db.Task.insertMany(seedTasks);
		let dbProjects = projects(
			insertUsers,
			insertTasks.map((t) => t._id)
		);
		return await db.Project.insertMany(dbProjects);
	} catch (error) {
		return error;
	} finally {
		await mongoose.disconnect();
	}
};

populateEverything().then((res) => console.log(res));
