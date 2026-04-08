import { api } from '../api.js';
import { showNotification } from '../utils.js';

export function CreateDeckModal(onSuccess = null) {
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
  
  const modal = document.createElement('div');
  modal.className = 'bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4';
  
  const header = document.createElement('div');
  header.className = 'flex justify-between items-center mb-6';
  
  const title = document.createElement('h2');
  title.className = 'text-2xl font-bold text-gray-900';
  title.textContent = 'Новая колода';
  
  const closeBtn = document.createElement('button');
  closeBtn.className = 'text-gray-400 hover:text-gray-500 text-2xl';
  closeBtn.innerHTML = '&times;';
  closeBtn.onclick = () => overlay.remove();
  
  header.appendChild(title);
  header.appendChild(closeBtn);
  
  const form = document.createElement('form');
  form.className = 'space-y-4';
  
  const titleGroup = document.createElement('div');
  titleGroup.innerHTML = `
    <label class="block text-sm font-medium text-gray-700 mb-1">Название</label>
    <input type="text" name="title" required class="input-field" placeholder="Математика">
  `;
  
  const descGroup = document.createElement('div');
  descGroup.innerHTML = `
    <label class="block text-sm font-medium text-gray-700 mb-1">Описание (необязательно)</label>
    <textarea name="description" rows="3" class="input-field" placeholder="Формулы и теоремы"></textarea>
  `;
  
  const actions = document.createElement('div');
  actions.className = 'flex space-x-3';
  
  const cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.className = 'btn-secondary flex-1';
  cancelBtn.textContent = 'Отмена';
  cancelBtn.onclick = () => overlay.remove();
  
  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'btn-primary flex-1';
  submitBtn.textContent = 'Создать';
  
  actions.appendChild(cancelBtn);
  actions.appendChild(submitBtn);
  
  form.appendChild(titleGroup);
  form.appendChild(descGroup);
  form.appendChild(actions);
  
  form.onsubmit = async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = 'Создание...';
    
    try {
      const title = titleGroup.querySelector('input').value;
      const description = descGroup.querySelector('textarea').value || null;
      await api.createDeck(title, description);
      showNotification('Колода создана!', 'success');
      overlay.remove();
      if (onSuccess) onSuccess();
    } catch (error) {
      showNotification(error.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Создать';
    }
  };
  
  modal.appendChild(header);
  modal.appendChild(form);
  overlay.appendChild(modal);
  
  // Close on overlay click
  overlay.onclick = (e) => {
    if (e.target === overlay) overlay.remove();
  };
  
  return overlay;
}
