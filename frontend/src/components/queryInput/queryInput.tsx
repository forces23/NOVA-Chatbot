import { useContext, useEffect, useRef } from "react";
import { sharedInfoContext } from "../../utils/sharedContext";
import VoiceToText from "../voice-to-text/voice-to-text-1";


const QueryInput: React.FC = () => {
    const { payload, setPayload, setIsLoading, isLoading, SetAIResponse, setSpeakerTurn, isSendBtnDisabled, setIsSendBtnDisabled } = useContext(sharedInfoContext);
    const inputRef = useRef<HTMLTextAreaElement>(null)

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

    // USED FOR AWS BACKEND SERVICE AND LOCAL BACKEND SERVICE CALLS    
    async function invokeBedrock() {
        setIsLoading(true);
        try {
            // const response = await axios.post('http://localhost:5000/invoke-Bedrock-GenAI', payload);
            const response = await fetch('https://8fdngj09ah.execute-api.us-east-1.amazonaws.com/Prod/invoke-Bedrock-GenAI',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                }
            );

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const jsonResponse = await response.json();

            // const data = response.data;
            const data = jsonResponse; // You can also read the `ReadableStream` chunk by chunk using a reader and a loop.

            SetAIResponse(data); // Update the AIResponse state with the response from Bedrock

            setSpeakerTurn('bot');

            setPayload(prevPayload => ({ ...prevPayload, 'prompt': '' }));

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }

    }

    async function invokeBedrockCHUNKS() {
        setIsLoading(true);
        try {
            console.log("Starting request...");  // Debug log
            const baseUrl = new URL('https://8fdngj09ah.execute-api.us-east-1.amazonaws.com/Prod/invoke-Bedrock-GenAI');

            const response = await fetch(baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'text/event-stream'
                },
                body: JSON.stringify(payload)
            })

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            let fullResponse = '';

            while (true) {
                if (!reader) break;

                const { value, done } = await reader.read();

                if (done) {
                    console.log("Stream complete");  // Debug log
                    break;
                }

                // decode the chunk and parse it 
                const chunk = decoder.decode(value);
                console.log("Received chunk:", chunk);  // Debug log
                
                try {
                    // Remove the "data: " prefix and parse the JSON
                    const jsonChunk = JSON.parse(chunk.replace(/^data: /, ''));

                    fullResponse += jsonChunk.content[0].text;

                    SetAIResponse(prevResponse => ({
                        ...prevResponse,
                        queery_result: fullResponse,
                        html_result: fullResponse
                    }));

                } catch (e) {
                    console.log('Error parsing chunk: ', e);
                }
            }

            setSpeakerTurn('bot');
            setPayload(prevPayload => ({
                ...prevPayload,
                prompt: ''
            }));
        } catch (e) {
            console.error('Error fetching data:', e);
        } finally {
            setIsLoading(false);
        }


    }

    function handleSendBtn() {
        setSpeakerTurn('user');
        // invokeBedrock();
        invokeBedrockCHUNKS(); // TODO: 
        // invokeBedrockAgent();
        // queryBedrockKBLangchain();

        if (inputRef.current) {
            inputRef.current.style.height = 'auto';
        }

    }

    function adjustTextareaHeight() {
        if (inputRef.current) {
            inputRef.current.style.height = 'auto';
            inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 300)}px`;
        }
    };

    function handleUserInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
        const { name, value } = e.target;
        setPayload(prevPayloadSettings => ({ ...prevPayloadSettings, [name]: value }));
        adjustTextareaHeight();
    }

    function handleTextChange(text: string) {
        setPayload(prevPayload => ({ ...prevPayload, 'prompt': text }));
    };


    return (
        <div className="inputArea ">
            <div className='inputBubbleWrapper'>
                <textarea
                    ref={inputRef}
                    name="prompt"
                    className="queryInput form-control bg-secondary rounded border border-0 d-flex flex-fill ms-4 me-2 text-white"
                    placeholder="Type your message..."
                    value={payload.prompt}
                    onChange={handleUserInput}
                    rows={1}
                    disabled={isLoading}
                />
                <VoiceToText onTextChange={handleTextChange} />
                <div className='d-flex align-items-end'>
                    <button
                        className="btn btn-primary me-2 border border-0 rounded-pill my-1"
                        onClick={handleSendBtn}
                        disabled={isSendBtnDisabled}
                    >
                        <span className='d-flex justify-content-center'> <i className='bi bi-arrow-right p-0 fs-5'></i></span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default QueryInput;