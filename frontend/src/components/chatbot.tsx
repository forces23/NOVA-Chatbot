import React, { useEffect, useRef, useContext, useState } from "react";
import axios from 'axios';
import { sharedInfoContext } from "../context/sharedContext";
import CurrentChatSession from "./current_chat_session/currentChatSession";
import VoiceToText from "./voice-to-text/voice-to-text-1";

function Chatbot() {
    const { SetAIResponse, payload, setPayload, currentConversation, setSpeakerTurn, setIsLoading, isLoading } = useContext(sharedInfoContext);
    const inputRef = useRef<HTMLTextAreaElement>(null)
    const chatContainerRef = useRef<HTMLDivElement | null>(null);
    const [isSendBtnDisabled, setIsSendBtnDisabled] = useState<boolean>(true);

    // useEffect(() => { }, [payload])

    /*
    * Scroll to bottom of current conversation history 
    * this will make sure that the user sent message will cause the auto scroll
    */
    useEffect(() => {
        const chatContainer = chatContainerRef.current;
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }, [currentConversation]);

    /*
    * Allows user to press the enter key to submit the query and 
    * allows the user to press shift+enter to go to new line within the textarea
    */
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
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

    /*
    * Makes sure that the user is not able to send an empty string and makes sure that while the ai is generating a 
    * response the user cant send another query till ai has finished
    */
    useEffect(() => {
        if (payload.prompt.trim() == '') {
            setIsSendBtnDisabled(true);
        }
        else if (isLoading) {
            setIsSendBtnDisabled(true);
        }
        else {
            setIsSendBtnDisabled(false);
        }
    }, [payload, isLoading]);

    async function invokeBedrock() {
        setIsLoading(true);
        try {
            // const response = await axios.post('http://localhost:5000/invoke-Bedrock-GenAI', payload);
            const response = await fetch('https://8fdngj09ah.execute-api.us-east-1.amazonaws.com/Prod/invoke-Bedrock-GenAI',  
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            );

            const data = response.data;
            console.log(data);
            SetAIResponse(data); // Update the AIResponse state with the response from Bedrock

            setSpeakerTurn('bot');

            setPayload(prevPayload => ({ ...prevPayload, 'prompt': '' }));

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }

    }

    // async function invokeBedrockAgent() {
    //     try {
    //         const response = await axios.post('http://localhost:5000/invoke-agent-knowledge-base', payload);
    //         const data = response.data;
    //         console.log(data);

    //         SetAIResponse(data); // Update the AIResponse state with the response from Bedrock

    //         setSpeakerTurn('bot');

    //         // setUserInput(''); // Clear the input field after the response is received
    //         setPayload(prevPayload => ({ ...prevPayload, 'prompt': '' }));

    //     }
    //     catch (error) {
    //         console.error('Error fetching data:', error);
    //     }
    // }

    // async function queryBedrockKBLangchain() {
    //     try {
    //         console.log(payload);
    //         const response = await axios.post('http://localhost:5000/bedrock-kd-langchain', payload);
    //         const data = response.data;
    //         console.log(data);

    //         SetAIResponse(data); // Update the AIResponse state with the response from Bedrock

    //         setSpeakerTurn('bot');

    //         // setUserInput(''); // Clear the input field after the response is received
    //         setPayload(prevPayload => ({ ...prevPayload, 'prompt': '' }));

    //     }
    //     catch (error) {
    //         console.error('Error fetching data:', error);
    //     }
    // }

    function adjustTextareaHeight() {
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
        setPayload(prevPayloadSettings => ({ ...prevPayloadSettings, [name]: value }));
        adjustTextareaHeight();
    }

    function handleTextChange(text: string) {
        setPayload(prevPayload => ({ ...prevPayload, 'prompt': text }));
    };


    return (
        <>
            <div className="chat-area">
                <div ref={chatContainerRef} className="current-chat-session">
                    <div >
                        <CurrentChatSession chatContainerRef={chatContainerRef} />
                    </div>
                </div>
                <div className="input-area">
                    <div className='w-100 d-flex justify-content-center mb-2 border border-0 rounded rounded-5  bg-secondary'>
                        <textarea
                            ref={inputRef}
                            name="prompt"
                            className="form-control bg-secondary rounded border border-0 d-flex flex-fill ms-4 me-2 text-white"
                            placeholder="Type your message..."
                            value={payload.prompt}
                            onChange={handleUserInput}
                            rows={1}
                            disabled={isLoading}
                        ></textarea>
                        <VoiceToText onTextChange={handleTextChange} />
                        <div className='d-flex align-items-end'>
                            <button
                                className="btn btn-primary me-2 border border-0 rounded-pill my-1"
                                onClick={handleSendBtn}
                                disabled={isSendBtnDisabled}
                            >
                                <i className='bi bi-arrow-right p-2'></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Chatbot;