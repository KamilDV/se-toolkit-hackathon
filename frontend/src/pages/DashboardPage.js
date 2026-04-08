import { api } from '../api.js';
import { showLoading, hideLoading, showNotification } from '../utils.js';
import { Header } from '../components/Header.js';
import { DeckCardComponent } from '../components/DeckCard.js';
import { CreateDeckModal } from '../components/CreateDeckModal.js';

export async function DashboardPage() {
  const app = document.getElementById('app');
  app.innerHTML = '';
  
  // Header
  app.appendChild(Header());
  
  // Main content
  const main = document.createElement('main');
  main.className = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8';
  
  // Page header
  const pageHeader = document.createElement('div');
  pageHeader.className = 'flex justify-between items-center mb-8';
  
  const title = document.createElement('h1');
  title.className = 'text-3xl font-bold text-gray-900';
  title.textContent = 'Мои колоды';
  
  const createBtn = document.createElement('button');
  createBtn.className = 'btn-primary flex items-center gap-2';
  createBtn.innerHTML = '<span>+</span> Новая колода';
  createBtn.onclick = () => {
    const modal = CreateDeckModal(() => loadDecks());
    document.body.appendChild(modal);
  };
  
  pageHeader.appendChild(title);
  pageHeader.appendChild(createBtn);
  
  // Deck grid
  const deckGrid = document.createElement('div');
  deckGrid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
  deckGrid.id = 'deck-grid';
  
  main.appendChild(pageHeader);
  main.appendChild(deckGrid);
  app.appendChild(main);
  
  // Load decks
  const loadDecks = async () => {
    showLoading();
    try {
      const decks = await api.getDecks();
      deckGrid.innerHTML = '';
      
      if (decks.length === 0) {
        deckGrid.innerHTML = `
          <div class="col-span-full text-center py-12">
            <span class="text-6xl mb-4 block">📚</span>
            <h3 class="text-xl font-semibold text-gray-700 mb-2">У вас пока нет колод</h3>
            <p class="text-gray-500 mb-4">Создайте первую колоду, чтобы начать изучение</p>
            <button onclick="document.querySelector('button').click()" class="btn-primary inline-flex items-center gap-2">
              <span>+</span> Создать колоду
            </button>
          </div>
        `;
      } else {
        decks.forEach(deck => {
          deckGrid.appendChild(DeckCardComponent(deck));
        });
      }
    } catch (error) {
      showNotification('Не удалось загрузить колоды');
    } finally {
      hideLoading();
    }
  };
  
  await loadDecks();
}
