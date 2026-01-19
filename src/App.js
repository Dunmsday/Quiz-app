import React, { useEffect, useRef, useState } from "react";
import "./index.css";
import data from "./data";
import Quiz from "./Quiz";

// Quiz App App Component
function App() {
  // For the basic 10sec Counter
  const [quizStart, setQuizStart] = useState(true);
  // not that important the useRef is just to prevent rendering
  const running = useRef(false);
  // The countdown useState
  const [countdown, setCountdown] = useState(null);
  // The fetch data from data.js
  const [questions, setQuestions] = useState(data);
  const [score, setScore] = useState(null); // <-- store score here
  // To display score at the end of the quiz
  const [scoreDisplay, setScoreDisplay] = useState(false);
  const checkScore = score > 50;

  // For the 10 sec countdown I created a new Promise with a callback variable of ms
  const sleep = (ms) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  };
  // startCountdown function
  const startCountdown = async (time) => {
    if (running.current) return;
    running.current = true;
    // I used a for loop to iterate it 10 times and i awaited each of them by 1000ms using sleep(1000)
    for (let i = time; i >= 0; i--) {
      setCountdown(i);
      await sleep(1000);
    }
    setCountdown("Loading");
    await sleep(500);
    setCountdown("Loading.");
    await sleep(500);
    setCountdown("Loading..");
    await sleep(500);
    setCountdown("Loading...");

    running.current = false;
    // I set the quizStart to false to hide display
    setQuizStart(!quizStart);
  };
  // This is what shows before the Quiz
  if (quizStart) {
    return (
      <>
        <main>
          <div className="before-quiz-start">
            <h1>Are you ready to try out a Quiz?</h1>
            <h2 style={{ color: "red" }}>{countdown}</h2>
            <button className="btn" onClick={() => startCountdown(10)}>
              start quiz
            </button>
          </div>
        </main>
      </>
    );
  }
  // This is what shows when the QuizStart is set to false{Quiz is set to true}
  return (
    <>
      <article style={{ position: "relative" }}>
        {/* I passed in the data of questions{questions}, the scoreComponent which is gooten in the Quiz.js{setscore}, the setScoreDisplay so that when the submit btn is clicked the setscoreDisplay becomes true */}
        <Quiz
          questions={questions}
          setScore={setScore}
          setScoreDisplay={setScoreDisplay}
        />
        {/* This is what happens when the  scoredisplay is true */}
        {scoreDisplay && (
          <div className="container">
            <section>
              <div className="score">
                <div className="main-score">
                  <h1>Result</h1>
                  <h2>{score}%</h2>
                  <h2 style={{ color: checkScore ? "green" : "red" }}>
                    {checkScore ? "passed" : "failed"}
                  </h2>
                </div>
              </div>
              {/* This btn is to go back which setScoreDisplay to be false */}
              <button
                className="back"
                onClick={() => {
                  setScoreDisplay(false);
                }}
              >
                Back to Quiz
              </button>
            </section>
          </div>
        )}
      </article>
    </>
  );
}

export default App;
