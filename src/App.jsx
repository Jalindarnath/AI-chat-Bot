import { useState } from 'react';
import './App.css';
import Answers from './Components/Answers';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
function App() {
  const [question, setQuestion] = useState('')
  const [prompt, setPrompt] = useState('') // Stores the submitted question
  const [result, setResult] = useState(undefined)
  const [loading, setLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState([])
  
  const askQuestion = async (overrideQuestion) => {
    const currentQ = typeof overrideQuestion === 'string' ? overrideQuestion : question;
    if (!currentQ.trim()) return;

    if (!API_KEY || API_KEY === "YOUR_API_KEY_HERE" || API_KEY === '""' || API_KEY === "''") {
      setResult(["Error: API Key is missing. Please add your Gemini API key to the .env file and restart the development server."]);
      return;
    }
    
    setLoading(true);
    setResult(undefined);
    setPrompt(currentQ); // lock in the question being asked
    setQuestion(currentQ); // sync the input box
    
    setRecentSearches(prev => {
      const filtered = prev.filter(q => q !== currentQ);
      return [currentQ, ...filtered].slice(0, 10);
    });

    try {
      const payload = {
        "contents": [
          {
            "parts": [
              {
                "text": currentQ
              }
            ]
          }
        ]
      };

      let response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Failed to fetch from Gemini API");
      }

      response = await response.json();
      
      let dataString = response.candidates[0].content.parts[0].text;
      
      // Basic formatting cleanup
      dataString = dataString.split("* ");
      dataString = dataString.map((item) => item.trim()).filter((item) => item.length > 0);
      
      setResult(dataString);
    } catch (error) {
      console.error(error);
      setResult(["Sorry, something went wrong while fetching the response. Please check your API key."]);
    } finally {
      setLoading(false);
      setQuestion(''); // Clear input after asking
    }
  }

  return (
      <div className="grid grid-cols-5 text-center h-screen bg-zinc-900 overflow-hidden">
        <div className="col-span-1 bg-zinc-950 h-screen text-white border-r border-zinc-800 p-5 hidden md:block overflow-y-auto">
          <h2 className="text-xl font-bold mb-4 text-left">Recent Searches</h2>
          <div className="flex flex-col gap-2">
            {recentSearches.length === 0 ? (
              <p className="text-zinc-500 text-sm italic">No recent searches yet.</p>
            ) : (
              recentSearches.map((search, idx) => (
                <button 
                  key={idx} 
                  onClick={() => askQuestion(search)}
                  className="text-left text-sm text-zinc-300 hover:text-white bg-zinc-800/50 hover:bg-zinc-700/80 rounded-lg p-3 transition-colors truncate w-full shadow-sm"
                  title={search}
                >
                  {search}
                </button>
              ))
            )}
          </div>
        </div>
        <div className="col-span-5 md:col-span-4 p-5 md:p-10 flex flex-col h-screen">
          <div className="flex-none mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI ChatBot To Solve Your Doubts
            </h1>
          </div>
          
          <div className="flex-grow flex flex-col overflow-hidden mb-6">
            <div className="w-full max-h-full overflow-y-auto px-4 flex flex-col gap-4">
              
              {prompt && (
                <div className="w-auto max-w-3/4 p-4 text-white bg-zinc-700/80 rounded-2xl rounded-tr-sm text-left self-end">
                  {prompt}
                </div>
              )}
              
              {loading && (
                <div className="w-auto max-w-3/4 p-4 text-blue-300 bg-zinc-800 rounded-2xl rounded-tl-sm text-left self-start animate-pulse">
                  Thinking...
                </div>
              )}
              
              {result && (
                <div className="w-full sm:max-w-4/5 p-5 text-zinc-200 bg-zinc-800/80 rounded-2xl rounded-tl-sm text-left self-start shadow-sm border border-zinc-700/50">
                  <ul className="flex flex-col gap-3">
                  {
                    result.map((item, index) => (
                      <li key={index} className="leading-relaxed">
                        <Answers ans={item} />
                      </li>
                    ))
                  }
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex-none bg-zinc-800/80 w-full lg:w-3/4 mx-auto text-white rounded-full p-2 flex border border-zinc-700 shadow-lg focus-within:border-zinc-500 transition-colors">
            <input 
              className="w-full h-12 px-6 outline-none bg-transparent placeholder-zinc-400" 
              value={question} 
              type="text" 
              onKeyDown={(e) => e.key === 'Enter' && askQuestion()}
              onChange={(event) => setQuestion(event.target.value)}  
              placeholder='Ask me anything...' 
            />
            <button 
              className={`px-8 py-2 rounded-full font-semibold transition ${loading || !question.trim() ? "bg-zinc-600 text-zinc-400 cursor-not-allowed" : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-md"} `}
              onClick={askQuestion} 
              disabled={loading || !question.trim()}
            >
              Ask
            </button>
          </div>
        </div>
      </div>
  )
}

export default App
