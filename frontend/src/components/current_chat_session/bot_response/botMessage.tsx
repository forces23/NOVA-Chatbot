import Prism from 'prismjs';
import '../../../utils/prism-language-imports';
import { useState, useEffect, useRef } from 'react';
import { BotMessageInterface } from '../../../utils/chatbotInterfaces';


function useTypewriterHTML(html:string, charactersPerSecond:number = 80, chatContainerRef:React.RefObject<HTMLDivElement | null>) {
    const [displayedHTML, setDisplayedHTML] = useState('');

    useEffect(() => {
        const textContent = html.replace(/<[^>]+>/g, '');
        let i = 0;
        let currentHTML = '';

        const updateHTML = () => {
            if (i < textContent.length) {
                while (html[currentHTML.length] === '<') {
                    const closeIndex = html.indexOf('>', currentHTML.length);
                    currentHTML += html.slice(currentHTML.length, closeIndex + 1);
                }

                currentHTML += html[currentHTML.length];
                setDisplayedHTML(currentHTML);
                i++;

                setTimeout(() =>{
                    updateHTML();
                    Prism.highlightAll();
                    if (chatContainerRef.current) {
                        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
                    }
                }, 1000 / charactersPerSecond);
            }
        };

        updateHTML();

        return () => {
            // No need to clear any interval
        };
    }, [html, charactersPerSecond]);

    return displayedHTML;
};


function BotMessage({ message, index, completedMessages, setCompletedMessages, chatContainerRef }:BotMessageInterface) {
    const displayedHTML = useTypewriterHTML(message.content[0].html_text || '<p>No message bot response...</p>', 80, chatContainerRef);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (displayedHTML === (message.content[0].html_text || '<p>No message bot response...</p>')) {
            setCompletedMessages((prev) => [...prev, index]);
        }
         // Apply Prism highlighting after each update
         if (containerRef.current) {
            Prism.highlightAllUnder(containerRef.current);
        }
    }, [displayedHTML, message.content[0].html_text, index, setCompletedMessages]);

    if (completedMessages.includes(index)) {
        return <div ref={containerRef} dangerouslySetInnerHTML={{ __html: message.content[0].html_text || '<p>Bot response missing...</p>' }} />;
    }

    return <div ref={containerRef} dangerouslySetInnerHTML={{ __html: displayedHTML }} />;
};

export default BotMessage;