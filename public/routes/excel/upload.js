// File Upload
const readXlsxFile = require("read-excel-file/node");
const query_js = require(__basedir + "/js/query");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

module.exports = function (app, db, query_js) {
  // -> Express Upload RestAPIs

  // Upload Courses
  app.post("/upload/courses", upload.single("file"), (req, res) => {
    importExcelData2MySQLCourses(
      __basedir + "/uploads/" + req.file.filename,
      db,
      query_js
    );
    return res.redirect("/course_entry");
  });

  // Upload Staffs
  app.post("/upload/staffs", upload.single("file"), (req, res) => {
    importExcelData2MySQLStaffs(
      __basedir + "/uploads/" + req.file.filename,
      db,
      query_js
    );
    return res.redirect("/staff_entry");
  });

  // Upload Students
  app.post("/upload/students", upload.single("file"), (req, res) => {
    importExcelData2MySQLStudents(
      __basedir + "/uploads/" + req.file.filename,
      db,
      query_js
    );
    return res.redirect("/students_entry");
  });

  // Upload Marks
  app.post("/upload/marks", upload.single("file"), (req, res) => {
    importExcelData2MySQLMarks(
      __basedir + "/uploads/" + req.file.filename,
      db,
      query_js
    );
    return res.redirect("/marks_entry");
  });

  // -> Import Excel Data to MySQL database

  //Bulk Upload Courses
  function importExcelData2MySQLCourses(filePath, db, query_js) {
    // File path.
    readXlsxFile(filePath).then((rows) => {
      for (var i = 1; i < rows.length; i++) {
        let course_details = {
          Course_ID: String(rows[i][1] + rows[i][4] + rows[i][6] + rows[i][2]),
          Staff_ID: rows[i][2],
          Course_Code: rows[i][1],
          Course_Name: rows[i][0],
          Semester: Number(rows[i][3]),
          Year: Number(rows[i][5]),
          Department: rows[i][4],
          Regulations: rows[i][6],
        };
        console.log(course_details);

        query_js.is_present_course(course_details.Course_ID, (status) => {
          if (!status) {
            query_js.create_course(course_details);
          }
        });
      }
    });
  }

  //Bulk Upload Staffs
  function importExcelData2MySQLStaffs(filePath, db, query_js) {
    // File path.
    readXlsxFile(filePath).then((rows) => {
      for (var i = 1; i < rows.length; i++) {
        let staff_details = {
          Name: rows[i][0],
          Staff_ID: rows[i][1],
          Department: rows[i][2],
          Role: rows[i][3],
          Username: rows[i][4],
          password: rows[i][5],
        };

        // console.log(staff_details);

        query_js.is_present_staff(staff_details.Staff_ID, (status) => {
          if (status) {
            staff_error = 1;
            // console.log(staff_details);
            query_js.create_staff(staff_details);
          }
        });
      }
    });
  }

  let marks_error = 0,
    student_error = 0;

  //Bulk Upload Marks
  function importExcelData2MySQLMarks(filePath, db, query_js) {
    // File path
    readXlsxFile(filePath).then((rows) => {
      for (var i = 0; i < rows.length; i++) {
        let marks_details = {
          Register_No: rows[i][0],
          Name: rows[i][1],
          Department: rows[i][2],
          Semester: rows[i][4],
          Exam_ID: rows[i][5],
          Category: rows[i][7],
          Mark: rows[i][8],
        };
        query_js.is_present_marks(marks_details, (status) => {
          if (!status) {
            marks_error = 1;
            query_js.create_marks(marks_details);
          } else {
            marks_error = 2;
          }
        });
      }
    });
  }

  // Bulk Upload Students
  function importExcelData2MySQLStudents(filePath, db, query_js) {
    // File path
    readXlsxFile(filePath).then((rows) => {
      for (var i = 1; i < rows.length; i++) {
        let student_details = {
          Roll_no: rows[i][0],
          student_name: rows[i][1],
          Department: rows[i][2],
          Semester: rows[i][3],
          Year_of_study: rows[i][4],
          Register_No: rows[i][5],
        };
        query_js.is_present_student(student_details.Roll_no, (status) => {
          if (!status) {
            student_error = 1;
            query_js.create_student(student_details);
          } else {
            student_error = 2;
          }
        });
      }
    });
  }
};
