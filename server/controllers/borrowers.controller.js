const db = require('../config/db.config');

const borrowersController = {
  async getAll(req, res) {
    try {
      const [borrowers] = await db.query('SELECT * FROM borrowers ORDER BY lastname, firstname');
      res.json(borrowers);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching borrowers', error });
    }
  },

  async getById(req, res) {
    try {
      const [borrower] = await db.query('SELECT * FROM borrowers WHERE id = ?', [req.params.id]);
      if (borrower.length === 0) {
        return res.status(404).json({ message: 'Borrower not found' });
      }
      res.json(borrower[0]);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching borrower', error });
    }
  },

  async create(req, res) {
    const { firstname, lastname, middlename, address, contact_no, email, tax_id } = req.body;
    try {
      const [result] = await db.query(
        'INSERT INTO borrowers (firstname, lastname, middlename, address, contact_no, email, tax_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [firstname, lastname, middlename, address, contact_no, email, tax_id]
      );
      res.status(201).json({ id: result.insertId, ...req.body });
    } catch (error) {
      res.status(500).json({ message: 'Error creating borrower', error });
    }
  },

  async update(req, res) {
    const { firstname, lastname, middlename, address, contact_no, email, tax_id } = req.body;
    try {
      await db.query(
        'UPDATE borrowers SET firstname = ?, lastname = ?, middlename = ?, address = ?, contact_no = ?, email = ?, tax_id = ? WHERE id = ?',
        [firstname, lastname, middlename, address, contact_no, email, tax_id, req.params.id]
      );
      res.json({ id: req.params.id, ...req.body });
    } catch (error) {
      res.status(500).json({ message: 'Error updating borrower', error });
    }
  },

  async delete(req, res) {
    try {
      await db.query('DELETE FROM borrowers WHERE id = ?', [req.params.id]);
      res.json({ message: 'Borrower deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting borrower', error });
    }
  }
};

module.exports = borrowersController;
