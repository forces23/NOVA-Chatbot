import React, { useEffect, useRef } from 'react';
import '../../styles/dot_animation.css';
import PinkDotsAnimation from '../animation_views/pinkDotsAnimation';
import GradientDotsAnimation from '../animation_views/gradientDotsAnimation';


function WaitingView() {
   

    return (
        <>
            <div className='d-flex flex-column'>
                <h3 className='d-flex justify-content-center pt-5'> Ask a question to start a chat <strong>...</strong></h3>
                {/* <PinkDotsAnimation/> */}
                <GradientDotsAnimation/>
            </div>
        </>
    )
}

export default WaitingView;