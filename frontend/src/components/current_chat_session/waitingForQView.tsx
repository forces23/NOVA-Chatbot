import '../../styles/dot_animation.css';
import GradientDotsAnimation from '../animation_views/gradientDotsAnimation';

function WaitingView() {
    return (
        <>
            <div className='d-flex flex-column'>
                <h3 className='chatbot-name d-flex justify-content-center'> Ask a question to start a chat ...</h3>
                <GradientDotsAnimation/>
            </div>
        </>
    )
}

export default WaitingView;