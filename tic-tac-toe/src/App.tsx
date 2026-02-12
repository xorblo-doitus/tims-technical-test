import { useState, type ReactNode } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


function valueToText(value: number) {
	switch (value) {
		case 0: return " ";
		case -1: return "X";
		case 1: return "O";
	}
}


function Square({value, clickCallback}: {value: number, clickCallback: React.MouseEventHandler<HTMLButtonElement>}) {
	
	return <>
		<button
			className="square"
			onClick={clickCallback}
		>
			{valueToText(value)}
		</button>
	</>
}



function Board({nbColumns, nbRows}: {nbColumns: number, nbRows: number}) {
	const [board, setBoard] = useState(createBoard());
	const [player, setPlayer] = useState(1);
	
	function createBoard(): number[][] {
		const board: number[][] = [];
		for (let x = 0; x < nbColumns; x++) {
		const column: number[] = []
			for (let y = 0; y < nbRows; y++) {
				column.push(0);
			}
			board.push(column);
		}
		return board;
	}
	
	function onSquareClicked(x: number, y: number) {
		if (board[x][y] != 0) {
			return;
		}
		
		const newBoard = board.slice(); // copy
		newBoard[x][y] = player;
		setPlayer(-player);
		setBoard(newBoard);
	}
	
	const squares: ReactNode[] = []
	for (let x = 0; x < nbColumns; x++) {
		for (let y = 0; y < nbRows; y++) {
			squares.push(<Square value={board[x][y]} clickCallback={() => onSquareClicked(x, y)} />)
		}
	}
	
	return <>
		{player==-1?<div className='leftPlayer'>Au tour du joueur de gauche ({valueToText(player)})</div>:
		<div className='rightPlayer'>Au tour du joueur de droite ({valueToText(player)})</div>}
		<div className="board">
			{squares}
		</div>
	</>
}

// const NB_COLUMNS = 3; // note : CSS column count is hardcoded
// const NB_ROWS = 3;
// // const [board] = useState([[null]])


// function createBoard(): number[][] {
// 	const board: number[][] = [];
// 	for (let x = 0; x < NB_COLUMNS; x++) {
// 	const column: number[] = []
// 		for (let y = 0; y < NB_ROWS; y++) {
// 			column.push(0);
// 		}
// 		board.push(column);
// 	}
// 	return board;
// }


// function Square({board, x, y}: {board: number[][], x: number, y: number}) {
// 	function handleClick() {
// 		const newBoard = board.slice(); // copy
// 		newBoard[x][y] = 1;
// 		setBoard(newBoard);
// 	}
	
// 	return <>
// 		<button
// 			className="square"
// 			onClick={handleClick}
// 		>
// 			x: {x}, y: {y}
// 			<strong>value: {BOARD[x][y]}</strong>
// 		</button>
// 	</>
// }



// function Board() {
// 	const [BOARD, setBoard] = useState(createBoard());
	
// 	const squares: ReactNode[] = []
// 	for (let x = 0; x < NB_COLUMNS; x++) {
// 		for (let y = 0; y < NB_ROWS; y++) {
// 			squares.push(<Square x={x} y={y} />)
// 		}
// 	}
	
// 	return <>
// 		<div className="board">
// 			{squares}
// 		</div>
// 	</>
// }




function App() {
	const [count, setCount] = useState(0)

	return (
		<>
			<Board nbColumns={3} nbRows={3} />
			<div>
				<a href="https://vite.dev" target="_blank">
					<img src={viteLogo} className="logo" alt="Vite logo" />
				</a>
				<a href="https://react.dev" target="_blank">
					<img src={reactLogo} className="logo react" alt="React logo" />
				</a>
			</div>
			<h1>Vite + React</h1>
			<div className="card">
				<button onClick={() => setCount((count) => count + 1)}>
					count is {count}
				</button>
				<p>
					Edit <code>src/App.tsx</code> and save to test HMR
				</p>
			</div>
			<p className="read-the-docs">
				Click on the Vite and React logos to learn more
			</p>
		</>
	)
}

export default App
