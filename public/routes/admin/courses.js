//  Courses  //
const path = require("path");

module.exports = function (app, db, query_js) {
  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/");
  }

  //Views in public/views
  app.set("views", "./public/views");

  var courses_error = 0,
    updates = 0,
    dept;

  //Courses Table Display
  app.get("/course_display", ensureAuthenticated, (req, res) => {
    db.query("SELECT * from course", (err, results, fields) => {
      res.render("course_display", {
        data: results,
        result: req.flash("result"),
        update: updates,
      });
      result = 0;
      updates = 0;
    });
  });

  //Courses Table Delete
  app.get("/course_table/delete/:id", ensureAuthenticated, (req, res) => {
    var sql = "Delete from course where Course_ID = ?";
    db.query(sql, [req.params.id], (err, result) => {
      if (err)
        //throw err;
        req.flash("result", 1);
      else req.flash("result", 2);

      res.redirect("/course_table");
    });
  });

  //Courses Edit
  app.post("/edit_course", (req, res) => {
    let course_details = {
      Course_ID: String(
        req.body.Course_Code +
          req.body.Department +
          req.body.Regulation +
          req.body.Staff_ID
      ),
      Staff_ID: req.body.Staff_ID,
      Course_Code: req.body.Course_Code,
      Course_Name: req.body.Course_Name,
      Semester: Number(req.body.Semester),
      Year: Number(req.body.Year),
      Department: req.body.Department,
      Regulations: req.body.Regulation,
    };

    query_js.update_course(course_details, (result) => {
      if (result) {
        //To Replace by Flash
        updates = 1;
        res.redirect("/course_table");
      } else {
        updates = 2;
        res.redirect("/course_table");
      }
    });
  });

  //Course Entry Route
  app.get("/course_entry", ensureAuthenticated, (req, res) => {
    res.render(path.join("course_entry"), {
      msg: courses_error,
    });
    courses_error = 0;
  });

  //Add Course
  app.post("/add_course", (req, res) => {
    let course_details = {
      Course_ID: String(
        req.body.Course_Code +
          req.body.Department +
          req.body.Regulation +
          req.body.Staff_ID
      ),
      Staff_ID: req.body.Staff_ID,
      Course_Code: req.body.Course_Code,
      Course_Name: req.body.Course_Name,
      Semester: Number(req.body.Semester),
      Year: Number(req.body.Year),
      Department: req.body.Department,
      Regulations: req.body.Regulation,
    };

    console.log(course_details);
    query_js.is_present_course(course_details.Course_Id, (status) => {
      if (!status) {
        //To Replace by Flash
        courses_error = 1;
        query_js.create_course(course_details);
      } else {
        //To be Replaced by Flash
        courses_error = 2;
      }
      return res.redirect("/course_entry");
    });
  });
};
