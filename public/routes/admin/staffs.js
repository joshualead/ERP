// Staff
const path = require("path");

module.exports = function (app, db, query_js) {
  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/");
  }

  let staff_error = 0;
  var updates = 0;

  //Views in public/views
  app.set("views", "./public/views");

  //Staff Entry Route
  app.get("/staff_entry", ensureAuthenticated, (req, res) => {
    if (!req.user) {
      // not logged-in
      res.redirect("/");
      return;
    } else {
      res.render(path.join("staff_entry"), {
        msg: staff_error,
      });
      staff_error = 0;
    }
  });

  let result = 0;

  //Add Staff
  app.post("/add_staff", (req, res) => {
    let staff_details = {
      Name: req.body.Name,
      Staff_ID: req.body.Staff_ID,
      Department: req.body.Department,
      Role: req.body.Role,
      Username: req.body.Username,
      password: req.body.password,
    };

    query_js.is_present_staff(staff_details.Staff_ID, (status) => {
      if (!status) {
        //To Replace by Flash
        staff_error = 1;
        query_js.create_staff(staff_details);
      } else {
        //To be Replaced by Flash
        staff_error = 2;
      }
      return res.redirect("/staff_entry");
    });
  });

  //Staffs Table Display
  app.get("/staff_display", ensureAuthenticated, (req, res) => {
    var sql = "SELECT * from staff where Role=0";
    // staff_results = [];

    db.query(sql, (err, results, fields) => {
      if (err) throw err;
      else {
        res.render("staff_display", {
          data: results,
          update: updates,
          result: result,
        });
        updates = 0;
      }
    });
  });

  //Staffs Table Route
  app.get("/staff_table/:id", ensureAuthenticated, (req, res) => {
    dept = req.params.id;
    var sql = "SELECT * from staff where Role = '0'";
    console.log("Hello");
    db.query(sql, (err, results, fields) => {
      if (err)
        //throw err;
        req.flash("message", []);
      else if (results.length != 0) req.flash("message", results);

      res.redirect("/staff_display");
    });
  });

  //Staffs Table Delete
  app.get("/staff_table/delete/:id", ensureAuthenticated, (req, res) => {
    var sql = "Delete from staff where Staff_ID = ?";
    db.query(sql, [req.params.id], (err, result) => {
      if (err)
        //throw err;
        result = 1;
      else {
        result = 2;
      }

      res.redirect("/staff_display");
    });
  });

  //Staffs Edit
  app.post("/edit_staff", (req, res) => {
    let staff_details = {
      Name: req.body.Name,
      Staff_ID: req.body.Staff_ID,
      Department: req.body.Department,
      Role: req.body.Role,
    };

    console.log(staff_details);
    query_js.update_staff(staff_details, (result) => {
      if (result) {
        //To Replace by Flash
        updates = 1;
        res.redirect("/staff_display");
      } else {
        updates = 2;
        res.redirect("/staff_display");
      }
    });
  });
};
