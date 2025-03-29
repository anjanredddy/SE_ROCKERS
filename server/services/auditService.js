const db = require('../config/db.config');

const auditService = {
  async logAction(userId, action, details) {
    await db.query(
      'INSERT INTO audit_logs (user_id, action, details) VALUES (?, ?, ?)',
      [userId, action, JSON.stringify(details)]
    );
  },

  async getAuditLogs(startDate, endDate) {
    const [logs] = await db.query(
      `SELECT al.*, CONCAT(u.firstname, ' ', u.lastname) as user_name 
       FROM audit_logs al 
       LEFT JOIN users u ON u.id = al.user_id 
       WHERE al.created_at BETWEEN ? AND ?
       ORDER BY al.created_at DESC`,
      [startDate, endDate]
    );
    return logs;
  }
};

module.exports = auditService;
