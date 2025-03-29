const mysqldump = require('mysqldump');
const fs = require('fs');
const path = require('path');
const config = require('../config/db.config');

const backupService = {
  async createBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(__dirname, '../backups', `backup-${timestamp}.sql`);

    await mysqldump({
      connection: {
        host: config.host,
        user: config.user,
        password: config.password,
        database: config.database,
      },
      dumpToFile: backupPath,
    });

    return backupPath;
  },

  async restoreBackup(backupPath) {
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection(config);
    
    const backupContent = fs.readFileSync(backupPath, 'utf8');
    const queries = backupContent.split(';');

    for (const query of queries) {
      if (query.trim()) {
        await connection.query(query);
      }
    }

    await connection.end();
  }
};

module.exports = backupService;
