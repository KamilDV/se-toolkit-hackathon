import json
import logging
from typing import List, Dict, Any
from openai import AsyncOpenAI
from app.core.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


class AIService:
    def __init__(self):
        self.client = AsyncOpenAI(
            api_key=settings.OPENAI_API_KEY,
            base_url=settings.OPENAI_BASE_URL,
        )

    async def generate_flashcards(self, text: str, num_cards: int = 5) -> List[Dict[str, str]]:
        prompt = (
            f"Based on the following study text, generate {num_cards} high-quality flashcards "
            f"consisting of a question and a concise answer. Format the output as a valid "
            f"JSON array of objects, where each object has 'question' and 'answer' keys. "
            f"Only output the JSON array, nothing else.\n\n"
            f"Text: {text}"
        )

        try:
            response = await self.client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                max_tokens=2000,
            )

            content = response.choices[0].message.content.strip()
            
            # Clean potential markdown formatting
            if content.startswith("```json"):
                content = content.replace("```json", "").replace("```", "").strip()
            elif content.startswith("```"):
                content = content.replace("```", "").strip()

            cards_data = json.loads(content)
            
            if not isinstance(cards_data, list):
                raise ValueError("AI response is not a list")
            
            for card in cards_data:
                if "question" not in card or "answer" not in card:
                    raise ValueError("Invalid card format")
            
            return cards_data[:num_cards]

        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse AI response as JSON: {e}")
            raise ValueError("Не удалось распознать ответ AI")
        except Exception as e:
            logger.error(f"Error generating flashcards: {e}")
            raise
