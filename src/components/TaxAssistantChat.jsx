import React, { useState, useRef, useEffect } from 'react';
import './TaxAssistantChat.css';

const SYSTEM_PROMPT_GENERAL = `You are an expert Indian income tax advisor specialising in FY 2025-26 (Assessment Year 2026-27) for salaried individuals. Answer in plain English, explain jargon simply, and keep answers to 3-5 lines unless the user asks for detail. Stay focused on Indian income tax only — politely decline unrelated questions.`;

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
// Use the exact model name from instructions, or fallback to known if user explicitly wants exactly this string.
const MODEL_NAME = 'claude-sonnet-4-20250514'; 

const SUGGESTIONS = [
  "Should I choose Old or New Regime?",
  "What is 80C and 80D?",
  "How to save tax on a 15 LPA salary?"
];

export default function TaxAssistantChat({ inputs, results }) {
  const [messages, setMessages] = useState([]);
  const [inputStr, setInputStr] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useTaxData, setUseTaxData] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const getSystemPrompt = () => {
    if (!useTaxData) return SYSTEM_PROMPT_GENERAL;
    
    // Personalized Mode
    const profile = `
      Gross Salary: ₹${(Number(inputs.grossSalary) || 0).toLocaleString('en-IN')}
      Age Group: ${inputs.ageGroup === 'below60' ? '<60' : inputs.ageGroup === '60to79' ? '60-79' : '80+'}
      Old Regime Tax: ₹${(results?.old?.taxLiability || 0).toLocaleString('en-IN')}
      New Regime Tax: ₹${(results?.new?.taxLiability || 0).toLocaleString('en-IN')}
      Recommended Regime: ${results?.recommendedRegime === 'old' ? 'Old Regime' : 'New Regime'}
      Total Deductions (Old): ₹${(results?.old?.totalDeductions || 0).toLocaleString('en-IN')}
    `;

    return `You are an expert Indian tax advisor. Answer using the user's profile: ${profile}. Use these numbers when answering. Be specific. Be friendly and advisory. Answer in plain English, explain jargon simply, and keep answers to 3-5 lines unless asked for detail.`;
  };

  const handleSend = async (textOverride) => {
    const text = textOverride || inputStr.trim();
    if (!text) return;

    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInputStr('');
    setIsLoading(true);

    try {
      if (!API_KEY) {
        throw new Error("Missing VITE_ANTHROPIC_API_KEY in .env");
      }

      // Format history for Anthropic API
      const apiMessages = newMessages.map(m => ({
        role: m.role === 'error' ? 'assistant' : m.role, // Anthropic only accepts user/assistant
        content: m.content
      })).filter(m => m.role === 'user' || m.role === 'assistant');

      const response = await fetch(ANTHROPIC_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true' // Required for client-side fetch
        },
        body: JSON.stringify({
          model: MODEL_NAME,
          max_tokens: 1000,
          system: getSystemPrompt(),
          messages: apiMessages
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "API Request Failed");
      }

      setMessages([...newMessages, { role: 'assistant', content: data.content[0].text }]);
    } catch (error) {
      console.error('Chat API Error:', error);
      setMessages([...newMessages, { role: 'error', content: `Error: ${error.message}. Make sure Anthropic API Key is set in .env` }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!API_KEY) {
    return (
      <div className="chat-container">
        <h3 className="chat-title">🤖 Ask Your Tax Assistant</h3>
        <div className="chat-info-box">
          <p>⚠️ <strong>Setup Required</strong></p>
          <p>Please add your Anthropic API Key to the <code>.env</code> file to enable the AI Tax Assistant.</p>
          <pre style={{background: 'rgba(0,0,0,0.2)', padding: '0.5rem', marginTop: '0.5rem', borderRadius: 4, textAlign: 'left', fontSize: '0.85rem'}}>VITE_ANTHROPIC_API_KEY=sk-ant-...</pre>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container slide-down">
      <div className="chat-header">
        <div>
          <h3 className="chat-title">🤖 Ask Your Tax Assistant</h3>
          <p className="chat-subtitle">Powered by AI to answer your specific tax queries.</p>
        </div>
        <div 
          className={`chat-data-toggle ${useTaxData ? 'active' : ''}`}
          onClick={() => setUseTaxData(!useTaxData)}
        >
          💡 Use My Tax Data {useTaxData ? '(ON)' : '(OFF)'}
        </div>
        {useTaxData && (
          <div className="chat-privacy-note">
            Privacy Note: Your calculated numbers will be sent to the AI to provide personalized answers.
          </div>
        )}
      </div>

      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="chat-suggestions">
            {SUGGESTIONS.map((s, i) => (
              <button key={i} className="chat-suggestion-chip" onClick={() => handleSend(s)}>
                {s}
              </button>
            ))}
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`chat-message ${m.role}`}>
            {m.content.split('\n').map((line, j) => (
              <React.Fragment key={j}>
                {line}
                {j < m.content.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </div>
        ))}
        
        {isLoading && (
          <div className="chat-message assistant">
            <div className="typing-indicator">
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="chat-input-area">
        <input 
          type="text" 
          className="chat-input"
          placeholder="Ask me anything about your taxes..."
          value={inputStr}
          onChange={e => setInputStr(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          disabled={isLoading}
        />
        <button 
          className="chat-send-btn" 
          onClick={() => handleSend()}
          disabled={isLoading || !inputStr.trim()}
        >
          Ask &rarr;
        </button>
      </div>
    </div>
  );
}
