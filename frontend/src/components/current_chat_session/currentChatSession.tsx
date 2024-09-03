import { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import '../../styles/loading_animation.css';
// import planetsystem from '../../images/planet1.png';
import { sharedInfoContext } from '../../context/sharedContext';
import { ChatSessionProps } from '../../utils/chatbotInterfaces';
import WaitingView from './waitingForQView';
import BotMessage from './bot_response/botMessage';



function ChatSession({ chatContainerRef }: ChatSessionProps) {
    const { currentConversation, setCurrentConversation, speakerTurn, AIResponse, payload, isLoading, setIsLoading } = useContext(sharedInfoContext);
    const [showContextObj, setShowContextObj] = useState<{ [key: number]: boolean }>({});
    const [completedMessages, setCompletedMessages] = useState<number[]>([]);

    useEffect(() => {
        if (speakerTurn === 'user') {
            setCurrentConversation([...currentConversation, { role: 'user', content: [{ text: payload.prompt, type: 'text' }] }]); // Add the user's input to the current conversation
        } else if (speakerTurn === 'bot') {
            console.log('AI RESPONSE');
            console.log(AIResponse);
            // fetchChatHistory();

            const aiResp = AIResponse['query_result'];
            const htmlAiResp = AIResponse['html_result'];
            const aiRespType = 'text';
            const data_sources = AIResponse['source_documents'];

            // Add the AI's response to the current conversation
            setCurrentConversation([...currentConversation, { role: 'bot', content: [{ html_text: htmlAiResp, text: aiResp, type: aiRespType }], data_sources: data_sources }]); 
        } else {
            console.log('waiting...');
            return;  // Return early if speakerTurn is neither 'user' nor 'bot'
        }
    }, [speakerTurn])


    async function fetchChatHistory() {
        const response = await axios.get('http://localhost:5000/chat-history')
        console.log('current conversation');
        console.log(response);
        if (response.data !== undefined) {
            const lastChatEntry = response.data.chat_history.length - 1;

            console.log(`last entry ${lastChatEntry}`);
            const sourceDocuments = response.data.chat_history[lastChatEntry]['content'][0]['source_documents'];
            console.log(sourceDocuments);

            /**
             *  Used for AGENT response
            */
            const aiResp = response.data.chat_history[lastChatEntry]['content'][0]['chunk']['bytes']
            const htmlAiResp = response.data.chat_history[lastChatEntry]['content'][0]['html_result']
            const aiRespType = 'text';
            const data_sources = response.data.chat_history[lastChatEntry]['content'][0]['source_documents']


            setCurrentConversation([...currentConversation, { role: 'bot', content: [{ html_text: htmlAiResp, text: aiResp, type: aiRespType }], data_sources: data_sources }]); // Add the AI's response to the current conversation

        } else {
            console.log('No current conversation history available');
        }

    }


    const copyToClipboard = (text: any) => {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Text copied to clipboard');
            console.log(text);
            // Optionally, you can show a temporary message to the user indicating the text was copied
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    };


    return (
        <div className='container chat-window rounded pt-3'>
            {currentConversation.length > 0 ? (currentConversation.map((message: any, index: number) => (
                <div key={index} className='rounded px-4 py-4 chat-bubbles mb-3'  >
                    <div className='d-flex flex-row'>
                        <div>
                            {message.role === 'user' ? (
                                /* USER -- Icon */
                                <span className='userChatHistory'>
                                    {/* Could add user icon here is wanted*/}
                                </span>

                            ) : (
                                /* BOT -- Icon */
                                <div className="botResponse">
                                    <span className=''>
                                        <i className="botIcon bi bi-moon-stars-fill fs-3 ps-1 pe-3"></i><br /><br />
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className='d-flex flex-fill'>
                            <div className='flex-fill flex-grow-1 align-content-center'>
                                {message.role === 'user' ? (
                                    /* USER -- message */
                                    <div className=''><pre className='userMessage'>{message.content[0].text}</pre></div>
                                ) : (
                                    /* BOT -- message */
                                    <BotMessage
                                        message={message}
                                        index={index}
                                        completedMessages={completedMessages}
                                        setCompletedMessages={setCompletedMessages}
                                        chatContainerRef={chatContainerRef}
                                    />
                                )}
                            </div>
                            <div>
                                {/* BOT -- extra buttons on right side */}
                                {message.role === 'bot' ? (
                                    <div className='d-flex'>
                                        <span className='botButtons'>
                                            <div className='d-flex flex-row'>
                                                <i className="bi bi-hand-thumbs-up-fill pe-1 thumbs" onClick={() => { console.log('Thumbs Up!') }}></i>
                                                <i className="bi bi-hand-thumbs-down-fill thumbs" onClick={() => { console.log('Thumbs Down!') }}></i><br />
                                            </div>
                                            <div>
                                                <i className="bi bi-copy fs-3 ps-2 copy-btn" onClick={() => { copyToClipboard(message.content[0].text) }}></i><br />
                                            </div>
                                        </span>
                                    </div>
                                ) : (
                                    <></>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className='context'>
                        {/* BOT -- shows the sources when using the bedrock agent */}
                        {message.data_sources != null && message.role === 'bot' ? (
                            <>
                                <p><button className='' onClick={() => { setShowContextObj((prev) => ({ ...prev, [index]: !prev[index] })); }}><em>Context</em> {showContextObj[index] ? (<i className='bi bi-caret-up-fill'></i>) : (<i className='bi bi-caret-down-fill'></i>)}</button> </p>
                                <div>
                                    {showContextObj[index] ? (message.data_sources.map((source: any, SourceIndex: number) => (
                                        <div key={SourceIndex}>
                                            <p> <strong>From Source {SourceIndex + 1}:</strong> {source[0]['content']}</p>
                                            <p> <strong>Source:</strong> {source[0]['uri']}</p>
                                            {SourceIndex !== message.data_sources.length - 1 ? <hr /> : <></>}
                                        </div>
                                    ))) : (
                                        <div style={{ visibility: 'hidden' }}></div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <p></p>
                        )}
                    </div>
                </div>
            ))) : (
                <div className='d-flex justify-content-center'>
                    <WaitingView />
                    {/* <p>waiting...</p> */}
                </div>
            )}

            {isLoading ? (
                <div className='d-flex justify-content-center'>
                    <div className="ring"><span className='loadingSpan'></span>
                    </div>
                </div>
            ) : (
                <></>
            )}
        </div>
    );
};

export default ChatSession;