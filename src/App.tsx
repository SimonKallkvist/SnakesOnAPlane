import { useEffect, useRef, useState } from 'react';
import './App.css';

import Apple from './ApplePng.png';
import Monitor from './flat-retro-computer-717037.png';
import { useInterval } from './useInterval';

const canvasX = 1000;
const canvasY = 1000;
const initialSnake = [
  [4, 10],
  [4, 40],
];
const initialApple = [14, 10];
const scale = 50;
const timeDelay = 100;

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [snake, setSnake] = useState(initialSnake);
  const [apple, setApple] = useState(initialApple);
  const [direction, setDirection] = useState([0, -1]);
  const [delay, setDelay] = useState<number | null>(null);
  const [gameover, setGameover] = useState(false);
  const [score, setScore] = useState(0);

  useInterval(() => runGame(), delay);

  useEffect(() => {
    let fruit = document.getElementById('fruit') as HTMLCanvasElement;
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.setTransform(scale, 0, 0, scale, 0, 0);
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        ctx.fillStyle = '#a3d001';

        snake.forEach(([x, y]) => ctx.fillRect(x, y, 1, 1));
        ctx.drawImage(fruit, apple[0], apple[1], 1, 1);
      }
    }
  }, [snake, apple, gameover]);

  function handleSetScore() {
    if (score > Number(localStorage.getItem('snakeScore'))) {
      localStorage.setItem('snakeScore', JSON.stringify(score));
    }
  }

  function play() {
    setSnake(initialSnake);
    setApple(initialApple);
    setDirection([1, 0]);
    setDelay(timeDelay);
    setScore(0);
    setGameover(false);
  }

  function checkCollision(head: number[]) {
    for (let i = 0; i < head.length; i++) {
      if (head[i] < 0 || head[i] * scale >= canvasX) return true;
    }
    for (const s of snake) {
      if (head[0] === s[0] && head[1] === s[1]) return true;
    }

    return false;
  }

  function appleAte(newSnake: number[][]) {
    let coord = apple.map(() => Math.floor((Math.random() * canvasX) / scale));
    if (newSnake[0][0] === apple[0] && newSnake[0][1] === apple[1]) {
      let newApple = coord;
      setScore(score + 1);
      setApple(newApple);
      return true;
    }

    return false;
  }

  function runGame() {
    const newSnake = [...snake];
    const newSnakeHead = [
      newSnake[0][0] + direction[0],
      newSnake[0][1] + direction[1],
    ];
    newSnake.unshift(newSnakeHead);
    if (checkCollision(newSnakeHead)) {
      setDelay(0);
      setGameover(true);
      handleSetScore();
    }
    if (!appleAte(newSnake)) {
      newSnake.pop();
    }
    setSnake(newSnake);
  }

  function changeDirection(e: React.KeyboardEvent<HTMLDivElement>) {
    switch (e.key) {
      case 'ArrowLeft':
        setDirection([-1, 0]);
        break;
      case 'ArrowUp':
        setDirection([0, -1]);
        break;
      case 'ArrowRight':
        setDirection([1, 0]);
        break;
      case 'ArrowDown':
        setDirection([0, 1]);
        break;
    }
    switch (e.key) {
      case 'A':
        setDirection([-1, 0]);
        break;
      case 'W':
        setDirection([0, -1]);
        break;
      case 'D':
        setDirection([1, 0]);
        break;
      case 'S':
        setDirection([0, 1]);
        break;
    }
  }

  return (
    <>
      <div onKeyDown={(e) => changeDirection(e)}>
        <img id='fruit' src={Apple} alt='Apple' width={'30px'} />
        <img src={Monitor} alt='Apple' width='1300' className='monitor' />
        <canvas
          className='playArea'
          ref={canvasRef}
          width={`${canvasX}px`}
          height={`${canvasY}px`}
        />
        {gameover && <div className='gameOver'>Game over</div>}
        <button onClick={play} className='playBtn'>
          Play
        </button>
        <div className='scoreBox'>
          <h2>Score: {score}</h2>
          <h2>Highscore: {localStorage.getItem('snakeScore')}</h2>
        </div>
      </div>
    </>
  );
}

export default App;
