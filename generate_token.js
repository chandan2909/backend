const jwt = require('jsonwebtoken');
require('dotenv').config();
const token = jwt.sign({ userId: 1 }, process.env.JWT_ACCESS_SECRET || 'supersecretaccess123', { expiresIn: '1h' });
console.log(token);
