//  Marks  //
const path = require("path");

let marks_error = 0;
var updates = 0,
  dept = "";

module.exports = function (app, db, query_js) {
  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/");
  }

  //Views in public/views
  app.set("views", "./public/views");

  // Add Marks
  app.post("/add_marks", (req, res) => {
    let marks_details = {
      Course_Code:req.body.Course_Code,
      Regulation:req.body.Regulation,
      Register_No: req.body.Register_No,
      student_name: req.body.student_name,
      Department: req.body.Department,
      Semester: req.body.Semester,
      Category: req.body.Category,
      Mark: req.body.Mark,
      Staff_ID:req.body.Staff_ID,
      Course_ID: String(
        req.body.Course_Code +
          req.body.Department +
          req.body.Regulation +
          req.body.Staff_ID
      ),
    };

    query_js.is_present_marks(marks_details, (status) => {
      if (!status) {
        marks_error = 1;
        query_js.create_marks(marks_details);
      } else {
        marks_error = 2;
      }
      return res.redirect("/marks_entry");
    });
  });

  //Marks Entry Route
  app.get("/marks_entry", ensureAuthenticated, (req, res) => {
    if (!req.user) {
      // not logged-in
      res.redirect("/");
      return;
    } else {
      res.render("marks_entry", {
        msg: marks_error,
      });
      marks_error = 0;
    }
  });

  //Marks Table Display
  app.get("/marks_display", ensureAuthenticated, (req, res) => {
    res.render("marks_display", {
      data: req.flash("message"),
      result: req.flash("result"),
      update: updates,
    });
    result = 0;
    updates = 0;
  });


  //Delete Marks
  app.get("/marks_display/delete/:id/:CoID/:CaID", (req, res) => {
    var sql = "DELETE from exammarks where Register_No = ? and Course_ID = ? and Category=?";

    db.query(sql, [req.params.id, req.params.CoID, req.params.CaID], (err, results) => {
      if (err) req.flash("result", 1);
      else req.flash("result", 2);
      res.redirect("/marks_display/" + req.params.CoID);
    });
  });

  //Marks Edit
  app.post("/edit_marks", (req, res) => {
    let marks_details = {
      Mark: req.body.Mark,
      Course_ID: req.body.Course_ID,
      Category: req.body.Category,
      Register_No: req.body.Register_No,
    };
    query_js.update_marks(marks_details, (result) => {
      if (result) {
        //To Replace by Flash
        updates = 1;
        res.redirect("/marks_display");
      } else {
        updates = 2;
        res.redirect("/marks_display/"+ req.body.Course_ID);
      }
    });
  });
};
