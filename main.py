import multiprocessing
import os

def launch_fastapi():
    os.system("uvicorn chatbot:app --host 0.0.0.0 --port 8000")

def launch_gradio():
    from app import interface
    interface.launch(server_name="0.0.0.0", server_port=7860)

if __name__ == "__main__":
    # Démarrez FastAPI et Gradio en parallèle
    p1 = multiprocessing.Process(target=launch_fastapi)
    p2 = multiprocessing.Process(target=launch_gradio)
    p1.start()
    p2.start()
    p1.join()
    p2.join()
