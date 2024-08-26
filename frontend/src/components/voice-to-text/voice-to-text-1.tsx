import React, { useState, useEffect, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

interface VoiceToTextProps {
    onTextChange: (text: string) => void;
}

function VoiceToText({ onTextChange }: VoiceToTextProps) {
    const {
        transcript,
        listening,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

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
            console.log(transcript)
        }
        else {
            SpeechRecognition.startListening()
            console.log('Start listening')
            console.log(transcript)
        }
    };

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    return (
        <div>
            <button className="voice-to-text btn btn-primary me-1 border border-0 rounded-pill my-1" onClick={handleMicButton}>
                <i className='bi bi-mic p-2'></i>
            </button>
        </div>
    );
};

export default VoiceToText;