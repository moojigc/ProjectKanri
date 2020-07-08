const mongoose = require("mongoose");
const db = require("../server/models");

// This file empties the Books collection and inserts the books below

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/projectkanri");

const users = [
  {
    email: "admin.moojig@test.com",
    username: "admin.moojig",
    password: "password",
  },
  {
    email: "admin.pia@test.com",
    username: "admin.pia",
    password: "password",
  },
  {
    email: "admin.sam@test.com",
    username: "admin.sam",
    password: "password",
  },
  {
    email: "user.sam@test.com",
    username: "user.sam",
    password: "password",
  },
  {
    email: "user.pia@test.com",
    username: "user.pia",
    password: "password",
  },
  {
    email: "user.moojig@test.com",
    username: "user.moojig",
    password: "password",
  },
];

const comments = (userOne, userTwo) => {
  let randomOne = Math.floor(Math.random() * 100);
  let randomTwo = Math.floor(Math.random() * 100);

  return [
    {
      body: `TEST COMMENT: RANDOM ${randomOne} `,
      creator: userOne._id,
    },
    {
      body: `test comment: random ${randomTwo} `,
      creator: userTwo._id,
    },
  ];
};

const tasks = (creators, theComments) => {
  let newTasks = [];

  for (let i = 1; i < 17; i++) {
    let randCreate = Math.floor(Math.random() * creators.length);
    let randAssign = Math.floor(Math.random() * creators.length);
    let rand1 = Math.floor(Math.random() * theComments.length);
    let rand2 = Math.floor(Math.random() * theComments.length);

    let tmpObj = {
      title: `Task ${i}`,
      description: `This is a test description for task ${i}`,
      comments: [theComments[rand1]._id, theComments[rand2]._id],
      creator: creators[randCreate]._id,
      assignedUser: creators[randAssign]._id,
    };

    newTasks.push(tmpObj);
  }

  return newTasks;
};

const projects = (thesUsers, theTasks) => {
  return [
    {
      title: "Keikaku",
      description: "Project to do projects",
      tasks: ,
      admins: ,
      members: ,
      creator: 
    },
    {
      title: "Sakuse",
      description: "Project for tactics",
      tasks: ,
      admins: ,
      members: ,
      creator: 
    }

  ]
}

const populateEverything = async () => {
  try {
    //delete and create users
    let insertUsers = await db.User.remove({}).insertMany(users);

    //create comments
    let commentsOne = comments(insertUsers[0], insertUsers[1]);
    let commentsTwo = comments(insertUsers[2], insertUsers[3]);
    let commentsThree = comments(insertUsers[4], insertUsers[5]);
    //store in one array
    let allComments = commentsOne.concat(commentsTwo).concat(commentsThree);
    //delete and insert Comments
    let insertComments = await db.TaskComment.remove({}).insertMany(
      allComments
    );

    let seedTasks = tasks(insertUsers, insertComments);
    let insertTasks = await db.Task.remove({}).insertMany(seedTasks);


  } catch (error) {
    console.error(error);
  }
};
