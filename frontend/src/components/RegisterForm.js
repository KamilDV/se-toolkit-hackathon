import { api } from '../api.js';
import { showNotification } from '../utils.js';

export function RegisterForm() {
  const container = document.createElement('div');
  container.className = 'min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8';
  
  const form = document.createElement('div');
  form.className = 'max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-200';
  
  // Header
  const header = document.createElement('div');
  header.className = 'text-center';
  header.innerHTML = `
    <h2 class="text-3xl font-extrabold text-gray-900 mb-2">Регистрация</h2>
    <p class="text-sm text-gray-600">Или <a href="#/login" class="text-primary-600 hover:text-primary-500 font-medium">войдите</a></p>
  `;
  
  // Form
  const formEl = document.createElement('form');
  formEl.className = 'mt-8 space-y-6';
  
  const emailGroup = document.createElement('div');
  emailGroup.innerHTML = `
    <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
    <input type="email" name="email" required class="input-field" placeholder="you@example.com">
  `;
  
  const usernameGroup = document.createElement('div');
  usernameGroup.innerHTML = `
    <label class="block text-sm font-medium text-gray-700 mb-1">Имя пользователя</label>
    <input type="text" name="username" required class="input-field" placeholder="student123" minlength="3">
  `;
  
  const passwordGroup = document.createElement('div');
  passwordGroup.innerHTML = `
    <label class="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
    <input type="password" name="password" required class="input-field" placeholder="••••••••" minlength="8">
  `;
  
  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'btn-primary w-full';
  submitBtn.textContent = 'Зарегистрироваться';
  
  formEl.appendChild(emailGroup);
  formEl.appendChild(usernameGroup);
  formEl.appendChild(passwordGroup);
  formEl.appendChild(submitBtn);
  
  formEl.onsubmit = async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = 'Регистрация...';
    
    try {
      const email = emailGroup.querySelector('input').value;
      const username = usernameGroup.querySelector('input').value;
      const password = passwordGroup.querySelector('input').value;
      await api.register(email, username, password);
      showNotification('Регистрация успешна!', 'success');
      window.location.hash = '#/';
    } catch (error) {
      showNotification(error.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Зарегистрироваться';
    }
  };
  
  form.appendChild(header);
  form.appendChild(formEl);
  container.appendChild(form);
  
  return container;
}
