// Students  //
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

  var student_error = 0,
    updates = 0,
    dept;

  var result = 0;

  //Add Students
  app.post("/add_students", (req, res) => {
    let student_details = {
      Roll_No: req.body.Roll_no,
      student_name: req.body.student_name,
      Department: req.body.Department,
      Semester: req.body.Semester,
      Year_of_study: req.body.Year,
      Register_No: req.body.Register_Number,
    };

    query_js.is_present_student(student_details.Roll_No, (status) => {
      if (!status) {
        //To Replace by Flash
        student_error = 1;
        query_js.create_student(student_details);
      } else {
        //To be Replaced by Flash
        student_error = 2;
      }
      return res.redirect("/students_entry");
    });
  });

  //Students Entry Route
  app.get("/students_entry", ensureAuthenticated, (req, res) => {
    if (!req.user) {
      // not logged-in
      res.redirect("/");
      return;
    } else {
      res.render(path.join("students_entry"), {
        msg: student_error,
      });
      student_error = 0;
    }
  });

  //Students Table Display
  app.get("/students_display", ensureAuthenticated, (req, res) => {
    db.query("SELECT * from student", (err, results, fields) => {
      res.render("student_display", {
        data: results,
        result: result,
        update: updates,
      });
      updates = 0;
      result = 0;
    });
  });

  //Students Table Route
  app.get("/students_table/:id", ensureAuthenticated, (req, res) => {
    dept = req.params.id;
    var sql = "SELECT * from student where(Department = ?)";
    db.query(sql, [dept], (err, results, fields) => {
      if (err)
        //throw err;
        req.flash("message", []);
      else if (results.length != 0) req.flash("message", results);

      res.redirect("/students_table_display");
    });
  });

  //Students Table Delete
  app.get("/students_table/delete/:id", ensureAuthenticated, (req, res) => {
    var sql = "Delete from student where Roll_no = ?";
    db.query(sql, [req.params.id], (err, result) => {
      if (err)
        //throw err;
        result = 1;
      else result = 2;

      res.redirect("/students_display");
    });
  });

  //Staffs Edit
  app.post("/edit_students", (req, res) => {
    let student_details = {
      Roll_No: req.body.Roll_no,
      student_name: req.body.student_name,
      Department: req.body.Department,
      Semester: req.body.Semester,
      Year_of_study: req.body.Year,
      Register_No: req.body.Register_Number,
    };

    query_js.update_student(student_details, (result) => {
      if (result) {
        //To Replace by Flash
        updates = 1;
        res.redirect("/students_display");
      } else {
        updates = 2;
        res.redirect("/students_display");
      }
    });
  });
};
