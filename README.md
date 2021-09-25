# ERP_Assesment_Module
There are a few more changes:
1-There are some input fields in the admin side.
Those can be removed. They dont have a column in db
2-The student DB can be removed
3-All the working must be checked.
We can start from admin add inputs for each module(course,Staff,etc).
and follow the flow and finally download it.
4-Kindly go through the code and add whatever changes necessary.
5 - error handling
6 - debug
<!-- Queries -->
INSERT INTO `staff` (`Name`, `Staff_ID`, `Department`, `Role`, `Username`, `password`) VALUES ('Robert', 'Robert@471', 'ECE', 'Professor', 'robert@licet.ac.in', 'qwerty');
INSERT INTO `staff` (`Name`, `Staff_ID`, `Department`, `Role`, `Username`, `password`) VALUES ('Tom', 'Tom@473', 'ECE', 'Professor', 'tom@licet.ac.in', 'qwerty');
INSERT INTO `staff` (`Name`, `Staff_ID`, `Department`, `Role`, `Username`, `password`) VALUES ('Ali', 'Ali@247', 'EEE', 'Professor', 'ali@licet.ac.in', 'qwerty');
INSERT INTO `staff` (`Name`, `Staff_ID`, `Department`, `Role`, `Username`, `password`) VALUES ('hari', 'hari@467', 'IT', 'Professor', 'hari@licet.ac.in', 'qwerty');
INSERT INTO `staff` (`Name`, `Staff_ID`, `Department`, `Role`, `Username`, `password`) VALUES ('nibras', 'Robert@647', 'CSE', 'Professor', 'nibras@licet.ac.in', 'qwerty');



There is a bug in courses addition
Only the first letter is updating in staffid


in staff
marks updation is not working