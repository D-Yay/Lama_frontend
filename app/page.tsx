'use client'

import { useState } from "react"


export function TextInputAndOutput(){
  const [prompt, setPrompt] = useState('')
  const [llmResponse, setLlmResponse] = useState('')

  async function communicateWithBackend() {
    const payload = {'user_question' : prompt}
    
    //error diagnosis before fetch
    console.log("URL is:", process.env.NEXT_PUBLIC_RENDER_API_URL)

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
      <input
      //this is the tag that creates a typing field
        type = 'text'
        placeholder = 'Ask the AI something bout the context'
        //the faded text in the box that dissapear when user type sumthin
        value = {prompt}
        //the displayed value
        onChange={(typedCharacter) => setPrompt(typedCharacter.target.value)}
        //what inside () is the recorded input, we name the variable typedCharacter
        //So the typed character is stored in the variable typedCharacter
        //typedCharacter.target is the input box itself
        //.value is the value of the input box

        />
      <button onClick={() => communicateWithBackend()}>
        Send prompt to AI
      </button>

      <p>
        AI answer: {llmResponse}
      </p>

    </div>
  );

}






















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


















