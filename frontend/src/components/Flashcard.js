import { escapeHtml } from '../utils.js';
import { api } from '../api.js';

export function FlashcardComponent(card, onUpdate = null) {
  const container = document.createElement('div');
  container.className = 'card-flip h-64 cursor-pointer group';
  container.dataset.cardId = card.id;
  
  const inner = document.createElement('div');
  inner.className = 'card-flip-inner relative w-full h-full';
  
  // Front
  const front = document.createElement('div');
  front.className = 'card-front absolute inset-0 bg-white rounded-xl shadow-lg border border-gray-200 p-6 flex flex-col items-center justify-center';
  
  const frontLabel = document.createElement('span');
  frontLabel.className = 'text-xs font-semibold text-primary-600 uppercase tracking-wide mb-3';
  frontLabel.textContent = 'Вопрос';
  
  const frontContent = document.createElement('p');
  frontContent.className = 'text-gray-900 font-medium text-center leading-relaxed';
  frontContent.textContent = card.question;
  
  const flipHint = document.createElement('span');
  flipHint.className = 'text-xs text-gray-400 mt-4 opacity-0 group-hover:opacity-100 transition-opacity';
  flipHint.textContent = 'Нажмите для ответа';
  
  front.appendChild(frontLabel);
  front.appendChild(frontContent);
  front.appendChild(flipHint);
  
  // Back
  const back = document.createElement('div');
  back.className = 'card-back absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl shadow-lg p-6 flex flex-col items-center justify-center';
  
  const backLabel = document.createElement('span');
  backLabel.className = 'text-xs font-semibold text-white uppercase tracking-wide mb-3 opacity-80';
  backLabel.textContent = 'Ответ';
  
  const backContent = document.createElement('p');
  backContent.className = 'text-white font-medium text-center leading-relaxed';
  backContent.textContent = card.answer;
  
  back.appendChild(backLabel);
  back.appendChild(backContent);
  
  inner.appendChild(front);
  inner.appendChild(back);
  container.appendChild(inner);
  
  // Flip on click
  container.onclick = () => {
    container.classList.toggle('flipped');
  };
  
  // Actions bar
  const actions = document.createElement('div');
  actions.className = 'mt-3 flex justify-between items-center';
  
  const statusBtn = document.createElement('button');
  statusBtn.className = card.is_learned 
    ? 'text-xs text-green-600 hover:text-green-700 font-medium'
    : 'text-xs text-gray-500 hover:text-gray-600 font-medium';
  statusBtn.textContent = card.is_learned ? '✓ Изучено' : '○ Не изучено';
  statusBtn.onclick = async (e) => {
    e.stopPropagation();
    try {
      await api.updateFlashcard(card.id, { is_learned: !card.is_learned });
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error updating flashcard:', error);
    }
  };
  
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'text-xs text-red-500 hover:text-red-600 font-medium';
  deleteBtn.textContent = 'Удалить';
  deleteBtn.onclick = async (e) => {
    e.stopPropagation();
    if (confirm('Удалить карточку?')) {
      try {
        await api.deleteFlashcard(card.id);
        if (onUpdate) onUpdate();
      } catch (error) {
        console.error('Error deleting flashcard:', error);
      }
    }
  };
  
  actions.appendChild(statusBtn);
  actions.appendChild(deleteBtn);
  
  const wrapper = document.createElement('div');
  wrapper.appendChild(container);
  wrapper.appendChild(actions);
  
  return wrapper;
}
