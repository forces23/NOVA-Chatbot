import React, { useState, useRef, useEffect } from 'react'
import SettingsPane from './settingsPane';

// interface SettingsButtonProps {
//     onSettingsChange: (settings: { temperature: number; topP: number; topK: number }) => void;
// }

function SidePane() {
    const [isSidePaneCollapsed, setIsSidePaneCollapsed] = useState(true);

    /**
     * toggles the side pane to grow and collapse it
     */
    function toggleSidePane() {
        setIsSidePaneCollapsed(!isSidePaneCollapsed);
    }

    return (
        <>
            {/* create universal varabile sharing like in sebt */}
            <div className={`side-pane ${isSidePaneCollapsed ? 'collapsed' : ''}`} id="sidePane">
                <div className="side-pane-header">
                    <button  id="toggleSidePane" className="btn btn-link" onClick={toggleSidePane}>
                        <i className={`bi ${isSidePaneCollapsed ? 'bi-justify' : 'bi-x-lg'}`}></i>
                    </button>
                </div>
                <div className="chat-sessions">
                    {/* <!-- Chat sessions will be added here --> */}
                </div>
                <div className="side-pane-footer">
                    <SettingsPane />
                </div>
            </div>
        </>
    )
}

export default SidePane;