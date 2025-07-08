import React, { useState } from 'react';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [conversation, setConversation] = useState([]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const updated = [...conversation, { sender: 'human', text: input }];
    setConversation(updated);
    setInput('');

    const res = await fetch('http://localhost:4000/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: input })
    });
    const data = await res.json();
    setConversation([...updated, { sender: 'ai', text: data.answer }]);
  };

  return (

    <main>
      <section className="chatbot-container">
        <div className="chatbot-header">
          <img src="/logo-scrimba.svg" className="logo" alt="Scrimba Logo" />
          <p className="sub-heading">Knowledge Bank</p>
        </div>
        {/* <div className="chatbot-conversation-container" id="chatbot-conversation-container">
        </div> */}
        <div className="chatbot-conversation-container" id="chatbot-conversation-container">
          {conversation.map((msg, idx) => (
            <div key={idx} className={msg.sender === 'human' ? 'bubble human' : 'bubble ai'}>
              {msg.text}
            </div>
          ))}
        </div>
        <div className="chatbot-input-container">
          <input value={input} onChange={(e) => setInput(e.target.value)} name="user-input" type="text" id="user-input" required/>

        
          <button id="submit-btn" class="submit-btn" onClick={sendMessage}>
            <img src="/send.svg" className="send-btn-icon" alt="Send" />
          </button>
        </div>
      </section>
    </main>
  );
}

export default App;


