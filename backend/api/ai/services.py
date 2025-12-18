from google import genai
from decouple import config


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
