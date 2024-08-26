import React, { useRef, useEffect, useState, useContext } from 'react';
import { sharedInfoContext } from '../../context/sharedContext';


function SettingsPane(){
    const { settings, setSettings, payload, setPayload } = useContext(sharedInfoContext);

    // const [settings, setSettings] = useState({ temperature: 0.7, topP: 0.9, topK: 50 });
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const bubbleRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // useEffect to give ability to click anywhere off the outside of settings div to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (bubbleRef.current && !bubbleRef.current.contains(event.target as Node) &&
                buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
                setIsSettingsOpen(false);
            }
        };
        if(isSettingsOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSettingsOpen]);

    /**
    * used to handle the settings when they are adjusted
    * @param e 
    */
    const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // setSettings(prevSettings => ({...prevSettings, [name]: parseFloat(value) }));
        setPayload(prevPayloadSettings => ({...prevPayloadSettings, [name]: parseFloat(value) }));

        console.log('New settings:', payload);
    };

    /**
     * toggles the settings div to open or close
     */
    function toggleSettings() {
        setIsSettingsOpen(!isSettingsOpen);
    };

    return(
        <div className='setting-container'>
            <button ref={buttonRef} id="settingsButton" className="btn btn-link" onClick={toggleSettings}>
                <i className='bi bi-gear'></i>
            </button>
            
            <div ref={bubbleRef} id="settingsBubble" className={`settings-bubble ${isSettingsOpen ? 'open' : ''}`}>
                <div className="slider-container">
                    <label className='pe-2' htmlFor="temperature">Temperature:</label>
                    {/* <input type="range" id="temperature" name="temperature" min="0" max="1" step="0.1" value={settings.temperature} onChange={handleSettingsChange} />
                    <span className='ps-2' id="temperatureValue">{settings.temperature}</span> */}
                    <input type="range" id="temperature" name="temperature" min="0" max="1" step="0.1" value={payload.temperature} onChange={handleSettingsChange} />
                    <span className='ps-2' id="temperatureValue">{payload.temperature}</span>

                </div>
                <div className="slider-container">
                    <label className='pe-2' htmlFor="topP">Top P:</label>
                    {/* <input type="range" id="topP" name="topP" min="0" max="1" step="0.1" value={settings.topP} onChange={handleSettingsChange}/>
                    <span className='ps-2' id="topPValue">{settings.topP}</span> */}
                    <input type="range" id="topP" name="topP" min="0" max="1" step="0.1" value={payload.topP} onChange={handleSettingsChange}/>
                    <span className='ps-2' id="topPValue">{payload.topP}</span>

                </div>
                <div className="slider-container">
                    <label className='pe-2' htmlFor="topK">Top K:</label>
                    {/* <input type="range" id="topK" name="topK" min="1" max="100" step="1" value={settings.topK} onChange={handleSettingsChange} />
                    <span className='ps-2' id="topKValue">{settings.topK}</span> */}
                    <input type="range" id="topK" name="topK" min="1" max="100" step="1" value={payload.topK} onChange={handleSettingsChange} />
                    <span className='ps-2' id="topKValue">{payload.topK}</span>

                </div>
            </div>
        </div>
    )
}

export default SettingsPane;