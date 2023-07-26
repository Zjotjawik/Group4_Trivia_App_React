import { useState } from "react"; // Import useState hook from React library. This hook lets you add React state to function components.
import { resultInitialState} from './constants'; // Import initial state for quiz results.

// Define a functional component called Quiz, which takes an array of questions as a prop
const Quiz = ({ questions }) => {
    // Define state variables using useState. The initial state is passed as parameter to useState
    const [currentQuestion, setCurrentQuestion] = useState(0); // Index of the current question
    const [answerIdx, setAnswerIdx] = useState(null); // Index of the selected answer
    const [answer, setAnswer] = useState(null); // The correctness of the selected answer
    const [result, setResult] = useState(resultInitialState); // The result of the quiz
    const [showResult, setShowResult] = useState(false); // Boolean to toggle between quiz and result display

    // Destructure the current question object
    const { question, choices, correctAnswer } = questions[currentQuestion];

    // Define the function to call when an answer is clicked. It updates the selected answer and its correctness
    const onAnswerClick = (answer, index) => {
        setAnswerIdx(index);
        if(answer === correctAnswer) {
            setAnswer(true);
        } else {
            setAnswer(false);
        }
    };

    // Define the function to call when the Next button is clicked. It updates the result and the current question
    const onClickNext = () => {
        // Set selected answer to null for the next question
        setAnswerIdx(null);

        // Use the updater function form of setState. It takes the previous state and returns the new state.
        // Update the score and increment correct or wrong answer count based on the selected answer
        setResult((prev) => 
            answer
            ? {
                ...prev,
                score: prev.score + 5, 
                correctAnswers: prev.correctAnswers +1,
            }
            :{
                ...prev,
                wrongAnswers: prev.wrongAnswers +1,          
            }
        );

        // If it's not the last question, go to the next one. Otherwise, show results
        if(currentQuestion !== questions.length -1) {
            setCurrentQuestion((prev) => prev + 1);
        } else {
            setCurrentQuestion(0);
            setShowResult(true);
        }
    };

    // Define function to restart the quiz
    const onTryAgain = () => {
        setCurrentQuestion(0);
        setShowResult(false);
        setResult(resultInitialState);
        setAnswerIdx(null);
        setAnswer(null);
    }


    return (
      <div className = 'quiz-container'> 
 {!showResult ? (
    <>
       <span className="active-question-no"> {currentQuestion +1}</span>
       <span className="total=question">/{questions.length}</span>
       <h2>{question} </h2>
       <ul>
          {choices.map((choice, index) => (
             <li 
                onClick={() => onAnswerClick(choice, index)}
                key={choice}
                className={answerIdx === index ? "selected-answer" : null}
             >
                {choice}
             </li>
          ))}
       </ul>
       <div className="footer">
          <button onClick={onClickNext} disabled={answerIdx === null}>
             {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
          </button>
       </div>
    </>
 ) : (
    <div className="result">
       <h3>Result</h3>
       <p>
          Total Questions: <span>{questions.length} </span>
       </p>
       <p>
          Total Score: <span>{result.score} </span>
       </p>         
       <p>
          Correct Answers: <span>{result.correctAnswers} </span>
       </p>
       <p>
          Wrong Answers: <span>{result.wrongAnswers} </span>
       </p>
       <button onClick={onTryAgain}>Try again</button>
    </div>
 )}

{
                  <div className="made-by">
                  <p>Made by Ben & Jerry</p>
              </div>    
 }
       </div>
      );
      };
export default Quiz;