# from fastapi import FastAPI, UploadFile, Form
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# from typing import Optional
# from transformers import pipeline
# import time
# import os
# import soundfile as sf
# import logging


# # Initialisation de l'application FastAPI
# app = FastAPI(title="MediBot API")

# # Configuration des CORS
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Configuration des logs
# logging.basicConfig(level=logging.INFO)

# # Initialisation des pipelines
# translator = pipeline("translation", model="facebook/nllb-200-distilled-600M")
# medical_model = pipeline("text-generation", model="SumayyaAli/tiny-llama-1.1b-chat-medical")
# asr_model = pipeline("automatic-speech-recognition", model="openai/whisper-small")
# narrator_fr = pipeline("text-to-speech", model="facebook/mms-tts-fra")

# @app.post("/api/chat")
# async def process_chat(
#     message: Optional[str] = Form(None), 
#     file: Optional[UploadFile] = None
# ):
#     if not message and not file:
#         return {"error": "Veuillez fournir un message ou un fichier audio."}

#     try:
#         start_time = time.time()
#         final_response = None

#         # Traitement pour le message texte
#         if message:
#             logging.info("Traitement du message texte.")
#             english_text = translator([message], src_lang="fra_Latn", tgt_lang="eng_Latn")
#             translated_text = english_text[0]["translation_text"]

#             llm_response = medical_model(translated_text, max_length=500, num_return_sequences=1)
#             generated_text = llm_response[0]["generated_text"]

#             french_response = translator([generated_text], src_lang="eng_Latn", tgt_lang="fra_Latn")
#             final_response = french_response[0]["translation_text"]

#         # Traitement pour le fichier audio
#         elif file:
#             logging.info("Traitement du fichier audio.")
#             audio_path = f"temp_audio_{int(time.time())}.wav"
#             with open(audio_path, "wb") as audio_file:
#                 audio_file.write(await file.read())

#             asr_output = asr_model(audio_path)
#             recognized_text = asr_output["text"]

#             english_text = translator([recognized_text], src_lang="fra_Latn", tgt_lang="eng_Latn")
#             translated_text = english_text[0]["translation_text"]

#             llm_response = medical_model(translated_text, max_length=500, num_return_sequences=1)
#             generated_text = llm_response[0]["generated_text"]

#             french_response = translator([generated_text], src_lang="eng_Latn", tgt_lang="fra_Latn")
#             final_response = french_response[0]["translation_text"]

#             narrated_text = narrator_fr(final_response)
#             narrated_audio = narrated_text["audio"]
#             narrated_audio_path = f"narrated_audio_{int(time.time())}.wav"
#             sf.write(narrated_audio_path, narrated_audio, samplerate=narrated_text["sampling_rate"])

#             # Supprimer le fichier temporaire
#             if os.path.exists(audio_path):
#                 os.remove(audio_path)

#         processing_time = time.time() - start_time
#         return {
#             "response": final_response,
#             "processing_time": processing_time
#         }

#     except Exception as e:
#         logging.error("Erreur : %s", str(e))
#         return {"error": str(e)}

# @app.get("/")
# def root():
#     return {"message": "Bienvenue sur l'API MediBot !"}

from fastapi import FastAPI, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from transformers import pipeline
import time
import os
import soundfile as sf
import logging

# Initialisation de l'application FastAPI
app = FastAPI(title="MedBot API")

# Configuration des CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration des logs
logging.basicConfig(level=logging.INFO)

# Initialisation des pipelines
translator = pipeline("translation", model="facebook/nllb-200-distilled-600M")
# medical_model = pipeline("text-generation", model="LaurianeMD/MedLlama3.2-3B-V2")
medical_model = pipeline("text-generation", model="SumayyaAli/tiny-llama-1.1b-chat-medical")
asr_model = pipeline("automatic-speech-recognition", model="openai/whisper-small")
narrator_fr = pipeline("text-to-speech", model="facebook/mms-tts-fra")

@app.post("/api/chat")
async def process_chat(
    message: Optional[str] = Form(None), 
    file: Optional[UploadFile] = None
):
    if not message and not file:
        return {"error": "Veuillez fournir un message ou un fichier audio."}

    try:
        start_time = time.time()
        final_response = None

        # Traitement pour le message texte
        if message:
            logging.info("Traitement du message texte.")
            english_text = translator([message], src_lang="fra_Latn", tgt_lang="eng_Latn")
            translated_text = english_text[0]["translation_text"]

            llm_response = medical_model(translated_text, max_length=500, num_return_sequences=1)
            generated_text = llm_response[0]["generated_text"]

            french_response = translator([generated_text], src_lang="eng_Latn", tgt_lang="fra_Latn")
            final_response = french_response[0]["translation_text"]

        # Traitement pour le fichier audio
        elif file:
            logging.info("Traitement du fichier audio.")
            audio_path = f"temp_audio_{int(time.time())}.wav"
            with open(audio_path, "wb") as audio_file:
                audio_file.write(await file.read())

            asr_output = asr_model(audio_path)
            recognized_text = asr_output["text"]

            english_text = translator([recognized_text], src_lang="fra_Latn", tgt_lang="eng_Latn")
            translated_text = english_text[0]["translation_text"]

            llm_response = medical_model(translated_text, max_length=500, num_return_sequences=1)
            generated_text = llm_response[0]["generated_text"]

            french_response = translator([generated_text], src_lang="eng_Latn", tgt_lang="fra_Latn")
            final_response = french_response[0]["translation_text"]

            narrated_text = narrator_fr(final_response)
            narrated_audio = narrated_text["audio"]
            narrated_audio_path = f"narrated_audio_{int(time.time())}.wav"
            sf.write(narrated_audio_path, narrated_audio, samplerate=narrated_text["sampling_rate"])

            # Supprimer le fichier temporaire
            if os.path.exists(audio_path):
                os.remove(audio_path)

        processing_time = time.time() - start_time
        return {
            "response": final_response,
            "processing_time": processing_time
        }

    except Exception as e:
        logging.error("Erreur : %s", str(e))
        return {"error": str(e)}

@app.get("/")
def root():
    return {"message": "Bienvenue sur l'API MedBot !"}
