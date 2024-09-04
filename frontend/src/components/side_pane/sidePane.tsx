import { useContext} from 'react'
import SettingsPane from './settingsPane';
import { sharedInfoContext } from '../../context/sharedContext';


function SidePane() {
    const { isSidePaneCollapsed, setIsSidePaneCollapsed } = useContext(sharedInfoContext);
    

    return (
        <>
            <div className={`side-pane ${isSidePaneCollapsed ? 'collapsed' : ''}`} id="sidePane">
                <div className="side-pane-header">
                    
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