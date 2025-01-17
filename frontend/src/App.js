// import React from 'react';
// import MedBot from './components/MedBot'; // Si MedBot est dans `src/components/MedBot.js`

// function App() {
//   return (
//     <div className="App">
//       <MedBot />
//     </div>
//   );
// }

// export default App;




// import React, { useState } from "react";
// import "./App.css";

// const App = () => {
//   const [messages, setMessages] = useState([
//     { text: "Bonjour ! Comment puis-je vous aider aujourd'hui ?", sender: "bot" },
//   ]);
//   const [userInput, setUserInput] = useState("");
//   const [isTyping, setIsTyping] = useState(false);

//   const handleSendMessage = () => {
//     if (userInput.trim() !== "") {
//       setMessages([...messages, { text: userInput, sender: "user" }]);
//       setUserInput("");
//       setIsTyping(true);

//       // Simuler la réponse du bot après un délai
//       setTimeout(() => {
//         setMessages((prevMessages) => [
//           ...prevMessages,
//           { text: "MediBot est en train d'écrire...", sender: "bot" },
//         ]);
//         setIsTyping(false);
//       }, 2000);
//     }
//   };

//   return (
//     <div className="app">
//       <div className="header">
//         <h1>MediBot</h1>
//         <p>Votre assistant médical intelligent</p>
//       </div>

//       <div className="chat-container">
//         {messages.map((message, index) => (
//           <div
//             key={index}
//             className={`message-bubble ${
//               message.sender === "user" ? "user-message" : "bot-message"
//             }`}
//           >
//             {message.text}
//           </div>
//         ))}

//         {isTyping && (
//           <div className="typing-indicator">
//             <span>.</span>
//             <span>.</span>
//             <span>.</span>
//           </div>
//         )}
//       </div>

//       <div className="chat-input">
//         <div className="actions">
//           <button className="action-button">
//             <i className="bi bi-mic"></i>
//           </button>
//           <button className="action-button">
//             <i className="bi bi-camera"></i>
//           </button>
//         </div>
//         <input
//           type="text"
//           className="input-field"
//           placeholder="Tapez votre message..."
//           value={userInput}
//           onChange={(e) => setUserInput(e.target.value)}
//         />
//         <button className="send-button" onClick={handleSendMessage}>
//           <i className="bi bi-send"></i>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default App;




// import React, { useState, useEffect } from "react";
// import "./App.css";

// const App = () => {
//   const [messages, setMessages] = useState([
//     { text: "Bonjour ! Comment puis-je vous aider aujourd'hui ?", sender: "bot" },
//   ]);
//   const [userInput, setUserInput] = useState("");

//   const handleSendMessage = () => {
//     if (userInput.trim() !== "") {
//       setMessages([...messages, { text: userInput, sender: "user" }]);
//       setUserInput("");

//       // Simuler la réponse du bot
//       setTimeout(() => {
//         setMessages((prevMessages) => [
//           ...prevMessages,
//           { text: "MediBot est en train d'écrire...", sender: "bot" },
//         ]);
//       }, 2000);
//     }
//   };

//   return (
//     <div className="app">
//       <div className="header">
//         <h1>MediBot</h1>
//         <p>Votre assistant médical intelligent</p>
//       </div>

//       <div className="chat-container">
//         {messages.map((message, index) => (
//           <div
//             key={index}
//             className={`message-bubble ${
//               message.sender === "user" ? "user-message" : "bot-message"
//             }`}
//           >
//             {message.text}
//           </div>
//         ))}
//       </div>

//       <div className="chat-input">
//         <div className="actions">
//           <button className="action-button">
//             <i className="bi bi-mic"></i>
//           </button>
//           <button className="action-button">
//             <i className="bi bi-camera"></i>
//           </button>
//         </div>
//         <div className="input-wrapper">
//           <input
//             type="text"
//             className="input-field"
//             placeholder="Tapez votre message..."
//             value={userInput}
//             onChange={(e) => setUserInput(e.target.value)}
//           />
//           <button className="send-button" onClick={handleSendMessage}>
//             <i className="bi bi-send"></i>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default App;




// App.js
import React from "react";
import "./App.css";
import { Mic, Camera, Send } from "lucide-react";

function App() {
  const [messages, setMessages] = React.useState([
    { text: "Bonjour ! Comment puis-je vous aider aujourd'hui ?", sender: "bot" }
  ]);
  const [inputText, setInputText] = React.useState("");
  const [isRecording, setIsRecording] = React.useState(false);
  const [audioBlob, setAudioBlob] = React.useState(null);
  const [selectedImage, setSelectedImage] = React.useState(null);

  const handleSendMessage = () => {
    if (inputText.trim()) {
      setMessages([...messages, { text: inputText, sender: "user" }]);
      setInputText("");

      // Simuler une réponse du bot
      setTimeout(() => {
        setMessages(prev => [...prev, 
          { text: "MediBot est en train d'écrire...", sender: "bot" }
        ]);
      }, 1000);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0d1b2a]">
      {/* En-tête */}
      <div className="bg-[#0d1b2a] p-2 text-gray-300 text-center text-sm border-b border-gray-800">
        Votre assistant médical intelligent
      </div>

      {/* Zone des messages */}
      <div className="flex-grow overflow-auto p-4 bg-[#0d1b2a]">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                message.sender === 'user' 
                ? 'bg-blue-600 text-white'
                : 'bg-[#1b2838] text-gray-200'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>

      {/* Zone de saisie */}
      <div className="p-3 bg-[#1b2838]">
        <div className="relative flex items-center">
          {/* Boutons à gauche */}
          <div className="absolute left-2 flex space-x-2">
            <button className="p-2 text-blue-500 hover:text-blue-400 transition-colors">
              <Mic className="w-6 h-6" />
            </button>
            <label className="p-2 text-blue-500 hover:text-blue-400 transition-colors cursor-pointer">
              <Camera className="w-6 h-6" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Champ de saisie */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Tapez votre message..."
            className="w-full bg-[#2a3f5a] text-gray-200 rounded-lg py-4 px-20 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />

          {/* Bouton d'envoi */}
          <button 
            onClick={handleSendMessage}
            className="absolute right-2 p-2 text-blue-500 hover:text-blue-400 transition-colors"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;