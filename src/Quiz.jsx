import { useState, useEffect } from "react"; 

// Import useState hook from React library. This hook lets you add React state to function components.

// Import initial state for quiz results.

import axios from 'axios'
import useSound from 'use-sound';
import correctSound from '../src/assets/644955__craigscottuk__quiz-gameshow-correct-ping-08.mp3';
import soundLoop from '../src/assets/220060__portwain__quiz-game-music-loop-bpm-90.wav';
import applauseSound from '../src/assets/18665__halleck__cheering-16.flac';
import errorSound from '../src/assets/650842__andreas__wrong-answer-buzzer.wav';
import nextSound from '../src/assets/146434__copyc4t__dundundunnn.wav';


// Define a functional component called Quiz, which takes an array of questions as a prop

const Quiz = () => {

  // Define state variables using useState. The initial state is passed as parameter to useState
  const [currentQuestion, setCurrentQuestion] = useState(0); // Index of the current question

  const [answerIdx, setAnswerIdx] = useState(null); // Index of the selected answer

  const [answer, setAnswer] = useState(null); // The correctness of the selected answer

  const [showResult, setShowResult] = useState(false); // Boolean to toggle between quiz and result display

  const [playCorrect] = useSound(correctSound);
  const [playError] = useSound(errorSound);

  const [playLoop] = useSound(soundLoop, {
   volume: 0.2, 
   loop: true  
 });

 const [playApplause] = useSound(applauseSound);
 
 const [playNext] = useSound(nextSound);
  
  const[onClickNextTrue, setOnClickNextTrue] = useState(false)

  const [resultInitialState, setResultInitialState] = useState({
    score: 0, 
    correctAnswers: 0, 
    wrongAnswers: 0,
  });

  const [result, setResult] = useState(resultInitialState); // The result of the quiz

  const [questions, setQuestions] = useState([
    {
      id: '26c4806d-fe05-4344-84ca-3c0092d15477',
      question: 'What does CPU stand for?',
      correctAnswer: 'Central Processing Unit',
      answers: [
        'Central Processing Unit',
        'Computer Personal Unit', 
        'Central Process Unit',
        'Central Processor Unit',
      ],
      userAnswer: '',
    },
    {
      id: 'cd647d49-62e0-4ff9-8b4d-71e0b4099767',
      question: 'The following Spanish provinces are located in the northern area of Spain except:',
      correctAnswer: 'Murcia',
      answers: [
        'León',
        'Asturias', 
        'Navarre',
        'Murcia'  
      ],
      userAnswer: '', 
    },
    {
      id: 'd52c4a1c-8c33-4308-831b-916fa989ef21',
      question: 'What is the name of the first "Star Wars" film by release order?',
      correctAnswer: 'A New Hope',
      answers: [
        'The Force Awakens',
        'The Phantom Menace',
        'A New Hope', 
        'Revenge of the Sith'
      ],
      userAnswer: '',
    },
    {
      id: '258d5be5-7e3b-44cc-bbb1-fb6c1a03bbda', 
      question: 'The metric prefix "atto-" makes a measurement how much smaller than the base unit?',
      correctAnswer: 'One Quintillionth',
      answers: [
        'One Septillionth',
        'One Quintillionth',
        'One Billionth',
        'One Quadrillionth'  
      ],
      userAnswer: '',
    },
    {
      id: '179e8915-189d-4643-8a52-5801a5a1fc84',
      question: 'Pamina and Papageno are characters in what Mozart opera?',
      correctAnswer: 'The Magic Flute',
      answers: [
        'The Magic Flute',
        'The Marriage of Figaro',
        'The Goose of Cairo',
        'The Impresario'
      ],
      userAnswer: '', 
    },
    {
      id: '4e7f9530-93d4-4d73-9ee5-75d9267b2a7d',
      question: 'Which of the following awards do Matt Stone and Trey Parker NOT have?',
      correctAnswer: 'Oscar',
      answers: [
        'Tony',
        'Oscar',
        'Grammy',
        'Emmy'
      ],
      userAnswer: '',
    }
  ]);

  
  // Array of questions we will be using
  
  useEffect(()=>{
    getQuestions()
  }, [])

 


  const getQuestions = () => {
    axios.get('https://wd40-trivia.onrender.com/api/questions')
      .then(res=> {
        setQuestions(res.data)
      })
      .catch(err => console.log(err))
  }

  // Destructure the current question object
  const { question, answers, userAnswer, correctAnswer } = questions[currentQuestion];

  // Define the function to call when an answer is clicked. It updates the selected answer and its correctness
  const onAnswerClick = (answer, index, entireObjOfTheQuestion) => {
    inputUserAnswer(answer, entireObjOfTheQuestion)
    
    setAnswerIdx(index);

    if(answer === correctAnswer) {
      playCorrect();
    } else {
      playError(); 
    }
    playLoop();

  };

  const inputUserAnswer = (answer,entireObjOfTheQuestion) => {
    // find the entireObjOfTheQuestion inside of the questions array and update the userAnswer
    let updatedQuestions = questions.map(item => {
      if (item.id == entireObjOfTheQuestion.id){
        return {...item, userAnswer: answer}; //gets everything that was already in item, and updates "done"
      }
      return item; // else return unmodified item
    });

    setQuestions(updatedQuestions)
  }

  // Define the function to call when the Next button is clicked. It updates the result and the current question
  const onClickNext = () => {

    // Set selected answer to null for the next question
    setOnClickNextTrue(true); //sets onClickNextTrue to true right when the onClickNext button has been clicked.
    
    setAnswerIdx(null);

    playNext(); 
    // Use the updater function form of setState. It takes the previous state and returns the new state.
    // Update the score and increment correct or wrong answer count based on the selected answer
    setResult((prev) => 
      answer ? 
      {
        ...prev, 
        score: prev.score + 5, 
        correctAnswers: prev.correctAnswers +1,  
      } :
      {
        ...prev,
        wrongAnswers: prev.wrongAnswers +1,   
      }
    );

    // If it's not the last question, go to the next one. Otherwise, show results
    if(currentQuestion !== questions.length -1) {
      setCurrentQuestion((prev) => prev + 1);
      setOnClickNextTrue(false); // sets the setOnClickNext to false again.
    } else {
      setCurrentQuestion(0);
      setShowResult(true);
      setOnClickNextTrue(false);
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
          <span className="active-question-no">
            {currentQuestion +1}
          </span>
          <span className="total=question">
            /{questions.length}
          </span>
          
          <h2>{question} </h2>

          {userAnswer != '' ? 
            userAnswer == correctAnswer ? 
            <h3 className="correct">CORRECT!</h3> :
            <h3 className="incorrect">INCORRECT!</h3>
            : ''}

          <ul>
            {answers.map((choice, index) => (
              <li 
                onClick={() => onAnswerClick(choice, index, questions[currentQuestion])} 
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
        <>
        {showResult &&
          <div className="result">
          {playApplause()} 

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
}
          {questions ? 
            questions.map(ele => {
              return (
                <div className="result">
                  <h3 className="results-page">{ele.question}</h3>
                  <p className="results-page">Correct Answer: {ele.correctAnswer}</p>
                  <p className="results-page">Your Answer: {ele.userAnswer}</p>
                </div>
              )
            }) : 
            <p>LOADING</p>
          }
        </>  
      )}
      
      <div className="made-by">
        <p>Made by Ben & Jerry</p>
      </div>

    </div>
  );
};

export default Quiz;