from google import genai
from decouple import config
import json
import re


def get_gemini_response(message):
    """
    Envía un mensaje a Gemini y devuelve la respuesta.

    Args:
        message (str): Mensaje del usuario

    Returns:
        str: Respuesta generada por Gemini
    """
    api_key = config("GEMINI_API_KEY", default=None)
    if not api_key:
        raise ValueError("GEMINI_API_KEY no está configurada en el archivo .env")

    try:
        client = genai.Client(api_key=api_key)

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=message
        )

        return response.text

    except Exception as e:
        print("ERROR GEMINI:", e)
        raise


def get_gemini_response_with_intent(message, user_context=None):
    """
    Envía un mensaje a Gemini y devuelve una respuesta estructurada con intent.

    Args:
        message (str): Mensaje del usuario
        user_context (dict): Contexto del usuario (opcional)

    Returns:
        dict: {
            "intent": str,  # OPEN_RECIPE, ADD_PANTRY_ITEM, ADD_FAVORITE, SEARCH_RECIPES, CHAT
            "data": dict,   # Datos específicos del intent
            "message": str  # Mensaje amigable para el usuario
        }
    """
    api_key = config("GEMINI_API_KEY", default=None)
    if not api_key:
        raise ValueError("GEMINI_API_KEY no está configurada en el archivo .env")

    # System prompt para detección de intents
    system_prompt = """Eres un asistente de cocina inteligente. Analiza el mensaje del usuario y determina su intención.

Debes responder SIEMPRE en formato JSON con esta estructura:
{
  "intent": "TIPO_DE_INTENT",
  "data": {...},
  "message": "Mensaje amigable para el usuario"
}

INTENTS DISPONIBLES:

171. OPEN_RECIPE: Cuando el usuario quiere ver una receta específica
   - data: {"recipe_id": number}
   - Ejemplos: "abre la receta 5", "muéstrame la receta de pollo"

2. OPEN_MY_RECIPES: Cuando el usuario quiere ver sus propias recetas
   - data: {}
   - Ejemplos: "mis recetas", "ver mis recetas", "quiero ver lo que he cocinado"

3. OPEN_FAVORITES: Cuando el usuario quiere ver sus recetas favoritas o guardadas
   - data: {}
   - Ejemplos: "mis favoritos", "ver mis recetas guardadas", "enséñame mis favoritos"

4. ADD_PANTRY_ITEM: Cuando el usuario quiere agregar ingredientes a su despensa
   - data: {"ingredient_name": string, "quantity": number, "unit": string}
   - Ejemplos: "agrega 2 tomates", "tengo 500g de arroz"

5. ADD_FAVORITE: Cuando el usuario quiere guardar una receta en favoritos
   - data: {"recipe_id": number}
   - Ejemplos: "guarda esta receta", "agrega la receta 5 a favoritos"

6. SEARCH_RECIPES: Cuando el usuario quiere buscar recetas
   - data: {"search": string, "with_ingredients": [strings], "without_ingredients": [strings]}
   - Ejemplos: "busca recetas con pollo", "qué puedo cocinar con arroz"

7. CHAT: Para conversación general o cuando no hay una acción específica
   - data: {}
   - Ejemplos: "hola", "¿qué es una receta?", "gracias"

IMPORTANTE:
- Si el usuario menciona un número de receta, usa ese ID
- Si menciona un nombre de receta pero no un ID, usa recipe_id: null y menciona en el mensaje que necesitas el ID
- Para ingredientes, extrae cantidad y unidad del mensaje
- Siempre incluye un mensaje amigable y útil
- Si no estás seguro del intent, usa CHAT

Responde SOLO con el JSON, sin texto adicional."""

    try:
        client = genai.Client(api_key=api_key)

        # Construir el mensaje completo con system prompt
        full_message = f"{system_prompt}\n\nMensaje del usuario: {message}"

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=full_message
        )

        response_text = response.text.strip()

        # Intentar extraer JSON de la respuesta
        try:
            # Buscar JSON en la respuesta (puede venir con markdown)
            json_match = re.search(r'\{[\s\S]*\}', response_text)
            if json_match:
                json_str = json_match.group(0)
                intent_data = json.loads(json_str)
                
                # Validar estructura
                if "intent" not in intent_data:
                    raise ValueError("Missing 'intent' field")
                if "message" not in intent_data:
                    raise ValueError("Missing 'message' field")
                if "data" not in intent_data:
                    intent_data["data"] = {}
                
                # Validar que el intent sea válido
                valid_intents = ["OPEN_RECIPE", "OPEN_MY_RECIPES", "OPEN_FAVORITES", "ADD_PANTRY_ITEM", "ADD_FAVORITE", "SEARCH_RECIPES", "CHAT"]
                if intent_data["intent"] not in valid_intents:
                    intent_data["intent"] = "CHAT"
                
                return intent_data
            else:
                raise ValueError("No JSON found in response")

        except (json.JSONDecodeError, ValueError) as e:
            print(f"Error parsing JSON from Gemini: {e}")
            print(f"Response was: {response_text}")
            
            # Fallback: retornar como CHAT
            return {
                "intent": "CHAT",
                "data": {},
                "message": response_text
            }

    except Exception as e:
        print("ERROR GEMINI:", e)
        # Fallback en caso de error
        return {
            "intent": "CHAT",
            "data": {},
            "message": "Lo siento, hubo un error al procesar tu mensaje. ¿Puedes intentar de nuevo?"
        }
