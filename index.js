const { ADDRGETNETWORKPARAMS } = require("dns"),
  express = require("express"),
  query_js = require(__dirname + "/js/query"),
  session = require("express-session");

const app = express(),
  path = require("path"),
  bodyParser = require("body-parser"),
  flash = require("connect-flash");

const swal = require("sweetalert2");
global.__basedir = __dirname;

app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(
  session({
    cookie: { maxAge: 500000 },
    secret: "woot",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());

const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy;
const { nextTick } = require("process");

app.use(passport.initialize());
app.use(passport.session());

const db = query_js.db;
var staff_id = null,
  Username = null,
  updates = null,
  results = 0;

// error handling
passport.use(
  new LocalStrategy(function (Username, password, done) {
    db.query(
      "select * from staff where Username='" + Username + "'     ",
      function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: "Incorrect user name" });
        } else if (user[0].password != password) {
          return done(null, false, { message: "Incorrect password" });
        }
        return done(null, user[0]);
      }
    );
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.Username);
});

passport.deserializeUser(function (id, done) {
  // console.log(id);
  db.query(
    "select * from staff where Username='" + id + "'     ",
    function (err, user) {
      done(err, user[0]);
    }
  );
});

//Home Route
app.get("/", (req, res) => {
  res.render(path.join(__dirname, "/public/views/login"));
});

//Sign In Route
app.post(
  "/auth",
  passport.authenticate("local", {
    failureRedirect: "/",
    failureFlash: "Invalid Credentials",
  }),
  (req, res) => {
    query_js.check_admin_status(req.body.username, (result) => {
      redirect_page = result == 0 ? "/staff" : "/admin";
      Username = req.body.Username;
      return res.redirect(redirect_page);
    });
  }
);

var msg = 0;

//Admin Route
app.get("/admin", (req, res) => {
  if (!req.user) {
    // not logged-in
    res.redirect("/");
    return;
  }
  res.render(path.join(__dirname, "/public/views", "admin"));
});

//Staff Route
app.get("/staff", (req, res) => {
  if (!req.user) {
    // not logged-in
    res.redirect("/");
    return;
  }
  res.render(path.join(__dirname, "/public/views", "staff"));
});

// Authentication function
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}
app.get("/s_courses", function (req, res, next) {

  var usid=req.user.Username;
  if (!req.user) {
    // not logged-in
    res.redirect("/");
    return;
  }
  var sql = "select A.* from course A where A.Staff_ID in ( select B.Staff_ID from staff B where B.Username ='" + usid + "'     )";
  db.query(sql, function (err, data, fields) {
    if (err) throw err;
    res.render("s_courses", { title: "CourseList", userData: data });
  });
});

app.get("/marks_display/:id", ensureAuthenticated, (req, res) => {
  CID = req.params.id;
  // console.log(CID);
  var sql = "SELECT * from exammarks where(Course_ID = ?)";
  db.query(sql, [CID], (err, results, fields) => {
        if (err) 
          req.flash("message", []);
        else if (results.length != 0) req.flash("message", results);
          // console.log(results);
        res.redirect("/marks_display");
      });
    });
//Courses Table Route
app.get("/course_table/", ensureAuthenticated, (req, res) => {
  dept = req.params.id;
  var sql = "SELECT * from course";
  db.query(sql, (err, results, fields) => {
    if (err)
      //throw err;
      req.flash("message", []);
    else if (results.length != 0) req.flash("message", results);
    // console.log(results);
    res.redirect("/course_display");
  });
});

//db-Generate Route
require("./js/db.js");

//Excel-Upload Route
require("./public/routes/excel/upload.js")(app, db, query_js);

//Courses-Admin Route
require("./public/routes/admin/courses.js")(app, db, query_js);

//Staffs-Admin Route
require("./public/routes/admin/staffs.js")(app, db, query_js);

//Marks-Admin Route
require("./public/routes/admin/marks.js")(app, db, query_js);

//Students-Admin Route
require("./public/routes/admin/students.js")(app, db, query_js);

//Logout Route
require("./public/routes/logout.js")(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(PORT));
