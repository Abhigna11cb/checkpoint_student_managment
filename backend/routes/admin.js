const express = require('express');
const router = express.Router();

const students = [
  { id: 1, name: 'John Doe', email: 'student@test.com', phone: '+1234567890', address: '123 Main St, City, Country' },
  { id: 2, name: 'Jane Smith', email: 'jane@test.com', phone: '+1987654321', address: '456 Oak Ave, Town, Country' },
  { id: 3, name: 'Bob Johnson', email: 'bob@test.com', phone: '+1122334455', address: '789 Elm Rd, Village, Country' }
];

const courses = [
  { id: 1, name: 'Web Development Fundamentals', description: 'Learn HTML, CSS, and JavaScript basics', startDate: '2024-01-15', endDate: '2024-04-15' },
  { id: 2, name: 'React Advanced Patterns', description: 'Master React hooks, context, and performance optimization', startDate: '2024-02-01', endDate: '2024-05-01' },
  { id: 3, name: 'Database Design', description: 'Learn SQL and database architecture principles', startDate: '2024-03-10', endDate: '2024-06-10' }
];

const requests = [
  { id: 1, studentName: 'John Doe', courseName: 'Database Design', status: 'Pending' },
  { id: 2, studentName: 'Jane Smith', courseName: 'Node.js Backend Development', status: 'Pending' },
  { id: 3, studentName: 'Bob Johnson', courseName: 'UI/UX Design Principles', status: 'Pending' }
];

router.get('/summary', (req, res) => {
  res.json({
    studentsCount: students.length,
    coursesCount: courses.length,
    requestsCount: requests.filter(r => r.status === 'Pending').length
  });
});

router.get('/students', (req, res) => {
  res.json(students);
});

router.post('/students', (req, res) => {
  const newStudent = {
    id: students.length + 1,
    ...req.body
  };
  students.push(newStudent);
  res.json(newStudent);
});

router.put('/students/:id', (req, res) => {
  const index = students.findIndex(s => s.id === parseInt(req.params.id));
  if (index !== -1) {
    students[index] = { ...students[index], ...req.body };
    res.json(students[index]);
  } else {
    res.status(404).json({ error: 'Student not found' });
  }
});

router.delete('/students/:id', (req, res) => {
  const index = students.findIndex(s => s.id === parseInt(req.params.id));
  if (index !== -1) {
    students.splice(index, 1);
    res.json({ message: 'Student deleted' });
  } else {
    res.status(404).json({ error: 'Student not found' });
  }
});

router.get('/courses', (req, res) => {
  res.json(courses);
});

router.post('/courses', (req, res) => {
  const newCourse = {
    id: courses.length + 1,
    ...req.body
  };
  courses.push(newCourse);
  res.json(newCourse);
});

router.put('/courses/:id', (req, res) => {
  const index = courses.findIndex(c => c.id === parseInt(req.params.id));
  if (index !== -1) {
    courses[index] = { ...courses[index], ...req.body };
    res.json(courses[index]);
  } else {
    res.status(404).json({ error: 'Course not found' });
  }
});

router.delete('/courses/:id', (req, res) => {
  const index = courses.findIndex(c => c.id === parseInt(req.params.id));
  if (index !== -1) {
    courses.splice(index, 1);
    res.json({ message: 'Course deleted' });
  } else {
    res.status(404).json({ error: 'Course not found' });
  }
});

router.get('/requests', (req, res) => {
  res.json(requests);
});

router.put('/requests/:id/approve', (req, res) => {
  const index = requests.findIndex(r => r.id === parseInt(req.params.id));
  if (index !== -1) {
    requests[index].status = 'Approved';
    res.json(requests[index]);
  } else {
    res.status(404).json({ error: 'Request not found' });
  }
});

router.put('/requests/:id/reject', (req, res) => {
  const index = requests.findIndex(r => r.id === parseInt(req.params.id));
  if (index !== -1) {
    requests[index].status = 'Rejected';
    res.json(requests[index]);
  } else {
    res.status(404).json({ error: 'Request not found' });
  }
});

module.exports = router;
