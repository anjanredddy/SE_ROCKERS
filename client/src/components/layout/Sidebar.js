import React from 'react';
import { Link } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Home,
  People,
  AttachMoney,
  Payment,
  Description,
  Category,
  Person
} from '@mui/icons-material';

const menuItems = [
  { text: 'Home', icon: <Home />, path: '/home' },
  { text: 'Loans', icon: <AttachMoney />, path: '/loans' },
  { text: 'Payments', icon: <Payment />, path: '/payments' },
  { text: 'Borrowers', icon: <People />, path: '/borrowers' },
  { text: 'Loan Plans', icon: <Description />, path: '/plans' },
  { text: 'Loan Types', icon: <Category />, path: '/loan-types' },
  { text: 'Users', icon: <Person />, path: '/users' }
];

const Sidebar = ({ mobileOpen, handleDrawerToggle, drawerWidth }) => {
  const drawer = (
    <>
      <List>
        {menuItems.map((item) => (
          <ListItem button key={item.text} component={Link} to={item.path}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
    </>
  );

  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Sidebar;
