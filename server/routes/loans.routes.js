const express = require('express');

const db = require('../config/db.config');

const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

// Get all loans
router.get('/', async (req, res) => {
  try {
    const [loans] = await db.query('SELECT * FROM loans');
    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching loans', error });
  }
});

// Get loan by ID
router.get('/:id', async (req, res) => {
  try {
    const [loan] = await db.query('SELECT * FROM loans WHERE id = ?', [req.params.id]);
    if (loan.length === 0) {
      return res.status(404).json({ message: 'Loan not found' });
    }
    res.json(loan[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching loan', error });
  }
});

// Create new loan
router.post('/', async (req, res) => {
  try {
    const { borrower_id, loan_type_id, amount, interest_rate, term_months, status } = req.body;
    const [result] = await db.query(
      'INSERT INTO loans (borrower_id, loan_type_id, amount, interest_rate, term_months, status) VALUES (?, ?, ?, ?, ?, ?)',
      [borrower_id, loan_type_id, amount, interest_rate, term_months, status]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ message: 'Error creating loan', error });
  }
});

// Update loan
router.put('/:id', async (req, res) => {
  try {
    const { borrower_id, loan_type_id, amount, interest_rate, term_months, status } = req.body;
    await db.query(
      'UPDATE loans SET borrower_id = ?, loan_type_id = ?, amount = ?, interest_rate = ?, term_months = ?, status = ? WHERE id = ?',
      [borrower_id, loan_type_id, amount, interest_rate, term_months, status, req.params.id]
    );
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    res.status(500).json({ message: 'Error updating loan', error });
  }
});

// Delete loan
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM loans WHERE id = ?', [req.params.id]);
    res.json({ message: 'Loan deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting loan', error });
  }
});

module.exports = router;
