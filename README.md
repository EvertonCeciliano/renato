# Restaurant Management System

A modern web application for managing restaurant orders and menu items, built with React, TypeScript, and MySQL.

## Features

- Menu item management (add, view, and categorize items)
- Order management (create and track orders)
- Real-time status updates
- Modern and responsive UI with Tailwind CSS

## Prerequisites

- Node.js (v14 or higher)
- MySQL Server
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd restaurant-management
```

2. Install dependencies:
```bash
npm install
```

3. Create MySQL database:
```sql
CREATE DATABASE restaurant_management;
```

4. Configure environment variables:
- Copy `.env.example` to `.env`
- Update the database credentials in `.env`

5. Start the backend server:
```bash
cd server
npm install
npm start
```

6. Start the frontend development server:
```bash
npm run dev
```

7. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── Layout.tsx
│   │   ├── MenuItems.tsx
│   │   └── Orders.tsx
│   ├── App.tsx
│   └── main.tsx
├── server/
│   └── index.js
├── .env
└── README.md
```

## Technologies Used

- React
- TypeScript
- Tailwind CSS
- MySQL
- Express.js
- Vite

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
#   r e n a t o  
 