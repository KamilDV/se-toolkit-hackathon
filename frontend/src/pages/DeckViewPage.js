import { api } from '../api.js';
import { showLoading, hideLoading, showNotification } from '../utils.js';
import { Header } from '../components/Header.js';
import { FlashcardComponent } from '../components/Flashcard.js';
import { GenerateForm } from '../components/GenerateForm.js';

export async function DeckViewPage(deckId) {
  const app = document.getElementById('app');
  app.innerHTML = '';
  
  // Header
  app.appendChild(Header());
  
  // Main content
  const main = document.createElement('main');
  main.className = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8';
  
  // Breadcrumb
  const breadcrumb = document.createElement('nav');
  breadcrumb.className = 'mb-6';
  breadcrumb.innerHTML = `
    <a href="#/" class="text-primary-600 hover:text-primary-700 text-sm font-medium">← Все колоды</a>
  `;
  
  // Deck header
  const deckHeader = document.createElement('div');
  deckHeader.className = 'mb-8';
  deckHeader.id = 'deck-header';
  deckHeader.innerHTML = '<div class="animate-pulse"><div class="h-8 bg-gray-200 rounded w-1/3 mb-2"></div><div class="h-4 bg-gray-200 rounded w-1/2"></div></div>';
  
  // Content grid
  const contentGrid = document.createElement('div');
  contentGrid.className = 'grid grid-cols-1 lg:grid-cols-3 gap-8';
  
  // Left column - Generate form
  const leftColumn = document.createElement('div');
  leftColumn.className = 'lg:col-span-1';
  leftColumn.id = 'generate-column';
  
  // Right column - Flashcards
  const rightColumn = document.createElement('div');
  rightColumn.className = 'lg:col-span-2';
  
  const flashcardsHeader = document.createElement('div');
  flashcardsHeader.className = 'flex justify-between items-center mb-4';
  flashcardsHeader.innerHTML = '<h3 class="text-xl font-bold text-gray-900">Карточки</h3>';
  
  const flashcardsGrid = document.createElement('div');
  flashcardsGrid.className = 'grid grid-cols-1 sm:grid-cols-2 gap-4';
  flashcardsGrid.id = 'flashcards-grid';
  
  rightColumn.appendChild(flashcardsHeader);
  rightColumn.appendChild(flashcardsGrid);
  
  contentGrid.appendChild(leftColumn);
  contentGrid.appendChild(rightColumn);
  
  main.appendChild(breadcrumb);
  main.appendChild(deckHeader);
  main.appendChild(contentGrid);
  app.appendChild(main);
  
  // Load deck info
  const loadDeck = async () => {
    try {
      const deck = await api.getDeck(deckId);
      deckHeader.innerHTML = `
        <h1 class="text-3xl font-bold text-gray-900 mb-2">${escapeHtml(deck.title)}</h1>
        ${deck.description ? `<p class="text-gray-600">${escapeHtml(deck.description)}</p>` : ''}
      `;
    } catch (error) {
      deckHeader.innerHTML = '<p class="text-red-500">Ошибка загрузки колоды</p>';
    }
  };
  
  // Load flashcards
  const loadFlashcards = async () => {
    showLoading();
    try {
      const flashcards = await api.getFlashcards(deckId);
      flashcardsGrid.innerHTML = '';
      
      if (flashcards.length === 0) {
        flashcardsGrid.innerHTML = `
          <div class="col-span-full text-center py-12 bg-white rounded-xl border border-gray-200">
            <span class="text-6xl mb-4 block">🃏</span>
            <h3 class="text-xl font-semibold text-gray-700 mb-2">Нет карточек</h3>
            <p class="text-gray-500">Сгенерируйте карточки из текста или добавьте вручную</p>
          </div>
        `;
      } else {
        flashcards.forEach(card => {
          flashcardsGrid.appendChild(FlashcardComponent(card, loadFlashcards));
        });
      }
    } catch (error) {
      showNotification('Не удалось загрузить карточки');
    } finally {
      hideLoading();
    }
  };
  
  // Add generate form
  leftColumn.appendChild(GenerateForm(deckId, loadFlashcards));
  
  // Manual add card form
  const manualForm = document.createElement('div');
  manualForm.className = 'bg-white rounded-xl shadow-md border border-gray-200 p-6 mt-4';
  manualForm.innerHTML = `
    <h3 class="text-lg font-bold text-gray-900 mb-4">Добавить карточку вручную</h3>
    <form class="space-y-3">
      <input type="text" name="question" placeholder="Вопрос" required class="input-field">
      <input type="text" name="answer" placeholder="Ответ" required class="input-field">
      <button type="submit" class="btn-secondary w-full">Добавить</button>
    </form>
  `;
  
  manualForm.querySelector('form').onsubmit = async (e) => {
    e.preventDefault();
    const question = manualForm.querySelector('input[name="question"]').value;
    const answer = manualForm.querySelector('input[name="answer"]').value;
    
    try {
      await api.createFlashcard(question, answer, deckId);
      showNotification('Карточка добавлена!', 'success');
      manualForm.querySelector('form').reset();
      loadFlashcards();
    } catch (error) {
      showNotification(error.message);
    }
  };
  
  leftColumn.appendChild(manualForm);
  
  // Initial load
  await Promise.all([loadDeck(), loadFlashcards()]);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
