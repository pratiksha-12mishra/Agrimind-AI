"""
gemini_voice.py
Voice assistant logic for AgriMind AI.
Uses google-genai (new SDK, replaces deprecated google-generativeai)
Supported languages: Hindi (hi), Marathi (mr), Bengali (bn),
                     Tamil (ta), Gujarati (gu), English (en)
"""

# from google import genai
# from google.genai import types
import os
from dotenv import load_dotenv
from groq import Groq


# ---- Auto-load .env file ----
load_dotenv()

# # ---- Configure Gemini once at import time ----
# _GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
# if not _GEMINI_API_KEY:
#     raise ValueError(
#         "GEMINI_API_KEY not found. "
#         "Make sure it is set in your .env file."
#     )
_CLIENT = Groq(api_key=os.getenv("GROQ_API_KEY"))
# _CLIENT = genai.Client(api_key=_GEMINI_API_KEY)

# ---- Language name mapping ----
SUPPORTED_LANGUAGES = {
    "hi": "Hindi",
    "mr": "Marathi",
    "bn": "Bengali",
    "ta": "Tamil",
    "gu": "Gujarati",
    "en": "English",
}

def get_voice_response(
    query: str,
    language: str = "hi",
    farm_context: dict = None
) -> dict:
    """
    Main function called by the /voice endpoint.

    Args:
        query (str): Farmer's question
        language (str): Target response language code
        farm_context (dict): Optional current farm state

    Returns:
        dict: { response, language, language_name, query }
    """
    lang_name = SUPPORTED_LANGUAGES.get(language, "Hindi")

    context_str = ""
    if farm_context:
        context_str = f"""
Current farm data:
- Crop: {farm_context.get('crop', 'Unknown')}
- Growth Stage: {farm_context.get('growth_stage', 'Unknown')}
- Soil Moisture: {farm_context.get('soil_moisture', 'N/A')}%
- Temperature: {farm_context.get('temperature', 'N/A')}°C
- Humidity: {farm_context.get('humidity', 'N/A')}%
- Current Recommendation: {farm_context.get('decision', 'N/A')}
- Water Required: {farm_context.get('water_required', 'N/A')}
"""

    prompt = f"""You are AgriMind AI, a smart irrigation assistant for Indian farmers.

Your rules:
1. Answer ONLY questions about farming, irrigation, crops, water management, and weather
2. If asked anything unrelated to farming, politely redirect to farming topics
3. Keep answers short — maximum 3 sentences
4. Use simple, conversational language that a rural farmer can understand
5. ALWAYS respond in {lang_name} language only, regardless of what language the question is asked in
6. Be encouraging and practical — give actionable advice
7. If you mention water amounts, use litres

{context_str}

Farmer's question: {query}"""

    try:
        response = _CLIENT.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "user", "content": prompt}
            ],
            max_tokens=200,
        )
        response_text = response.choices[0].message.content.strip()

        return {
            "response": response_text,
            "language": language,
            "language_name": lang_name,
            "query": query,
        }

    except Exception as e:
        # Print real error so we can debug
        print(f"[Gemini ERROR] {type(e).__name__}: {e}")

        fallbacks = {
            "hi": "माफ़ करें, अभी सेवा उपलब्ध नहीं है। कृपया बाद में प्रयास करें।",
            "mr": "माफ करा, सध्या सेवा उपलब्ध नाही. कृपया नंतर प्रयत्न करा.",
            "bn": "দুঃখিত, এখন পরিষেবা পাওয়া যাচ্ছে না। পরে আবার চেষ্টা করুন।",
            "ta": "மன்னிக்கவும், இப்போது சேவை கிடைக்கவில்லை. பின்னர் முயற்சிக்கவும்.",
            "gu": "માફ કરશો, હાલ સેવા ઉપલબ્ધ નથી. કૃપા કરીને પછી પ્રયાસ કરો.",
            "en": "Sorry, the service is temporarily unavailable. Please try again later.",
        }
        return {
            "response": fallbacks.get(language, fallbacks["en"]),
            "language": language,
            "language_name": lang_name,
            "query": query,
        }


# ---- Quick test when run directly ----
if __name__ == "__main__":
    test_farm_context = {
        "crop": "wheat",
        "growth_stage": "flowering",
        "soil_moisture": 22.5,
        "temperature": 33.0,
        "humidity": 40.0,
        "decision": "Irrigate Now",
        "water_required": "53.6 L/m²",
    }

    test_cases = [
        ("Aaj mere khet ko kitna paani chahiye?", "hi"),
        ("When should I irrigate my wheat field?", "en"),
        ("माझ्या शेताला किती पाणी लागेल?", "mr"),
        ("আমার ক্ষেতে কখন সেচ দেব?", "bn"),
        ("என் வயலுக்கு எப்போது நீர் பாய்ச்ச வேண்டும்?", "ta"),
        ("મારા ખેતરને આજે કેટલું પાણી જોઈએ?", "gu"),
    ]

    for query, lang in test_cases:
        print(f"\nQuery ({SUPPORTED_LANGUAGES[lang]}): {query}")
        result = get_voice_response(query, lang, test_farm_context)
        print(f"Response: {result['response']}")
        print("-" * 60)