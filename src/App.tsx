import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { AppRoutes } from './routes';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#F4F4F4]">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <AppRoutes />
        </main>
      </div>
    </Router>
  );
}

export default App;