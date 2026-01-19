import React, { useEffect, useState } from "react";
// Quiz component
// I destructed the components passed in App.js {questions, setScore, setScoreDisplay}
function Quiz({ questions, setScore, setScoreDisplay }) {
  // I created a useState to identify the present array
  const [present, setPresent] = useState(0);

  // I created a useState of object to input the selected answer
  const [selectedAnswer, setSelectedAnswer] = useState({});

  // i created a useState that will show thed correction after the quiz is submited
  const [showCorrection, setShowCorrection] = useState(false);
  const correctAnswer = questions[present].answer;
  const [timerActive, setTimerActive] = useState(true);

  // Timer
  const [quizTime, setQuizTime] = useState(1200);
  useEffect(() => {
    if (!timerActive) return;
    const timer = setInterval(() => {
      setQuizTime((prev) => {
        if (prev === 0) {
          clearInterval(timer);
          totalScore();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerActive]);

  // For min and sec
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}: ${seconds < 10 ? "0" : ""}${seconds}`;
  };
  // An handleSelect func that handles the onclick selected div and also stores the selected div key in the selectedAnswer object
  const handleSelect = (option) => {
    setSelectedAnswer({
      ...selectedAnswer,
      [present]: option,
    });
  };

  // For the next and prev btn
  const showPrevBtn = present > 0;
  const showSubmitBtn = present === questions.length - 1;

  //Next btn func
  const nextQuestion = () => {
    return setPresent((prev) => prev + 1);
  };
  // PrevBtn func
  const prevQuestion = () => setPresent((prev) => prev - 1);

  // A func that calculates the total score and setShowCorrection and scoreDisplay to be true
  // This func only runs when the submit tn is clicked
  const totalScore = () => {
    let score = 0;
    // I used a loop so has to calculated all the selectedAnswer
    for (let i = 0; i < questions.length; i++) {
      if (selectedAnswer[i] === questions[i].answer) {
        score += 1;
      }
    }
    // Turned it into percentage
    let newScore = Math.floor((score / questions.length) * 100);
    setScore(newScore);
    setShowCorrection(true);
    setScoreDisplay(true);
    setTimerActive(false);
  };
  return (
    <>
      <div className="question">
        {timerActive ? (
          <div className="timer">⏱ Time Left: {formatTime(quizTime)}</div>
        ) : (
          <div className="timer">⏱ Time Left: {formatTime(quizTime)}</div>
        )}
        <h2 style={{ marginBottom: "30px" }}>
          {questions[present].id}. {questions[present].question}
        </h2>

        {/*  I mapped the options in the data but to do so i had to convert the options from an object to array using Object.entries() */}
        {Object.entries(questions[present].options).map(([key, text]) => {
          // For the present selected div if the key which is the option is equal to the selectedAnswer[present] which will be later passed in the onClick func
          const isSelected = selectedAnswer[present] === key;
          // To check if the answer is correct by syaing if the key[present value selected] = questions[present].answer[which is the answer in the data]
          const correctAnswer = key === questions[present].answer;
          const wrongAnswer = isSelected && !correctAnswer;
          let backgroundColor = "#fff";
          let color = "black";
          if (showCorrection) {
            if (correctAnswer) {
              backgroundColor = "green";
              color = "white";
            } else if (wrongAnswer) {
              backgroundColor = "red";
              color = "white";
            }
          } else if (isSelected) {
            backgroundColor = "#261296";
            color = "white";
          }
          return (
            <div
              key={key}
              className="options"
              onClick={() => {
                if (!showCorrection) handleSelect(key);
              }}
              style={{
                border: isSelected ? "2px solid #100874" : "2px solid #ccc",
                backgroundColor: backgroundColor,
                color: color,
              }}
            >
              {text}
            </div>
          );
        })}
        <br />
        {showCorrection && (
          <h4>
            <span style={{ color: "red" }}>Ans:</span>{" "}
            {questions[present].options[correctAnswer]}
          </h4>
        )}
        <div className="question-btn">
          {showPrevBtn ? (
            <button className="btn-submit" onClick={() => prevQuestion()}>
              Previous
            </button>
          ) : null}
          {!showSubmitBtn ? (
            <button className="btn-submit" onClick={() => nextQuestion()}>
              Next
            </button>
          ) : null}
          {showSubmitBtn ? (
            <button className="btn-submit" onClick={() => totalScore()}>
              Submit
            </button>
          ) : null}
          {showCorrection && (
            <button
              className="btn-submit"
              onClick={() => {
                setSelectedAnswer({});
                setScore(0);
                setPresent(0);
                setShowCorrection(false);
                setScoreDisplay(false);
                setTimerActive(true);
                setQuizTime(1200);
              }}
            >
              Try Quiz again
            </button>
          )}
        </div>
        <br />
        <p style={{ textAlign: "end" }}>
          {present + 1}/{questions.length}
        </p>
      </div>
    </>
  );
}
export default Quiz;
