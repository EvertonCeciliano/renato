import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppBar, Box, Container, Toolbar, Typography, Button } from '@mui/material';

interface BaseLayoutProps {
  children: React.ReactNode;
}

export function BaseLayout({ children }: BaseLayoutProps) {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Restaurant Manager
          </Typography>
          <Button
            color="inherit"
            component={Link}
            to="/"
            sx={{ 
              mx: 1,
              fontWeight: isActive('/') ? 'bold' : 'normal',
              borderBottom: isActive('/') ? 2 : 0
            }}
          >
            Menu
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/orders"
            sx={{ 
              mx: 1,
              fontWeight: isActive('/orders') ? 'bold' : 'normal',
              borderBottom: isActive('/orders') ? 2 : 0
            }}
          >
            Orders
          </Button>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ flex: 1, py: 3 }}>
        {children}
      </Container>
    </Box>
  );
}