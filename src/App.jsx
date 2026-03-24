import './App.css'
import {useState} from 'react'
import { URL } from './constants'
import Answers from './Components/Answers'

function App() {
  const [question, setquestion] = useState('')
  const [result, setResult] = useState(undefined)
  

  


  

  const payload ={
    "contents": [
          {
            "parts": [
              {
                "text": question
              }
            ]
          }
        ]
      }
  const askQuestion= async()=>{
    let response = await fetch(URL,{
    method:"POST",
    body:JSON.stringify(payload)
    })
    response = await response.json();
    let dataString=response.candidates[0].content.parts[0].text;
    dataString=dataString.split("* ");
    dataString=dataString.map((item)=>item.trim());
    //console.log(response.candidates[0].content.parts[0].text);
    setResult(dataString);
  }

  

  return (
    
      <div className="grid grid-cols-5 text-center">
        <div className="col-span-1 bg-zinc-800 h-screen text-white">
        Recent Searches
        </div>
        <div className="col-span-4 p-10">
          <div className="">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            AI ChatBot To Solve Your Doubts</h1></div>
          <div className="container m-2 text-white w-1/2 mr-4 border-white width bg-zinc-500 rounded-sm justify-between items-end" >
            {question}
          </div>
        <div className=" container h-110 overflow-y-scroll ">
        <div className="text-white">
          <ul>
          {/* {result} */}
          {
            result && result.map((item)=>(
              <li className="text-left p-1"><Answers ans={item}/></li>
            ))
          }
          </ul>
        </div>
        </div>
        <div className="bg-zinc-800 w-1/2 m-auto text-white rounded-4xl p-5 flex border border-zinc-700">
          <input className="w-full h-full outline-none" value={question} type="text" onChange={(event)=>setquestion(event.target.value)}  placeholder='Ask Me Anything'></input>
          <button onClick={askQuestion}>Ask</button>
        </div>
        </div>
      </div>
    
  )
}

export default App
