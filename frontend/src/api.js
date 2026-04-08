const API_BASE = '/api/v1';

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const config = {
      ...options,
      headers,
    };

    const response = await fetch(url, config);
    
    if (response.status === 401) {
      this.clearToken();
      window.location.hash = '#/login';
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Ошибка сервера' }));
      throw new Error(error.detail || 'Request failed');
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  }

  // Auth
  async register(email, username, password) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, username, password }),
    });
    this.setToken(data.access_token);
    return data;
  }

  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.access_token);
    return data;
  }

  async getCurrentUser() {
    return this.request('/users/me');
  }

  async updateUser(userData) {
    return this.request('/users/me', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Decks
  async getDecks() {
    return this.request('/decks/');
  }

  async getDeck(deckId) {
    return this.request(`/decks/${deckId}`);
  }

  async createDeck(title, description = null) {
    return this.request('/decks/', {
      method: 'POST',
      body: JSON.stringify({ title, description }),
    });
  }

  async updateDeck(deckId, data) {
    return this.request(`/decks/${deckId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteDeck(deckId) {
    return this.request(`/decks/${deckId}`, {
      method: 'DELETE',
    });
  }

  // Flashcards
  async getFlashcards(deckId) {
    return this.request(`/flashcards/deck/${deckId}`);
  }

  async getUnlearnedFlashcards(deckId) {
    return this.request(`/flashcards/unlearned/${deckId}`);
  }

  async createFlashcard(question, answer, deckId) {
    return this.request('/flashcards/', {
      method: 'POST',
      body: JSON.stringify({ question, answer, deck_id: deckId }),
    });
  }

  async updateFlashcard(flashcardId, data) {
    return this.request(`/flashcards/${flashcardId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteFlashcard(flashcardId) {
    return this.request(`/flashcards/${flashcardId}`, {
      method: 'DELETE',
    });
  }

  async generateFlashcards(deckId, text, numCards = 5) {
    return this.request(`/flashcards/generate/${deckId}`, {
      method: 'POST',
      body: JSON.stringify({ text, num_cards: numCards }),
    });
  }
}

export const api = new ApiClient();
