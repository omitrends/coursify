## Create a course selling app

 - Initialize a new Node.js project
 - Add Express, jsonwebtoken, mongoose to it as a dependency 
 - Create index.js
 - Add route skeleton for user login, signup, purchase a course, sees all courses, sees the purchased courses course
 - Add routes for admin login, admin signup, create a course, delete a course, add course content.
 - Define the schema for User, Admin, Course, Purchase
 - Add a database (mongodb), use dotenv to store the database connection string
 - Add middlewares for user and admin auth
 - Complete the routes for user login, signup, purchase a course, see course (Extra points - Use express routing to better structure your routes)
 - Create the frontend


 Good to haves
  - Use cookies instead of JWT for auth
  - Add a rate limiting middleware
  - Frontend in ejs (low pri)
  - Frontend in React

## Deployment on Vercel

### Environment Variables Required
- `MONGO_URL`: Your MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation

### Steps for Deployment
1. Create a Vercel account if you don't have one
2. Install Vercel CLI: `npm i -g vercel`
3. Run `vercel` in the backend directory
4. Set up the environment variables in the Vercel dashboard
