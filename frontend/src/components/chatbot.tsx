import React, { useState, useEffect, useRef, useContext } from "react";
import axios from 'axios';
import ChatSession from "./current_chat_window/chatSession";
import { PostPayload, CurrentConversationItem } from "../utils/chatbotInterfaces";
import { sharedInfoContext } from "../context/sharedContext";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import VoiceToText from "./voice-to-text/voice-to-text-1";

function Chatbot() {
    const { AIResponse, SetAIResponse, payload, setPayload, currentConversation, speakerTurn, setSpeakerTurn, isLoading, setIsLoading } = useContext(sharedInfoContext);
    const inputRef = useRef<HTMLTextAreaElement>(null)
    const chatContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {}, [payload])

    useEffect(() => {
        // Scroll to bottom of current conversation history
        const chatContainer = chatContainerRef.current;
        if (chatContainer){
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }, [currentConversation]);

    useEffect(() => {
        const handleKeyPress = (event:KeyboardEvent) => {
            if (event.key === 'Enter') {
                if (!event.shiftKey) {
                    event.preventDefault(); // Prevent default behavior (new line)
                    handleSendBtn();
                }
                // If Shift+Enter is pressed, do nothing (default behavior will add a new line)
            }
        };
    
        const currentInput = inputRef.current;
        if (currentInput) {
            currentInput.addEventListener('keydown', handleKeyPress);
    
            return () => {
            currentInput.removeEventListener('keydown', handleKeyPress);
            };
        }

    });

    async function invokeBedrock() {
        setIsLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/invoke-Bedrock-GenAI', payload);
            const data = response.data;
            console.log(data);
            SetAIResponse(data); // Update the AIResponse state with the response from Bedrock

            setSpeakerTurn('bot');

            setPayload(prevPayload => ({...prevPayload, 'prompt': ''}));

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }

    }

    async function invokeBedrockAgent() {
        try {
            const response = await axios.post('http://localhost:5000/invoke-agent-knowledge-base', payload);
            const data = response.data;
            console.log(data);

            SetAIResponse(data); // Update the AIResponse state with the response from Bedrock

            setSpeakerTurn('bot');

            // setUserInput(''); // Clear the input field after the response is received
            setPayload(prevPayload => ({...prevPayload, 'prompt': ''}));

        }
        catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    async function queryBedrockKBLangchain() {
        try {
            console.log(payload);
            const response = await axios.post('http://localhost:5000/bedrock-kd-langchain', payload);
            const data = response.data;
            console.log(data);

            SetAIResponse(data); // Update the AIResponse state with the response from Bedrock

            setSpeakerTurn('bot');

            // setUserInput(''); // Clear the input field after the response is received
            setPayload(prevPayload => ({...prevPayload, 'prompt': ''}));

        }
        catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const adjustTextareaHeight = () => {
        if (inputRef.current) {
            inputRef.current.style.height = 'auto';
            inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 150)}px`;
        }
      };

    function handleSendBtn() {
        setSpeakerTurn('user');
        console.log(payload);
        invokeBedrock();
        // invokeBedrockAgent();
        // queryBedrockKBLangchain();

        if (inputRef.current) {
            inputRef.current.style.height = 'auto';
          }

    }

    function handleUserInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
        const { name, value } = e.target;
        setPayload(prevPayloadSettings => ({...prevPayloadSettings, [name]: value }));

        console.log('New Prompt:', payload)

        adjustTextareaHeight();
    }

    const handleTextChange = (text: string) => {
        setPayload({ prompt: text });
    };
    
    function handleVoice() {
        console.log('Voice to text feature not implemented yet');
        
    }

    return (
        <>
            <div className="chat-area">
                <div ref={chatContainerRef} className="chat-session">
                    {/* <!-- Chat messages will be added here --> */}
                    <div >
                        <ChatSession />
                    </div>
                </div>
                <div className="input-area">
                    <div className='w-100 d-flex justify-content-center mb-2 border border-0 rounded-pill bg-secondary'>
                        <textarea
                            ref={inputRef}
                            name="prompt"
                            className="form-control bg-secondary rounded border border-0 d-flex flex-fill ms-4 me-2 text-white"
                            placeholder="Type your message..."
                            value={payload.prompt}
                            onChange={handleUserInput}
                            rows={1}
                        ></textarea>
                        {/* <button className="voice-to-text btn btn-primary me-1 border border-0 rounded-pill my-1" onClick={() => handleVoice()}>
                            <i className='bi bi-mic p-2'></i>
                        </button> */}
                        <VoiceToText onTextChange={handleTextChange} />
                        <button className="btn btn-primary me-1 border border-0 rounded-pill my-1" onClick={handleSendBtn}>
                            <i className='bi bi-arrow-right p-2'></i>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Chatbot;