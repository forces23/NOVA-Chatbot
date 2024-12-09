import React, { useState, useEffect, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { VoiceToTextProps } from '../../utils/chatbotInterfaces';


function VoiceToText({ onTextChange }: VoiceToTextProps) {
    const { transcript, listening, browserSupportsSpeechRecognition } = useSpeechRecognition();
    const [text, setText] = useState('');
    const prevTextRef = useRef('');

    useEffect(() => {
        if (transcript !== text) {
            setText(transcript);
        }
    }, [transcript]);

    useEffect(() => {
        if (text !== prevTextRef.current) {
            onTextChange(text);
            prevTextRef.current = text;
        }
    }, [text, onTextChange]);

    function handleMicButton() {
        if (listening) {
            SpeechRecognition.stopListening()
            console.log('Stop listening')
        }
        else {
            SpeechRecognition.startListening()
            console.log('Start listening')
        }
    };

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    return (
        <div className='d-flex align-items-end'>
            <button 
                className={`voice-to-text btn me-1 border border-0 rounded-pill my-1 ${listening ? 'btn-danger' : 'btn-primary'}`} 
                onClick={handleMicButton}
            >
                <div className='d-flex justify-content-center'><i className='bi bi-mic p-0 fs-4'></i></div>
                
            </button>
        </div>
    );
};

export default VoiceToText;