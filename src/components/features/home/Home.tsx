import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../ui/Card';

export function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-green-900 mb-4">
            Gerenciamento Inteligente de Restaurante
          </h1>
          <p className="text-lg text-green-700">
            Simplifique suas operações e aumente sua eficiência com nossa plataforma completa
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          <Link to="/menu">
            <Card
              className="h-full transition-transform hover:-translate-y-1"
              variant="interactive"
            >
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-green-900 mb-4">
                  Gerenciar Cardápio
                </h2>
                <p className="text-green-700 mb-4">
                  Atualize seus pratos, preços e disponibilidade em tempo real. Mantenha seu cardápio sempre atualizado.
                </p>
                <div className="text-green-600 font-medium">
                  Acessar cardápio →
                </div>
              </div>
            </Card>
          </Link>

          <Link to="/orders">
            <Card
              className="h-full transition-transform hover:-translate-y-1"
              variant="interactive"
            >
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-green-900 mb-4">
                  Controle de Pedidos
                </h2>
                <p className="text-green-700 mb-4">
                  Acompanhe pedidos em tempo real, gerencie status e mantenha um histórico completo.
                </p>
                <div className="text-green-600 font-medium">
                  Ver pedidos →
                </div>
              </div>
            </Card>
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">98%</div>
            <div className="text-sm text-green-700">
              Gerenciamento Digital
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
            <div className="text-sm text-green-700">
              Monitoramento
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">5k+</div>
            <div className="text-sm text-green-700">
              Pedidos Processados
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">4.9</div>
            <div className="text-sm text-green-700">
              Satisfação do Cliente
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 