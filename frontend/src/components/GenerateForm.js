import { api } from '../api.js';
import { showNotification } from '../utils.js';

export function GenerateForm(deckId, onSuccess = null) {
  const container = document.createElement('div');
  container.className = 'bg-white rounded-xl shadow-md border border-gray-200 p-6';
  
  const header = document.createElement('div');
  header.className = 'mb-4';
  header.innerHTML = `
    <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
      <span class="text-xl">✨</span> Генерация карточек из текста
    </h3>
    <p class="text-sm text-gray-600 mt-1">Вставьте учебный материал, AI создаст карточки автоматически</p>
  `;
  
  const form = document.createElement('form');
  form.className = 'space-y-4';
  
  const textGroup = document.createElement('div');
  textGroup.innerHTML = `
    <label class="block text-sm font-medium text-gray-700 mb-1">Текст для изучения</label>
    <textarea name="text" required rows="6" class="input-field" placeholder="Вставьте вашу лекцию или учебный материал сюда..."></textarea>
  `;
  
  const numCardsGroup = document.createElement('div');
  numCardsGroup.innerHTML = `
    <label class="block text-sm font-medium text-gray-700 mb-1">Количество карточек</label>
    <select name="num_cards" class="input-field">
      <option value="3">3 карточки</option>
      <option value="5" selected>5 карточек</option>
      <option value="10">10 карточек</option>
      <option value="15">15 карточек</option>
    </select>
  `;
  
  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'btn-primary w-full flex items-center justify-center gap-2';
  submitBtn.innerHTML = '<span>🚀</span> Сгенерировать карточки';
  
  form.appendChild(textGroup);
  form.appendChild(numCardsGroup);
  form.appendChild(submitBtn);
  
  form.onsubmit = async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="animate-spin">⏳</span> Генерация...';
    
    try {
      const text = textGroup.querySelector('textarea').value;
      const numCards = parseInt(numCardsGroup.querySelector('select').value);
      await api.generateFlashcards(deckId, text, numCards);
      showNotification(`Создано ${numCards} карточек!`, 'success');
      textGroup.querySelector('textarea').value = '';
      if (onSuccess) onSuccess();
    } catch (error) {
      showNotification(error.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>🚀</span> Сгенерировать карточки';
    }
  };
  
  container.appendChild(header);
  container.appendChild(form);
  
  return container;
}
