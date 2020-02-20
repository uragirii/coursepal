# CoursePal
### Destination to all your learning needs

This site is an example MOOC website made as a mid-term project for PayPal VAP course. This project implements Authorization, Course Addition, Course Enrollment etc.

![CoursePal](/screenshots/home_1.png)
---
## Routes
All the routes in the websites can be categorized into following categories:
- General Routes:
  These routes are simple and contains not much meta information about the website. These includes:
    -   [`/`](/screenshots/home_1.png) - Home Route : Landing Page
    -   [`/teacher`](/screenshots/teacher_1.png) - Teacher Route : A route to welcome instructors on our portal
    -   [`/unauthorised`](/screenshots/unauth.png) - Unauthorized : Whenever user tries to access and authorized route but is not logged in, the page redirected to this page
    -   [`/error`](/screenshots/error.png) - Error : Whenever any error occurs the user is redirected to this route.
    -   [`/*`](/screenshots/404.png) - 404 Page Not found 
- Student/Teacher/Course:
  These routes are essential for the website and display information for each courses, login/signup page.
    - [`/courses`](/screenshots/courses.png) - Courses : A page to display all the courses in the database
    - [`/courses?q=`](/screenshots/search.png) - Search Course : This is same route as before, it just enables user to search courses in the database.
    - [`/course/new`](/screenshots/new_course.png) - Add course : This route requires authorization and can only be accessed by a `Teacher`
    - [`/course/:id`](/screenshots/course.png) - Display course : This route displays all the information about specific course. The contents changes depending login status.
    - [`/teacher/signup`](/screenshots/teacher_signup.png) - Teacher Signup : Signup Page for a Teacher. Show message if email is already taken.
    - [`/teacher/login`](/screenshots/signin.png) - Teacher Login : Login page for a teacher. Shows message if password is incorrect.
    - [`/student/signup`](/screenshots/student_signup.png) - Student Signup : Signup page for a Student. Shows message is email is alredy taken.
    - [`/student/login`](/screenshots/signin.png) - Student Login : Login page for a Student. Shows message if password is incorrect
    - `/student/enroll/:id`- Enroll course : This webpage enrolls user in the course with given the course ID.
    - [`/dashboard`](/screenshots/teacher_dashboard.png) - Dashboard : This is a common route for student and teacher and require authorization to access. Contents of this page changes depending on the login type.
- API routes/Data seed routes : These routes can be used to create fake data for students/teachers/courses.
  - `/api/seed/student/:times` - Generate Student data : It generates "`times`" number of fake students in the database.
  - `/api/seed/teacher/:times` - Generate Teacher data : It generates "`times`" number of fake teachers in the database.
  - `/api/seed/course/new` - Generates course : It creates a new course in the database.
  
  Please note that password for all the fake accounts will be `password`.
  
  ---
  ## Modules Used
  Although you can find all the dependencies in the `package.json` file. Here, I am listing dependencies along with there use.
  - [`bcrypt`](https://www.npmjs.com/package/bcrypt) : Used for encrypting and hashing the passwords. Storing plain-text password is always a bad idea.
  - [`body-parser`](https://www.npmjs.com/package/body-parser) : Used for parsing the data sent along the `request.body`
  - [`cookie-parser`](https://www.npmjs.com/package/cookie-parser) and [`express-session`](https://www.npmjs.com/package/express-session) : These two are used for maintaining sessions and authorization of user.
  - [`ejs`](https://www.npmjs.com/package/ejs) - Used for making templates.
  - [`express`](https://www.npmjs.com/package/express) - Used for handling requests at the back-end
  - [`faker`](https://www.npmjs.com/package/faker) - This package is not required for production. It is only developement purpose for making fake data.
  - [`mongoose`](https://www.npmjs.com/package/mongoose) - Used for connecting MongoDB database.
  ---
  ## Install and Run
  For running this project, make sure you have `MongoDB` installed and `Mongo Demon` running in the background.
  
  Clone the Repo and run command `npm install .`This will install all the dependencies. 

  After this run command `node .` or `node app.js` The server will run on the port `3000`. Go to `localhost:3000` for viewing the website.
  
 ---
 ## Screenshots
 You can view screenshots for each route by clicking on the [routes](https://github.com/uragirii/coursepal#routes). For some pages multiple screenshots are present. You can view all the screenshots in the [`screenshots`](/screenshots) directory. 
