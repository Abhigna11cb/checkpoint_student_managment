const express = require('express');
const router = express.Router();

const courses = [
  {
    id: 1,
    name: 'Web Development Fundamentals',
    description: 'Learn HTML, CSS, and JavaScript basics',
    startDate: '2024-01-15',
    endDate: '2024-04-15'
  },
  {
    id: 2,
    name: 'React Advanced Patterns',
    description: 'Master React hooks, context, and performance optimization',
    startDate: '2024-02-01',
    endDate: '2024-05-01'
  },
  {
    id: 3,
    name: 'Database Design',
    description: 'Learn SQL and database architecture principles',
    startDate: '2024-03-10',
    endDate: '2024-06-10'
  },
  {
    id: 4,
    name: 'Node.js Backend Development',
    description: 'Build scalable backend applications with Node.js',
    startDate: '2024-04-01',
    endDate: '2024-07-01'
  },
  {
    id: 5,
    name: 'UI/UX Design Principles',
    description: 'Create beautiful and user-friendly interfaces',
    startDate: '2024-05-15',
    endDate: '2024-08-15'
  },
  {
    id: 6,
    name: 'Cloud Computing with AWS',
    description: 'Deploy applications on Amazon Web Services',
    startDate: '2024-06-01',
    endDate: '2024-09-01'
  }
];

router.get('/available', (req, res) => {
  res.json(courses);
});

module.exports = router;
