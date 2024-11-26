import React, { useRef, useState, useEffect } from 'react';
import './TicTacToe.css';
import circle_icon from '../Assets/circle.png';
import cross_icon from '../Assets/cross.png';

let data = ['', '', '', '', '', '', '', '', ''];

const TicTacToe = () => {
  const [count, setCount] = useState(0);
  const [lock, setLock] = useState(false);
  const [timer, setTimer] = useState(10); // 10-second timer
  const [score, setScore] = useState({ player1: 0, player2: 0 });

  const titleRef = useRef(null);
  const boxRefs = Array.from({ length: 9 }, () => useRef(null));
  let timerInterval = useRef(null);

  useEffect(() => {
    if (!lock) {
      resetTimer();
      startTimer();
    }
    return () => clearInterval(timerInterval.current);
  }, [count]);

  const resetTimer = () => {
    setTimer(10); // Reset timer to 10 seconds
    clearInterval(timerInterval.current);
  };

  const startTimer = () => {
    timerInterval.current = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(timerInterval.current);
          declareTimeoutWinner();
        }
        return prev - 1;
      });
    }, 1000);
  };

  const declareTimeoutWinner = () => {
    const winner = count % 2 === 0 ? 'Player 2' : 'Player 1';
    setLock(true);
    titleRef.current.textContent = `${winner} Wins! Timeout`;
    updateScore(winner === 'Player 1' ? 'player1' : 'player2');
  };

  const toggle = (e, num) => {
    if (lock || data[num] !== '') {
      return;
    }

    resetTimer(); // Reset timer on valid move
    clearInterval(timerInterval.current); // Clear existing timer

    if (count % 2 === 0) {
      data[num] = 'x';
      e.target.innerHTML = `<img src='${cross_icon}' alt='' />`;
    } else {
      data[num] = 'o';
      e.target.innerHTML = `<img src='${circle_icon}' alt='' />`;
    }

    setCount(count + 1);
    checkWin();
  };

  const checkWin = () => {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let combo of winningCombinations) {
      const [a, b, c] = combo;
      if (data[a] && data[a] === data[b] && data[b] === data[c]) {
        highlightWinningCombination(combo);
        declareWinner(data[a]);
        return;
      }
    }

    if (!data.includes('')) {
      setLock(true);
      titleRef.current.textContent = `It's a Draw!`;
    }
  };

  const declareWinner = (winner) => {
    setLock(true);
    titleRef.current.textContent =
      winner === 'x' ? 'Player 1 Wins!' : 'Player 2 Wins!';
    updateScore(winner === 'x' ? 'player1' : 'player2');
    clearInterval(timerInterval.current);
  };

  const updateScore = (winner) => {
    setScore((prev) => ({
      ...prev,
      [winner]: prev[winner] + 1,
    }));
  };

  const highlightWinningCombination = (combo) => {
    combo.forEach((index) => {
      boxRefs[index].current.classList.add('highlight');
    });
  };

  const reset = () => {
    setLock(false);
    data = ['', '', '', '', '', '', '', '', ''];
    titleRef.current.textContent = 'Tic-Tac-Toe';
    boxRefs.forEach((box) => {
      box.current.innerHTML = '';
      box.current.classList.remove('highlight');
    });
    setCount(0);
    resetTimer();
    clearInterval(timerInterval.current);
    startTimer();
  };

  return (
    <div className="container">
      <h1 className="title" ref={titleRef}>
        Tic-Tac-<span>Toe</span>
      </h1>
      <div className="info">Player {count % 2 === 0 ? '1' : '2'}'s Turn</div>
      <div className="info">Time Left: {timer} sec</div>
      <div className="info">
        Player 1 (X): {score.player1} | Player 2 (O): {score.player2}
      </div>
      <div className="board">
        {boxRefs.map((ref, index) => (
          <div
            key={index}
            className="boxes"
            ref={ref}
            onClick={(e) => toggle(e, index)}
          ></div>
        ))}
      </div>
      <button className="reset" onClick={reset}>
        Reset
      </button>
    </div>
  );
};

export default TicTacToe;
