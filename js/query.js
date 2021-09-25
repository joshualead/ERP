const mysql = require("mysql");

/// DB Connection

var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "test",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connection Successful");
});

/// USER ///

//Checking admin status of user
function check_admin_status(username, callback) {
  const query = "SELECT * from staff where Username = ?";
  // console.log(username);
  db.query(query, [username], (err, results, fields) => {
    if (err) throw err;
    // console.log(results);
    if (results[0].Staff_ID != null) {
      return callback(0);
    } else {
      return callback(1);
    }
  });
}

//Checks whether the user is present
function is_present(username, password, callback) {
  const query = "SELECT * from staff where Username = ? && password = ?";

  db.query(query, [username, password], (err, results, fields) => {
    if (err) throw err;
    const present_chk = results.length == 0 ? false : true;
    callback(present_chk);
  });
}

//create user
function create_user(username, password, is_admin) {
  let is_admin_status = 0 || is_admin;
  const query = "Insert into faculty values (?,?,?)";

  db.query(query, [username, password, is_admin_status], (err, results) => {
    if (err) throw err;

    console.log("Record inserted");
    return true;
  });
}

/// COURSES ///

//Create course
function create_course(course_details) {
  const query = "Insert into course values (?,?,?,?,?,?,?,?)";

  db.query(
    query,
    [
      course_details.Course_ID,
      course_details.Staff_ID,
      course_details.Course_Code,
      course_details.Course_Name,
      course_details.Semester,
      course_details.Year,
      course_details.Department,
      course_details.Regulations,
    ],
    (err, results) => {
      if (err) throw err;

      console.log("Record inserted");
      return true;
    }
  );
}

//Update course
function update_course(course_details, callback) {
  const query =
    "UPDATE course SET Staff_ID = ?,Course_Code = ?, Course_Name = ?, Semester = ?, Year = ?, Department = ?, Regulation = ? where(Course_ID = ?)";

  db.query(
    query,
    [
      course_details.Staff_ID,
      course_details.Course_Code,
      course_details.Course_Name,
      course_details.Semester,
      course_details.Year,
      course_details.Department,
      course_details.Regulations,
      course_details.Course_ID,
    ],
    (err, results) => {
      if (err) throw err;
      else console.log("Updated");
      callback(true);
    }
  );
}

//Checks whether the course is present
function is_present_course(Course_Id, callback) {
  const query = "SELECT * from course where Course_ID = ?";
  db.query(query, [Course_Id], (err, results, fields) => {
    if (err) throw err;
    const present_chk = results.length == 0 ? false : true;
    callback(present_chk);
  });
}

/// STAFF ///

//Checks whether the staff is present
function is_present_staff(Staff_ID, callback) {
  const query = "SELECT * from staff where Staff_ID = ?";
  db.query(query, [Staff_ID], (err, results, fields) => {
    if (err) throw err;
    const present_chk = results.length == 0 ? false : true;
    callback(present_chk);
  });
}

//Create Staff
function create_staff(staff_details) {
  const query = "Insert into staff values (?,?,?,?,?,?)";
  console.log("Create STAFF");

  db.query(
    query,
    [
      staff_details.Name,
      staff_details.Staff_ID,
      staff_details.Department,
      staff_details.Role,
      staff_details.Username,
      staff_details.password,
    ],
    (err, results) => {
      if (err) {
        console.log(err);
        return false;
        // throw err;
      }
      console.log("Staff Record inserted");
      return true;
    }
  );
}

//Update Staff
function update_staff(staff_details, callback) {
  const query =
    "UPDATE staff SET Name = ?, Department = ?, Role = ? where(Staff_ID = ?)";
  db.query(
    query,
    [
      staff_details.Name,
      staff_details.Department,
      staff_details.Role,
      staff_details.Staff_ID,
    ],
    (err, results) => {
      if (err) {
        // throw err;
        console.log(err);
        callback(false);
      } else {
        console.log("Updated");
        callback(true);
      }
    }
  );
}

/// STUDENTS ///

// Checks Whether the student is present or not
function is_present_student(Roll_No, callback) {
  const query = "SELECT * from student where Roll_no = ?";
  db.query(query, [Roll_No], (err, results, fields) => {
    if (err) throw err;
    const present_chk = results.length == 0 ? false : true;
    callback(present_chk);
  });
}

// Create Student
function create_student(student_details) {
  const query = "Insert into student values (?,?,?,?,?,?)";

  db.query(
    query,
    [
      student_details.Roll_no,
      student_details.student_name,
      student_details.Department,
      student_details.Semester,
      student_details.Year_of_study,
      student_details.Register_No,
    ],
    (err, results) => {
      if (err) throw err;
      console.log("Student Record inserted");
      return true;
    }
  );
}

//Update Student
function update_student(student_details, callback) {
  const query =
    "UPDATE student SET student_name = ?, Department = ?, Semester = ?, Year_of_study = ?, Register_No = ? where(Roll_no = ?)";

  db.query(
    query,
    [
      student_details.student_name,
      student_details.Department,
      student_details.Semester,
      student_details.Year_of_study,
      student_details.Register_No,
      student_details.Roll_No,
    ],
    (err, results) => {
      if (err) throw err;
      else console.log("Updated");
      callback(true);
    }
  );
}

// Checks Whether the student marks is present or not
function is_present_marks(marks_details, callback) {
  const query =
    "SELECT * from exammarks where Register_No = ? and Staff_ID = ?";
  db.query(
    query,
    [marks_details.Register_No, marks_details.Exam_ID],
    (err, results, fields) => {
      if (err) throw err;
      const present_chk = results.length == 0 ? false : true;
      callback(present_chk);
    }
  );
}

//enter marks
function create_marks(marks_details) {
  const query = "Insert into exammarks values (?,?,?,?,?,?,?,?,?,?)";

  db.query(
    query,
    [
      marks_details.Course_Code,
      marks_details.Regulation,
      marks_details.Register_No,
      marks_details.student_name,
      marks_details.Department,
      marks_details.Semester,
      marks_details.Category,
      marks_details.Mark,
      marks_details.Staff_ID,
      marks_details.Course_ID,
    ],
    (err, results) => {
      if (err) throw err;

      console.log("Mark record inserted");
      return true;
    }
  );
}
//Update Student
function update_marks(marks_details, callback) {
  const query =
  "UPDATE exammarks SET Mark = ? where (Course_ID = ? && Category = ? && Register_No= ?)";

  db.query(
    query,
    [
      marks_details.Mark,
      marks_details.Course_ID,
      marks_details.Category,
      marks_details.Register_No,
    ],
    (err, results) => {
      if (err) throw err;
      else console.log("Updated");
      callback(true);
    }
  );
}


//Exporting
module.exports = {
  check_admin_status,
  is_present,
  create_user,
  create_course,
  is_present_course,
  update_course,
  is_present_staff,
  create_staff,
  update_staff,
  is_present_student,
  create_student,
  update_student,
  is_present_marks,
  create_marks,
  update_marks,
  db,
};
