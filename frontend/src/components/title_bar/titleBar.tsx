function TitleBar() {

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

    return (
        <div className='titleBar'>
            <i
                className='bi bi-rocket-takeoff-fill fs-3'
                // TODO: Not ready for master branch
                // onClick={goToGame} 
            ></i>
            {/* Neurological Operative Virtual Assistant */}
            <h4 className='chatbotName'>NOVA</h4>
            <div>
                {/* Filler div to create empty space to the right of title */}
                <div className="ms-4"></div>
                <label className="switch HIDE">
                    <input type="checkbox" id="viewSel" onClick={() => { }} />
                    <span className="slider round"></span>
                </label>
            </div>
        </div>
    )
}

export default TitleBar;