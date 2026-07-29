'use client'

import { useState } from "react"
import { AIChatBlock } from "@/components/ai-chat-interface"


export function TextInputAndOutput(){
  const [prompt, setPrompt] = useState('')
  const [llmResponse, setLlmResponse] = useState('')

  async function communicateWithBackend() {
    const payload = {'user_question' : prompt}
    
    //fetch code
    const response = await fetch(`${process.env.NEXT_PUBLIC_RENDER_API_URL}/prompt`, {
      method: "POST",
      headers: {'Content-type' : 'application/json'}, //mandatory metadata to get Pydantic to read the JSON properly
      body: JSON.stringify(payload) //turn the variable into a string and transmit safely as JSON
    });

    const reply = await response.json();
    setLlmResponse(reply.answer)
    //this thing unpack the JSON the backen returns
    }


  //html UI display on page
  return(
    <div>
      <AIChatBlock/>
    </div>
    
  );

}

//dun




















export default function HomePage()
{
  const [numberTracker, numberSetter] = useState(0)

  return (
    <div>
      <hr/>
      <h1>
        AI chat with ur source
      </h1>
      <TextInputAndOutput />
    </div>
  )
}


















