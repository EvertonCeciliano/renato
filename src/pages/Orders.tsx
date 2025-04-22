import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
} from '@mui/material';
import { Order, OrderItem, MenuItem as MenuItemType, menuApi, ordersApi } from '../services/api';

export function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<{ id: number; quantity: number; price: number; }[]>([]);
  const [tableNumber, setTableNumber] = useState<number>(1);

  const loadOrders = async () => {
    try {
      const response = await ordersApi.getAll();
      setOrders(response.data);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const loadMenuItems = async () => {
    try {
      const response = await menuApi.getAll();
      setMenuItems(response.data);
    } catch (error) {
      console.error('Error loading menu items:', error);
    }
  };

  useEffect(() => {
    loadOrders();
    loadMenuItems();
  }, []);

  const handleOpen = () => {
    setOpen(true);
    setSelectedItems([]);
    setTableNumber(1);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddItem = (menuItem: MenuItemType) => {
    const existingItem = selectedItems.find(item => item.id === menuItem.id);
    if (existingItem) {
      setSelectedItems(selectedItems.map(item =>
        item.id === menuItem.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setSelectedItems([...selectedItems, { id: menuItem.id, quantity: 1, price: Number(menuItem.price) }]);
    }
  };

  const handleRemoveItem = (menuItemId: number) => {
    setSelectedItems(selectedItems.filter(item => item.id !== menuItemId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItems.length === 0) return;

    setLoading(true);
    try {
      await ordersApi.create({
        table_number: tableNumber,
        items: selectedItems,
      });
      handleClose();
      loadOrders();
    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    try {
      await ordersApi.updateStatus(orderId, newStatus);
      loadOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'warning';
      case 'preparing': return 'info';
      case 'ready': return 'success';
      case 'delivered': return 'default';
      default: return 'default';
    }
  };

  const calculateTotal = (items: OrderItem[]) => {
    return items.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Orders</Typography>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          New Order
        </Button>
      </Box>

      <Grid container spacing={3}>
        {orders.map((order) => (
          <Grid item xs={12} sm={6} md={4} key={order.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Table {order.table_number}
                </Typography>
                <Chip
                  label={order.status}
                  color={getStatusColor(order.status)}
                  sx={{ mb: 2 }}
                />
                {order.items.map((item) => (
                  <Box key={item.id} sx={{ mb: 1 }}>
                    <Typography variant="body2">
                      {item.quantity}x {item.name} - ${(Number(item.price) * item.quantity).toFixed(2)}
                    </Typography>
                  </Box>
                ))}
                <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                  Total: ${Number(order.total_amount).toFixed(2)}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={order.status}
                      label="Status"
                      onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="preparing">Preparing</MenuItem>
                      <MenuItem value="ready">Ready</MenuItem>
                      <MenuItem value="delivered">Delivered</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>New Order</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label="Table Number"
              type="number"
              value={tableNumber}
              onChange={(e) => setTableNumber(parseInt(e.target.value))}
              margin="normal"
              required
              inputProps={{ min: 1 }}
            />
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
              Menu Items
            </Typography>
            <Grid container spacing={1}>
              {menuItems.map((menuItem) => (
                <Grid item xs={12} key={menuItem.id}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => handleAddItem(menuItem)}
                    sx={{ justifyContent: 'space-between' }}
                  >
                    <span>{menuItem.name}</span>
                    <span>${Number(menuItem.price).toFixed(2)}</span>
                  </Button>
                </Grid>
              ))}
            </Grid>
            {selectedItems.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1">Selected Items:</Typography>
                {selectedItems.map((item) => {
                  const menuItem = menuItems.find(m => m.id === item.id);
                  return (
                    <Box
                      key={item.id}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1,
                      }}
                    >
                      <Typography>
                        {item.quantity}x {menuItem?.name}
                      </Typography>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        Remove
                      </Button>
                    </Box>
                  );
                })}
                <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                  Total: ${selectedItems.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0).toFixed(2)}
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading || selectedItems.length === 0}
            >
              {loading ? 'Creating...' : 'Create Order'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
