import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto mb-20 text-center relative">
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-green-100 rounded-full opacity-50 animate-pulse"></div>
          <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-green-100 rounded-full opacity-50 animate-pulse delay-150"></div>
          <h1 className="text-5xl md:text-7xl font-bold text-green-900 mb-6 tracking-tight relative">
            Gerencie seu
            <span className="block text-green-600 mt-2">Restaurante Digital</span>
          </h1>
          <p className="text-xl md:text-2xl text-green-700 max-w-2xl mx-auto leading-relaxed">
            Transforme seu negócio com nossa plataforma completa de gestão.
            <span className="block mt-2 text-green-600 font-medium">Simples. Intuitivo. Eficiente.</span>
          </p>
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Menu Card */}
            <Link
              to="/menu"
              className="group relative overflow-hidden rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-green-100 bg-white hover:bg-green-50/80"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-green-100/50 rounded-full -mr-20 -mt-20 transition-transform group-hover:scale-150"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-green-50 rounded-full -ml-16 -mb-16 transition-transform group-hover:scale-150"></div>
              <div className="relative z-10">
                <div className="flex items-center mb-8">
                  <span className="text-5xl transform transition-transform group-hover:scale-110 group-hover:rotate-12">🍽️</span>
                  <div className="ml-6">
                    <h2 className="text-3xl font-bold text-green-900 group-hover:text-green-700 transition-colors">
                      Cardápio Digital
                    </h2>
                    <p className="text-green-600 font-medium text-lg mt-1">Gerencie seus produtos</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <p className="text-green-700 leading-relaxed text-lg">
                    Organize seu cardápio de forma intuitiva e mantenha seus clientes sempre atualizados.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center text-green-600 font-medium">
                      <svg className="w-6 h-6 mr-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span className="text-lg">Categorias organizadas</span>
                    </li>
                    <li className="flex items-center text-green-600 font-medium">
                      <svg className="w-6 h-6 mr-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span className="text-lg">Preços e disponibilidade</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-8 flex items-center text-green-600 font-medium group-hover:text-green-700">
                  <span className="text-lg">Acessar cardápio</span>
                  <svg className="w-6 h-6 ml-3 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Orders Card */}
            <Link
              to="/orders"
              className="group relative overflow-hidden rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-green-100 bg-white hover:bg-green-50/80"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-green-100/50 rounded-full -mr-20 -mt-20 transition-transform group-hover:scale-150"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-green-50 rounded-full -ml-16 -mb-16 transition-transform group-hover:scale-150"></div>
              <div className="relative z-10">
                <div className="flex items-center mb-8">
                  <span className="text-5xl transform transition-transform group-hover:scale-110 group-hover:rotate-12">📋</span>
                  <div className="ml-6">
                    <h2 className="text-3xl font-bold text-green-900 group-hover:text-green-700 transition-colors">
                      Pedidos
                    </h2>
                    <p className="text-green-600 font-medium text-lg mt-1">Gestão em tempo real</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <p className="text-green-700 leading-relaxed text-lg">
                    Acompanhe e gerencie todos os pedidos instantaneamente, sem complicações.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center text-green-600 font-medium">
                      <svg className="w-6 h-6 mr-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span className="text-lg">Status em tempo real</span>
                    </li>
                    <li className="flex items-center text-green-600 font-medium">
                      <svg className="w-6 h-6 mr-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span className="text-lg">Histórico completo</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-8 flex items-center text-green-600 font-medium group-hover:text-green-700">
                  <span className="text-lg">Gerenciar pedidos</span>
                  <svg className="w-6 h-6 ml-3 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="max-w-6xl mx-auto pt-16 border-t border-green-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="text-5xl font-bold text-green-600 mb-3 transition-transform group-hover:scale-110">100%</div>
              <div className="text-lg text-green-700 font-medium">Gestão digital</div>
            </div>
            <div className="text-center group">
              <div className="text-5xl font-bold text-green-600 mb-3 transition-transform group-hover:scale-110">24/7</div>
              <div className="text-lg text-green-700 font-medium">Monitoramento</div>
            </div>
            <div className="text-center group">
              <div className="text-5xl font-bold text-green-600 mb-3 transition-transform group-hover:scale-110">+1000</div>
              <div className="text-lg text-green-700 font-medium">Pedidos processados</div>
            </div>
            <div className="text-center group">
              <div className="text-5xl font-bold text-green-600 mb-3 transition-transform group-hover:scale-110">98%</div>
              <div className="text-lg text-green-700 font-medium">Satisfação</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 