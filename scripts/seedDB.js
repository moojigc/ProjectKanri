const mongoose = require("mongoose");
const db = require("../server/models");

// This file empties the Users collection and inserts the books below

const users = [
	{
		firstName: "Moojig",
		lastName: "Battsogt",
		email: "moojigc@gmail.com",
		username: "admin.moojig",
		password: "password"
	},
	{
		firstName: "Pia",
		lastName: "Rahman",
		email: "admin.pia@test.com",
		username: "admin.pia",
		password: "password"
	},
	{
		firstName: "Sam",
		lastName: "Taddonio",
		email: "admin.sam@test.com",
		username: "admin.sam",
		password: "password"
	},
	{
		firstName: "Sam",
		lastName: "T",
		email: "user.sam@test.com",
		username: "user.sam",
		password: "password"
	},
	{
		firstName: "Pia",
		lastName: "R",
		email: "user.pia@test.com",
		username: "user.pia",
		password: "password"
	},
	{
		firstName: "Moojig",
		lastName: "B",
		email: "moojig@nyu.edu",
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

	for (let i = 0; i < 17; i++) {
		let randCreate = Math.floor(Math.random() * creators.length);
		let randAssign = Math.floor(Math.random() * creators.length);
		let rand1 = Math.floor(Math.random() * theComments.length);
		let rand2 = Math.floor(Math.random() * theComments.length);
		let statuses = ["New", "To Do", "In Progress", "In Review", "Completed"];

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

	return newTasks.slice(0, 8).map(t => {
		return {
			...t,
			project: mongoose.Types.ObjectId("5f09ccf5d7876449bc981718")
		}
	}).concat(newTasks.slice(9, 17).map(t => {
		return {
			...t,
			project: mongoose.Types.ObjectId("5f09ccf5d7876449bc981714"),
		}
	}))
};

const projects = (theUsers, theTasks) => {
	return [
		{
			_id: mongoose.Types.ObjectId("5f09ccf5d7876449bc981718"),
			title: "Keikaku",
			description: "Project to do projects",
			tasks: theTasks.slice(0, 8),
			admins: [theUsers[0]._id],
			members: theUsers.slice(0, 4).map((u) => u._id),
			creator: theUsers[0]._id
		},
		{
			_id: mongoose.Types.ObjectId("5f09ccf5d7876449bc981714"),
			title: "Sakusen",
			description: "Project for tactics",
			tasks: theTasks.slice(9, 17),
			admins: [theUsers[1]._id],
			members: theUsers.slice(0, 4).map((u) => u._id),
			creator: theUsers[1]._id
		}
	];
};

const populateEverything = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/projectkanri");
		//delete and create users
		await db.User.deleteMany({});
		let newUsers = users.map(async (u) => await new db.User(u).encryptPass());
		let promises = await Promise.all(newUsers);
		let insertUsers = await db.User.insertMany(promises);

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
		await db.Project.deleteMany();
		return await db.Project.insertMany(dbProjects);
	} catch (error) {
		return error;
	} finally {
		await mongoose.disconnect();
	}
};

populateEverything().then((res) => console.log(res));
