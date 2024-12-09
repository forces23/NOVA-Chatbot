import '../../styles/dot_animation.css';
import GradientDotsAnimation from '../animations/gradientDotsAnimation';

function WaitingForQView() {
    return (
        <>
            <div className='flex-grow-1'> {/*justify-content-center*/}
            {/* <div> */}
                <h3 className='chatbot-name d-flex justify-content-center pt-5'> Ask a question to start a chat <strong>...</strong></h3>
                {/* <GradientDotsAnimation/> */}
            </div>
        </>
    )
}

export default WaitingForQView;