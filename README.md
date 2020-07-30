# ProjectKanri
> Developed by Moojig Battsogt, [Samantha Taddonio](https://github.com/stadds), and [Mahfuza Pia Rahman](https://github.com/mpiarahman16).

<img src="https://www.moojigbc.com/images/ProjectKanri.png" width=250px height=auto/>

## Description
*ProjectKanri* is a a project management web application, similar in concept to GitHub's Projects page. As a user, you can create a new project and populate it with subprojects or *tasks* as we call them. You can keep track of the status of those tasks, whether they're still to-do, in progress, in review, or completed. You can also, using email, invite other users to join your project and assign them to particular tasks. And you don't have to worry about bad actors wreaking havoc on your project - you can set different permissions for users (admin or regular) so they can only edit tasks they're assigned to or have created.

## Tools
**On the back end**: Built on `Node.js`, `Express.js`, `Passport.js` for user authentication, `Mongoose` to manage our MongoDB database, and `Nodemailer` to send emails using Gmail. **On the front end**: Built on `React.js` using `create-react-app`, and `Material UI` as the UI framework, with some minor custom `SCSS`. 

## Try it out
Head over to [ProjectKanri](https://projectkanri.herokuapp.com) today to sign up for an account and start tracking your next project's progress! (Guest account for demoing coming soon).

## The Team
**Moojig**: All aspects of user authentication on back and front end, including setting up Express middleware to track user sessions. Created the schema for the Mongoose database models, optimizing our API endpoints and adding in checks for admin/non-admin users on PUT and DELETE routes for projects/tasks. Created some pages on the front end: `Welcome` page, `Profile` page, `Login` page, and `Comments` component for the `Task` page.

**Samantha**: `/api/projects` endpoints, creating the `Dashboard` and `Project` pages, and creating the front end API interactions for the `Project` and `Dashboard` pages.

**Pia**: Creating the `Task` page, set up front end API interactions for `tasks` and setting up back end `/api/tasks` endpoints.
