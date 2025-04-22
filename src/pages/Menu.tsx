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
  MenuItem as MuiMenuItem,
} from '@mui/material';
import { MenuItem, menuApi } from '../services/api';

export function Menu() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Partial<MenuItem> | null>(null);
  const [loading, setLoading] = useState(false);

  const loadItems = async () => {
    try {
      const response = await menuApi.getAll();
      setItems(response.data);
    } catch (error) {
      console.error('Error loading menu items:', error);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleOpen = (item?: MenuItem) => {
    setSelectedItem(item || {
      name: '',
      description: '',
      price: 0,
      category: '',
      is_available: true,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedItem(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    setLoading(true);
    try {
      if ('id' in selectedItem) {
        await menuApi.update(selectedItem.id!, {
          ...selectedItem,
          price: Number(selectedItem.price),
        });
      } else {
        await menuApi.create({
          ...selectedItem,
          price: Number(selectedItem.price),
        } as Omit<MenuItem, 'id'>);
      }
      handleClose();
      loadItems();
    } catch (error) {
      console.error('Error saving menu item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      await menuApi.delete(id);
      loadItems();
    } catch (error) {
      console.error('Error deleting menu item:', error);
    }
  };

  const categories = ['Appetizer', 'Main Course', 'Dessert', 'Beverage'];

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Menu Items</Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpen()}>
          Add Item
        </Button>
      </Box>

      <Grid container spacing={3}>
        {items.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {item.name}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {item.category}
                </Typography>
                <Typography variant="body2" paragraph>
                  {item.description}
                </Typography>
                <Typography variant="h6" color="primary">
                  ${Number(item.price).toFixed(2)}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleOpen(item)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedItem && 'id' in selectedItem ? 'Edit Item' : 'Add Item'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label="Name"
              value={selectedItem?.name || ''}
              onChange={(e) =>
                setSelectedItem({ ...selectedItem, name: e.target.value })
              }
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              value={selectedItem?.description || ''}
              onChange={(e) =>
                setSelectedItem({ ...selectedItem, description: e.target.value })
              }
              margin="normal"
              multiline
              rows={3}
            />
            <TextField
              fullWidth
              label="Price"
              type="number"
              value={selectedItem?.price || ''}
              onChange={(e) =>
                setSelectedItem({
                  ...selectedItem,
                  price: parseFloat(e.target.value),
                })
              }
              margin="normal"
              required
              inputProps={{ min: 0, step: 0.01 }}
            />
            <TextField
              fullWidth
              select
              label="Category"
              value={selectedItem?.category || ''}
              onChange={(e) =>
                setSelectedItem({ ...selectedItem, category: e.target.value })
              }
              margin="normal"
              required
            >
              {categories.map((category) => (
                <MuiMenuItem key={category} value={category}>
                  {category}
                </MuiMenuItem>
              ))}
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
