import { api } from '../api.js';
import { showNotification } from '../utils.js';

export function LoginForm() {
  const container = document.createElement('div');
  container.className = 'min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8';
  
  const form = document.createElement('div');
  form.className = 'max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-200';
  
  // Header
  const header = document.createElement('div');
  header.className = 'text-center';
  header.innerHTML = `
    <h2 class="text-3xl font-extrabold text-gray-900 mb-2">Вход в аккаунт</h2>
    <p class="text-sm text-gray-600">Или <a href="#/register" class="text-primary-600 hover:text-primary-500 font-medium">зарегистрируйтесь</a></p>
  `;
  
  // Form
  const formEl = document.createElement('form');
  formEl.className = 'mt-8 space-y-6';
  
  const emailGroup = document.createElement('div');
  emailGroup.innerHTML = `
    <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
    <input type="email" name="email" required class="input-field" placeholder="you@example.com">
  `;
  
  const passwordGroup = document.createElement('div');
  passwordGroup.innerHTML = `
    <label class="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
    <input type="password" name="password" required class="input-field" placeholder="••••••••">
  `;
  
  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'btn-primary w-full';
  submitBtn.textContent = 'Войти';
  
  formEl.appendChild(emailGroup);
  formEl.appendChild(passwordGroup);
  formEl.appendChild(submitBtn);
  
  formEl.onsubmit = async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = 'Вход...';
    
    try {
      const email = emailGroup.querySelector('input').value;
      const password = passwordGroup.querySelector('input').value;
      await api.login(email, password);
      showNotification('Успешный вход!', 'success');
      window.location.hash = '#/';
    } catch (error) {
      showNotification(error.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Войти';
    }
  };
  
  form.appendChild(header);
  form.appendChild(formEl);
  container.appendChild(form);
  
  return container;
}
