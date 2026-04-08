import { api } from '../api.js';

export function Header() {
  const header = document.createElement('header');
  header.className = 'bg-white shadow-sm border-b border-gray-200';
  
  const nav = document.createElement('nav');
  nav.className = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8';
  
  const navContent = document.createElement('div');
  navContent.className = 'flex justify-between h-16';
  
  const left = document.createElement('div');
  left.className = 'flex items-center';
  
  const logo = document.createElement('a');
  logo.href = '#/';
  logo.className = 'flex items-center space-x-2';
  logo.innerHTML = '<span class="text-2xl">🧠</span><span class="text-xl font-bold text-gray-900">AI Flashcards</span>';
  
  left.appendChild(logo);
  
  const right = document.createElement('div');
  right.className = 'flex items-center space-x-4';
  
  const token = localStorage.getItem('token');
  
  if (token) {
    const dashboardLink = document.createElement('a');
    dashboardLink.href = '#/';
    dashboardLink.className = 'text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium';
    dashboardLink.textContent = 'Мои колоды';
    
    const logoutBtn = document.createElement('button');
    logoutBtn.className = 'btn-secondary text-sm';
    logoutBtn.textContent = 'Выйти';
    logoutBtn.onclick = () => {
      api.clearToken();
      window.location.hash = '#/login';
    };
    
    right.appendChild(dashboardLink);
    right.appendChild(logoutBtn);
  } else {
    const loginLink = document.createElement('a');
    loginLink.href = '#/login';
    loginLink.className = 'text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium';
    loginLink.textContent = 'Войти';
    
    const registerLink = document.createElement('a');
    registerLink.href = '#/register';
    registerLink.className = 'btn-primary text-sm';
    registerLink.textContent = 'Регистрация';
    
    right.appendChild(loginLink);
    right.appendChild(registerLink);
  }
  
  navContent.appendChild(left);
  navContent.appendChild(right);
  nav.appendChild(navContent);
  header.appendChild(nav);
  
  return header;
}
