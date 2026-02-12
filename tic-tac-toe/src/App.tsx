import { useState, type ReactNode } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'


function playerToMark(value: number): string {
	switch (value) {
		case 0: return "  ";
		case -1: return "╳";
		case 1: return "◯";
		default: return "?";
	}
}

function playerToClass(player: number): string {
	switch (player) {
		case -1: return "left-player";
		case 1: return "right-player";
		default: return "no-player";
	}
}

function playerToText(player: number): string {
	switch (player) {
		case -1: return "joueur de gauche";
		case 1: return "joueur de droite";
		default: return "[erreur : joueur inconnu]";
	}
}


function Square({value, clickCallback}: {value: number, clickCallback: React.MouseEventHandler<HTMLButtonElement>}) {
	
	return <>
		<button
			className="square"
			onClick={clickCallback}
		>
			{playerToMark(value)}
		</button>
	</>
}


function PlayerMessage({player}: {player: number}) {
	if (player == 0) {
		return <></>;
	}
	return <>
		<div className={"player-msg " + playerToClass(player)}>
			Au tour du {playerToText(player)} ({playerToMark(player)})
		</div>
	</>
}


function WinnerMessage({winner}: {winner: number}) {
	if (winner == 0) {
		return <></>;
	}
	return <>
		<div className="winner-msg">
			<p>Le {playerToText(winner)} a gagné !</p>
			<p>Cliquez sur recommencer pour jouer à nouveau.</p>
		</div>
	</>
}



function Board({nbColumns, nbRows}: {nbColumns: number, nbRows: number}) {
	const [board, setBoard] = useState(createBoard());
	const [player, setPlayer] = useState(1);
	const winner = checkWinner();
	
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
	
	function checkWinner(): number {
		// TODO should return 0 for draw and null for ongoing game instead
		
		for (const row of board) {
			if (Math.abs(row.reduce((a,b)=>a+b)) == nbColumns) {
				return row[0];
			}
		}
		
		for (let y = 0; y < nbColumns; y++) {
			if (Math.abs(board.reduce((sum, row)=>sum+row[y], 0)) == nbRows) {
				return board[y][0];
			}
		}
		
		// TODO check diagonals
		
		return 0;
	}
	
	function onSquareClicked(x: number, y: number) {
		if (board[x][y] != 0 || checkWinner() != 0) {
			return;
		}
		
		const newBoard = board.slice(); // copy
		newBoard[x][y] = player;
		setPlayer(-player);
		setBoard(newBoard);
	}
	
	function restart() {
		setBoard(createBoard());
	}
	
	
	const squares: ReactNode[] = []
	for (let x = 0; x < nbColumns; x++) {
		for (let y = 0; y < nbRows; y++) {
			squares.push(<Square
				value={board[x][y]}
				clickCallback={() => onSquareClicked(x, y)}
				key={x*nbColumns+y}
			/>);
		}
	}
	
	if (nbColumns == 0 || nbRows == 0) {
		return <>
			<div className="error">Erreur : Le plateau ne peut avoir une dimension à 0.</div>
		</>
	}
	
	return <>
		<PlayerMessage player={player} />
		<div className="squares">
			{squares}
		</div>
		<WinnerMessage winner={winner} />
		<button className="restart" onClick={restart}>Recommencer</button>
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
	// const [count, setCount] = useState(0)

	return (
		<>
			<Board nbColumns={3} nbRows={3} />
		</>
	)
}

export default App
