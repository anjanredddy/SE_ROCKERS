const db = require('../config/db.config');

const paymentsController = {
  async getAll(req, res) {
    try {
      const [payments] = await db.query(`
        SELECT p.*, l.ref_no as loan_ref_no, 
        CONCAT(b.lastname, ', ', b.firstname) as borrower_name
        FROM payments p 
        INNER JOIN loan_list l ON l.id = p.loan_id
        INNER JOIN borrowers b ON b.id = l.borrower_id
        ORDER BY p.date_created DESC
      `);
      res.json(payments);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching payments', error });
    }
  },

  async create(req, res) {
    const { loan_id, amount, payee, penalty_amount } = req.body;
    try {
      const [result] = await db.query(
        'INSERT INTO payments (loan_id, amount, payee, penalty_amount, date_created) VALUES (?, ?, ?, ?, NOW())',
        [loan_id, amount, payee, penalty_amount]
      );

      // Update loan payment status
      await db.query(`
        UPDATE loan_list SET 
        total_paid = total_paid + ?,
        last_payment_date = NOW()
        WHERE id = ?
      `, [amount, loan_id]);

      res.status(201).json({ id: result.insertId, ...req.body });
    } catch (error) {
      res.status(500).json({ message: 'Error creating payment', error });
    }
  },

  async getPaymentDetails(req, res) {
    try {
      const [loan] = await db.query(`
        SELECT l.*, p.months, p.interest_percentage, p.penalty_rate
        FROM loan_list l
        INNER JOIN loan_plan p ON p.id = l.plan_id
        WHERE l.id = ?
      `, [req.params.id]);

      if (loan.length === 0) {
        return res.status(404).json({ message: 'Loan not found' });
      }

      const monthlyAmount = (loan[0].amount + (loan[0].amount * (loan[0].interest_percentage/100))) / loan[0].months;
      const penalty = monthlyAmount * (loan[0].penalty_rate/100);

      res.json({
        monthly_amount: monthlyAmount,
        penalty_amount: penalty,
        remaining_balance: loan[0].amount - loan[0].total_paid
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching payment details', error });
    }
  }
};

module.exports = paymentsController;
