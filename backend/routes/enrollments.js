const express = require('express');
const router = express.Router();

const enrollmentRequests = [
  { id: 1, studentName: 'John Doe', courseName: 'Database Design', status: 'Pending' },
  { id: 2, studentName: 'Jane Smith', courseName: 'Node.js Backend Development', status: 'Pending' }
];

router.post('/request', (req, res) => {
  const { studentId, courseId, courseName } = req.body;

  const newRequest = {
    id: enrollmentRequests.length + 1,
    studentId,
    courseId,
    courseName,
    status: 'Pending'
  };

  enrollmentRequests.push(newRequest);
  res.json({ message: 'Enrollment request sent successfully', request: newRequest });
});

module.exports = router;
