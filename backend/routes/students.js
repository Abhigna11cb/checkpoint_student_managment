const express = require('express');
const router = express.Router();

const students = [
  {
    id: 1,
    name: 'John Doe',
    email: 'student@test.com',
    phone: '+1234567890',
    address: '123 Main St, City, Country',
    enrolledCourses: 3
  },
  {
    id: 3,
    name: 'Jane Smith',
    email: 'jane@test.com',
    phone: '+1987654321',
    address: '456 Oak Ave, Town, Country',
    enrolledCourses: 2
  }
];

router.get('/:id/profile', (req, res) => {
  const student = students.find(s => s.id === parseInt(req.params.id));

  if (student) {
    res.json(student);
  } else {
    res.status(404).json({ error: 'Student not found' });
  }
});

router.put('/:id/profile', (req, res) => {
  const { name, phone, address } = req.body;
  const studentIndex = students.findIndex(s => s.id === parseInt(req.params.id));

  if (studentIndex !== -1) {
    students[studentIndex] = {
      ...students[studentIndex],
      name,
      phone,
      address
    };
    res.json(students[studentIndex]);
  } else {
    res.status(404).json({ error: 'Student not found' });
  }
});

router.get('/:id/summary', (req, res) => {
  const student = students.find(s => s.id === parseInt(req.params.id));

  if (student) {
    res.json({
      name: student.name,
      enrolledCourses: student.enrolledCourses,
      pendingRequests: 1
    });
  } else {
    res.status(404).json({ error: 'Student not found' });
  }
});

router.get('/:id/courses', (req, res) => {
  const enrollments = [
    {
      id: 1,
      studentId: 1,
      courseName: 'Web Development Fundamentals',
      startDate: '2024-01-15',
      status: 'Approved'
    },
    {
      id: 2,
      studentId: 1,
      courseName: 'React Advanced Patterns',
      startDate: '2024-02-01',
      status: 'Approved'
    },
    {
      id: 3,
      studentId: 1,
      courseName: 'Database Design',
      startDate: '2024-03-10',
      status: 'Pending'
    }
  ];

  const studentCourses = enrollments.filter(e => e.studentId === parseInt(req.params.id));
  res.json(studentCourses);
});

module.exports = router;
