# CoursePal
### Destination to all your learning needs

This site is an example MOOC website made as a mid-term project for PayPal VAP course. This project implements Authorization, Course Addition, Course Enrollment etc.

---
## Routes
All the routes in the websites can be categorized into following categories:
- General Routes:
  These routes are simple and contains not much meta information about the website. These includes:
    -   `/` - Home Route : Landing Page
    -   `/teacher` - Teacher Route : A route to welcome instructors on our portal
    -   `/unauthorised` - Unauthorized : Whenever user tries to access and authorized route but is not logged in, the page redirected to this page
    -   `/error` - Error : Whenever any error occurs the user is redirected to this route.
    -   `/*` - 404 Page Not found 
- Student/Teacher/Course:
  These routes are essential for the website and display information for each courses, login/signup page.
    - `/courses` - Courses : A page to display all the courses in the database
    - `/courses?q=` - Search Course : This is same route as before, it just enables user to search courses in the database.
    - `/course/new` - Add course : This route requires authorization and can only be accessed by a `Teacher`
    - `/course/:id` - Display course : This route displays all the information about specific course. The contents changes depending login status.
    - `/teacher/signup` - Teacher Signup : Signup Page for a Teacher. Show message if email is already taken.
    - `/teacher/login` - Teacher Login : Login page for a teacher. Shows message if password is incorrect.
    - `/student/signup` - Student Signup : Signup page for a Student. Shows message is email is alredy taken.
    - `/student/login` - Student Login : Login page for a Student. Shows message if password is incorrect
    - `/student/enroll/:id`- Enroll course : This webpage enrolls user in the course with given the course ID.
    - `/dashboard` - Dashboard : This is a common route for student and teacher and require authorization to access. Contents of this page changes depending on the login type.
  ---
  ## Modules Used
  Although you can find all the dependencies in the `package.json` file. Here, I am listing dependencies along with there use.
  - `bcrypt` : Used for encrypting and hashing the passwords. Storing plain-text password is always a bad idea.
  - `body-parser` : Used for parsing the data sent along the `request.body`
  - `cookie-parser` and `express-session` : These two are used for maintaining sessions and authorization of user.
  - `ejs` - Used for making templates.
  - `express` - Used for handling requests at the back-end
  - `faker` - This package is not required for production. It is only developement purpose for making fake data.
  - `mongoose` - Used for connecting MongoDB database.
  ---
  ## Install and Run
  For running this project, make sure you have `MongoDB` installed and `Mongo Demon` running in the background.
  
  Clone the Repo and run command `npm install .`This will install all the dependencies. 

  After this run command `node .` or `node app.js` The server will run on the port `3000`. Go to `localhost:3000` for viewing the website.