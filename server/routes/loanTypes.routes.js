const express = require('express');
const db = require('../config/db.config');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

// Get all loan types
router.get('/', async (req, res) => {
  try {
    const [loanTypes] = await db.query('SELECT * FROM loan_types');
    res.json(loanTypes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching loan types', error });
  }
});

// Get loan type by ID
router.get('/:id', async (req, res) => {
  try {
    const [loanType] = await db.query('SELECT * FROM loan_types WHERE id = ?', [req.params.id]);
    if (loanType.length === 0) {
      return res.status(404).json({ message: 'Loan type not found' });
    }
    res.json(loanType[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching loan type', error });
  }
});

// Create new loan type
router.post('/', async (req, res) => {
  try {
    const { name, description, interest_rate_min, interest_rate_max, term_months_min, term_months_max } = req.body;
    const [result] = await db.query(
      'INSERT INTO loan_types (name, description, interest_rate_min, interest_rate_max, term_months_min, term_months_max) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, interest_rate_min, interest_rate_max, term_months_min, term_months_max]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ message: 'Error creating loan type', error });
  }
});

// Update loan type
router.put('/:id', async (req, res) => {
  try {
    const { name, description, interest_rate_min, interest_rate_max, term_months_min, term_months_max } = req.body;
    await db.query(
      'UPDATE loan_types SET name = ?, description = ?, interest_rate_min = ?, interest_rate_max = ?, term_months_min = ?, term_months_max = ? WHERE id = ?',
      [name, description, interest_rate_min, interest_rate_max, term_months_min, term_months_max, req.params.id]
    );
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    res.status(500).json({ message: 'Error updating loan type', error });
  }
});

// Delete loan type
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM loan_types WHERE id = ?', [req.params.id]);
    res.json({ message: 'Loan type deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting loan type', error });
  }
});

module.exports = router;
