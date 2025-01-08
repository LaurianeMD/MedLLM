import React, { useState, useRef, useEffect } from "react";
import { Mic, Camera, Send, AlertTriangle } from "lucide-react";

const MediBot = () => {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Bonjour ! Comment puis-je vous aider aujourd'hui ?" }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        chunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/wav" });
        setAudioBlob(audioBlob);
        chunksRef.current = [];
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Erreur lors de l'enregistrement audio :", err);
      setError("Erreur d'accès au microphone. Veuillez vérifier vos permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleSubmit = async () => {
    if (!inputText.trim() && !audioBlob && !selectedImage) return;

    setIsTyping(true);
    setError(null);

    try {
      // Envoi du texte
      if (inputText.trim()) {
        const userMessage = inputText; // Sauvegarder le message de l'utilisateur
        setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
        setInputText(""); // Réinitialiser le champ immédiatement

        const response = await fetch("http://127.0.0.1:8000/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ message: userMessage }),
        });

        if (!response.ok) throw new Error("Erreur lors de l'appel à l'API texte");

        const data = await response.json();
        setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
      }

      // Envoi de l'audio
      if (audioBlob) {
        const formData = new FormData();
        formData.append("file", audioBlob, "recording.wav");

        const response = await fetch("http://127.0.0.1:8000/api/chat", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error("Erreur lors de l'appel à l'API audio");

        const data = await response.json();
        setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
        setAudioBlob(null);
      }

      // Envoi de l'image
      if (selectedImage) {
        const formData = new FormData();
        formData.append("file", selectedImage);

        const response = await fetch("http://127.0.0.1:8000/api/chat", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error("Erreur lors de l'appel à l'API image");

        const data = await response.json();
        setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
        setSelectedImage(null);
      }
    } catch (err) {
      console.error("Erreur:", err);
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsTyping(false);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <div className="flex-grow overflow-auto p-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`my-2 ${msg.role === "assistant" ? "text-left" : "text-right"}`}
          >
            <span
              className={`inline-block p-2 rounded-lg ${
                msg.role === "assistant" ? "bg-blue-500" : "bg-green-500"
              }`}
            >
              {msg.content}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
        {isTyping && (
          <div className="text-left my-2">
            <span className="inline-block bg-blue-500 p-2 rounded-lg">
              <span className="animate-pulse">●</span> MediBot est en train d'écrire...
            </span>
          </div>
        )}
      </div>
      <div className="p-4 bg-gray-800">
        {error && (
          <div className="mb-4 bg-red-500 text-white p-2 rounded-lg">
            <AlertTriangle className="inline mr-2" />
            {error}
          </div>
        )}
        <div className="flex gap-2 mb-4">
          <button
            onClick={toggleRecording}
            className={`p-2 rounded-full ${isRecording ? "bg-red-500" : "bg-gray-700"}`}
          >
            <Mic className="w-6 h-6" />
          </button>
          <label htmlFor="image-input" className="p-2 bg-gray-700 rounded-full cursor-pointer">
            <Camera className="w-6 h-6" />
          </label>
          <input
            id="image-input"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
            className="flex-grow p-2 rounded-lg bg-gray-700"
            placeholder="Tapez votre message..."
          />
          <button
            onClick={handleSubmit}
            disabled={!inputText.trim() && !audioBlob && !selectedImage}
            className="p-2 bg-blue-500 rounded-lg"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MediBot;
