const db = require('../config/db.config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');

const usersController = {
  async login(req, res) {
    try {
      const { username, password } = req.body;
      const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
      
      if (users.length === 0) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const user = users[0];
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      if (!user.status) {
        return res.status(401).json({ message: 'Account is inactive' });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        config.secret,
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          firstname: user.firstname,
          lastname: user.lastname
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Error during login', error });
    }
  },

  async getAll(req, res) {
    try {
      const [users] = await db.query(
        'SELECT id, username, email, firstname, lastname, role, status FROM users'
      );
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching users', error });
    }
  },

  async create(req, res) {
    const { username, password, email, firstname, lastname, role, status } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await db.query(
        'INSERT INTO users (username, password, email, firstname, lastname, role, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [username, hashedPassword, email, firstname, lastname, role, status]
      );
      res.status(201).json({
        id: result.insertId,
        username,
        email,
        firstname,
        lastname,
        role,
        status
      });
    } catch (error) {
      res.status(500).json({ message: 'Error creating user', error });
    }
  },

  async update(req, res) {
    const { email, firstname, lastname, role, status } = req.body;
    try {
      await db.query(
        'UPDATE users SET email = ?, firstname = ?, lastname = ?, role = ?, status = ? WHERE id = ?',
        [email, firstname, lastname, role, status, req.params.id]
      );
      res.json({ id: req.params.id, ...req.body });
    } catch (error) {
      res.status(500).json({ message: 'Error updating user', error });
    }
  },

  async changePassword(req, res) {
    const { current_password, new_password } = req.body;
    try {
      const [users] = await db.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
      
      if (users.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      const isValidPassword = await bcrypt.compare(current_password, users[0].password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }

      const hashedPassword = await bcrypt.hash(new_password, 10);
      await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.user.id]);
      
      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error changing password', error });
    }
  },

  async adminChangePassword(req, res) {
    const { new_password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(new_password, 10);
      await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.params.id]);
      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error changing password', error });
    }
  },

  async delete(req, res) {
    try {
      await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting user', error });
    }
  }
};

module.exports = usersController;
