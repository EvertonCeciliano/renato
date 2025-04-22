import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';

interface MenuItem {
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

interface MenuItemFormProps {
  onSubmit: (data: MenuItem) => void;
  initialData?: MenuItem;
}

const categories = [
  { value: 'entrada', label: 'Entrada' },
  { value: 'principal', label: 'Prato Principal' },
  { value: 'sobremesa', label: 'Sobremesa' },
  { value: 'bebida', label: 'Bebida' },
];

export function MenuItemForm({ onSubmit, initialData }: MenuItemFormProps) {
  const [formData, setFormData] = useState<MenuItem>({
    name: '',
    description: '',
    price: 0,
    category: '',
    image: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof MenuItem, string>>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors: Partial<Record<keyof MenuItem, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Preço deve ser maior que zero';
    }

    if (!formData.category) {
      newErrors.category = 'Categoria é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Nome do Item"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        required
      />

      <Input
        label="Descrição"
        name="description"
        value={formData.description}
        onChange={handleChange}
        error={errors.description}
        required
      />

      <Input
        label="Preço"
        type="number"
        name="price"
        value={formData.price}
        onChange={handleChange}
        error={errors.price}
        required
        min="0"
        step="0.01"
      />

      <Select
        label="Categoria"
        name="category"
        value={formData.category}
        onChange={handleChange}
        error={errors.category}
        options={categories}
        required
      />

      <Input
        label="URL da Imagem"
        name="image"
        value={formData.image}
        onChange={handleChange}
        error={errors.image}
        placeholder="https://exemplo.com/imagem.jpg"
      />

      <div className="flex justify-end">
        <Button type="submit">
          {initialData ? 'Salvar Alterações' : 'Adicionar Item'}
        </Button>
      </div>
    </form>
  );
} 