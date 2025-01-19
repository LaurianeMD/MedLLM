import gradio as gr
import requests
from transformers import pipeline

# Initialisation du modèle de reconnaissance vocale
asr_model = pipeline("automatic-speech-recognition", model="openai/whisper-small")

# Fonction pour appeler l'API backend
def chatbot_interaction(message=None, audio_file=None):
    try:
        if audio_file:
            # Reconnaissance vocale locale
            recognized_text = asr_model(audio_file)["text"]
            # Envoi du texte reconnu au backend
            data = {'message': recognized_text}
            response = requests.post("http://127.0.0.1:8000/api/chat", data=data)
        elif message:
            # Envoi de message texte directement
            data = {'message': message}
            response = requests.post("http://127.0.0.1:8000/api/chat", data=data)
        else:
            return "Veuillez fournir un message ou un fichier audio."

        # Retourne la réponse de l'API
        return response.json().get('response', 'Erreur lors du traitement.')

    except Exception as e:
        return f"Erreur : {str(e)}"

# Interface utilisateur avec Gradio
interface = gr.Interface(
    fn=chatbot_interaction,
    inputs=[
        gr.Textbox(label="Message", placeholder="Entrez une question..."),
        gr.Audio(type="filepath", label="Fichier audio"),
    ],
    outputs=gr.Textbox(label="Réponse"),
    title="MedBot",
    description="Posez une question en texte ou en audio."
)

# Lancer l'interface
if __name__ == "__main__":
    interface.launch()
