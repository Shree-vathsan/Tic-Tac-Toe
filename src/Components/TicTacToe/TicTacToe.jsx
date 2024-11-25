import React, { useRef, useState, useEffect } from 'react';
import './TicTacToe.css';
import circle_icon from '../Assets/circle.png';
import cross_icon from '../Assets/cross.png';

let data = ['', '', '', '', '', '', '', '', ''];

const TicTacToe = () => {
  const [count, setCount] = useState(0);
  const [lock, setLock] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState('Player 1');
  const [timer, setTimer] = useState(10);
  const [scores, setScores] = useState({ Player1: 0, Player2: 0 });

  const titleRef = useRef(null);
  const boxRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  // Timer logic
  useEffect(() => {
    if (!lock) {
      const countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            // Switch turns if timer runs out
            switchTurn();
            return 10;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [lock]);

  const switchTurn = () => {
    setCount((prevCount) => prevCount + 1);
    setCurrentPlayer((prev) => (prev === 'Player 1' ? 'Player 2' : 'Player 1'));
  };

  const toggle = (e, num) => {
    if (lock || data[num] !== '') {
      return; // Prevent further clicks if box is already clicked or game is locked
    }

    if (count % 2 === 0) {
      e.target.innerHTML = `<img src='${cross_icon}' alt="" />`;
      data[num] = 'x';
    } else {
      e.target.innerHTML = `<img src='${circle_icon}' alt="" />`;
      data[num] = 'o';
    }

    checkWin();
    switchTurn();
  };

  const checkWin = () => {
    const winningConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let [a, b, c] of winningConditions) {
      if (data[a] === data[b] && data[b] === data[c] && data[a] !== '') {
        highlightWinner([a, b, c]);
        won(data[a]);
        return;
      }
    }

    // Check for draw
    if (data.every((item) => item !== '') && !lock) {
      titleRef.current.innerHTML = "It's a Draw!";
      setLock(true);
    }
  };

  const highlightWinner = (winningCombination) => {
    winningCombination.forEach((index) => {
      boxRefs[index].current.classList.add('highlight');
    });
  };

  const won = (winner) => {
    setLock(true);
    if (winner === 'x') {
      titleRef.current.innerHTML = 'Player 1 Wins!';
      setScores((prev) => ({ ...prev, Player1: prev.Player1 + 1 }));
    } else {
      titleRef.current.innerHTML = 'Player 2 Wins!';
      setScores((prev) => ({ ...prev, Player2: prev.Player2 + 1 }));
    }
  };

  const reset = () => {
    setLock(false);
    data = ['', '', '', '', '', '', '', '', ''];
    titleRef.current.innerHTML = 'Tic-Tac<span>-Toe</span>';
    setCount(0);
    setCurrentPlayer('Player 1');
    setTimer(10); // Reset timer
    boxRefs.forEach((boxRef) => {
      boxRef.current.innerHTML = ''; // Clear the board
      boxRef.current.classList.remove('highlight'); // Remove highlights
    });
  };

  return (
    <div className='container'>
      <h1 className='title' ref={titleRef}>
        Tic-Tac<span>-Toe</span>
      </h1>
      <div className='info'>
        <p>{currentPlayer}'s Turn</p>
        <p>Time Left: {timer} sec</p>
        <p>
          Player 1 (X): {scores.Player1} | Player 2 (O): {scores.Player2}
        </p>
      </div>
      <div className='board'>
        {boxRefs.map((boxRef, index) => (
          <div
            key={index}
            className='boxes'
            ref={boxRef}
            onClick={(e) => toggle(e, index)}
          ></div>
        ))}
      </div>
      <button className='reset' onClick={reset}>
        Reset
      </button>
    </div>
  );
};

export default TicTacToe;
