import { useContext } from "react";
import { sharedInfoContext } from "../../context/sharedContext";

function TitleBar() {
    const { isSidePaneCollapsed, setIsSidePaneCollapsed } = useContext(sharedInfoContext);

    function goToGame() {
        console.log('new Game starting...')

        // Open a new window
        const newWindow = window.open('', '_blank');

        //Navigate to the new window
        if (newWindow) {
            newWindow.opener = null;
            newWindow.location.href = `${window.location.origin}/have-fun-game-a`
        }

    }



    /**
     * toggles the side pane to grow and collapse it
     */
    function toggleSidePane() {
        setIsSidePaneCollapsed(!isSidePaneCollapsed);
    }

    return (
        <div className='d-flex justify-content-between'>
            <div>
                <button id="toggleSidePane" className="btn btn-link" onClick={toggleSidePane}>
                    <i className={`bi ${isSidePaneCollapsed ? 'bi-justify' : 'bi-x-lg'}`}></i>
                </button>
            </div>
            <div>
                {/* Neurological Operative Virtual Assistant */}
                <h4 className='chatbot-name'>NOVA</h4>
            </div>
            <div >
                <i className='bi bi-rocket-takeoff-fill fs-3 me-3' onClick={goToGame}></i>
            </div>
            {/* <div>
                {/* Filler div to create empty space to the right of title *\/}
                <label className="switch position-absolute top-0 end-0 m-2">
                    <input type="checkbox" id="viewSel" onClick={() =>{}} />
                    <span className="slider round"></span>
                </label> 
            </div>*/}
        </div>
    )
}

export default TitleBar;