import { api } from './api.js';
import { Header } from './components/Header.js';
import { LoginForm } from './components/LoginForm.js';
import { RegisterForm } from './components/RegisterForm.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { DeckViewPage } from './pages/DeckViewPage.js';
import './style.css';

// Router
function router() {
  const hash = window.location.hash || '#/';
  const token = localStorage.getItem('token');
  
  // Public routes
  if (hash === '#/login') {
    if (token) { window.location.hash = '#/'; return; }
    renderPage(LoginForm);
    return;
  }
  
  if (hash === '#/register') {
    if (token) { window.location.hash = '#/'; return; }
    renderPage(RegisterForm);
    return;
  }
  
  // Protected routes
  if (!token) {
    window.location.hash = '#/login';
    return;
  }
  
  // Deck view route
  if (hash.startsWith('#/deck/')) {
    const deckId = parseInt(hash.split('/')[2]);
    if (deckId) {
      DeckViewPage(deckId);
      return;
    }
  }
  
  // Dashboard (default)
  DashboardPage();
}

function renderPage(Component) {
  const app = document.getElementById('app');
  app.innerHTML = '';
  app.appendChild(Header());
  app.appendChild(Component());
}

// Initialize
window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', async () => {
  // Verify token on load
  const token = localStorage.getItem('token');
  if (token) {
    try {
      await api.getCurrentUser();
    } catch (error) {
      api.clearToken();
    }
  }
  router();
});

// Export for inline handlers
window.api = api;
