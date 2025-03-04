// routes/results.routes.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  // Example response
  res.json({ predictionPercentage: 85 });
});

module.exports = router;