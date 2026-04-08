import { escapeHtml, formatDate } from '../utils.js';

export function DeckCardComponent(deck) {
  const card = document.createElement('a');
  card.href = `#/deck/${deck.id}`;
  card.className = 'block bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg hover:border-primary-300 transition-all duration-200';
  
  const title = document.createElement('h3');
  title.className = 'text-xl font-bold text-gray-900 mb-2';
  title.textContent = deck.title;
  
  const description = document.createElement('p');
  description.className = 'text-gray-600 text-sm mb-4 line-clamp-2';
  description.textContent = deck.description || 'Без описания';
  
  const footer = document.createElement('div');
  footer.className = 'flex justify-between items-center text-xs text-gray-500';
  
  const date = document.createElement('span');
  date.textContent = formatDate(deck.created_at);
  
  const count = document.createElement('span');
  count.className = 'bg-primary-100 text-primary-700 px-2 py-1 rounded-full';
  count.textContent = `${deck.flashcards?.length || 0} карточек`;
  
  footer.appendChild(date);
  footer.appendChild(count);
  
  card.appendChild(title);
  card.appendChild(description);
  card.appendChild(footer);
  
  return card;
}
