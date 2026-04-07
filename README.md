# AI Flashcards 🧠

AI-Flashcards is a web application that automatically generates study flashcards from any input text using LLM power.

## Demo
![Demo Placeholder](https://via.placeholder.com/800x450?text=AI+Flashcards+Interface+Demo)

## Product Context
- **Target Users:** Students and lifelong learners.
- **Problem:** Manually creating flashcards from long lectures is time-consuming and tedious.
- **Solution:** Instant generation of high-quality Q&A pairs using GPT-4o-mini, allowing users to focus on studying instead of preparation.

## Features
### Implemented
- [x] Text-to-Flashcards generation using OpenAI API.
- [x] Persistent storage of cards in SQLite.
- [x] Minimalist, responsive Vanilla JS frontend.
- [x] Interactive card flipping (Question/Answer).
- [x] Fully dockerized environment.

### Not yet implemented
- [ ] User authentication and private decks.
- [ ] Export to Anki/Quizlet.
- [ ] PDF/Image upload support.
- [ ] Spaced repetition (SRS) scheduling.

## Usage
1. Open the web interface.
2. Paste your study material into the text area.
3. Click **"Generate Flashcards"**.
4. Wait a few seconds for the AI to process.
5. Click on any card to flip it and see the answer.

## Deployment
To deploy this project locally or on a server:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/KamilDV/se-toolkit-hackathon.git
   cd se-toolkit-hackathon
   ```

2. **Configure environment:**
   Create a `.env` file in the root directory:
   ```env
   OPENAI_API_KEY=your_api_key_here
   ```

3. **Run with Docker Compose:**
   ```bash
   docker compose up --build -d
   ```
   The frontend will be available at `http://localhost` and the backend at `http://localhost:8000`.
