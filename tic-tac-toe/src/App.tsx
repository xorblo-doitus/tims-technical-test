import { useState, type ReactNode } from 'react'
import './App.css'


// An enum would be better, but I don't know if using non-erasable TypeScript
// is a good pratice.
type Player = -1|0|1;
const PLAYER_LEFT: Player = -1;
const PLAYER_NONE: Player = 0;
const PLAYER_RIGHT: Player = 1;

type Position = {
	x: number;
	y: number;
};

function arePositionsEqual(a: Position, b: Position): boolean {
	return a.x == b.x && a.y == b.y
}


function playerToMark(player: Player): string {
	switch (player) {
		case PLAYER_NONE: return "  ";
		case PLAYER_LEFT: return "╳";
		case PLAYER_RIGHT: return "◯";
		default: return "?";
	}
}

function playerToClass(player: Player): string {
	switch (player) {
		case PLAYER_LEFT: return "left-player";
		case PLAYER_RIGHT: return "right-player";
		default: return "no-player";
	}
}

function playerToText(player: Player): string {
	switch (player) {
		case PLAYER_LEFT: return "joueur de gauche";
		case PLAYER_RIGHT: return "joueur de droite";
		default: return "[erreur : joueur inconnu]";
	}
}


function Square({player, inWinningLine, clickCallback}: {player: Player, inWinningLine: boolean, clickCallback: React.MouseEventHandler<HTMLButtonElement>}) {
	return <>
		<button
			className={"square" + (inWinningLine ? " winning" : "")}
			onClick={clickCallback}
		>
			{playerToMark(player)}
		</button>
	</>
}


function PlayerMessage({player}: {player: Player}) {
	if (player === PLAYER_NONE) {
		return <></>;
	}
	return <>
		<div className={"player-msg " + playerToClass(player)}>
			Au tour du {playerToText(player)} ({playerToMark(player)})
		</div>
	</>
}


function WinnerMessage({winner}: {winner: Player|null}) {
	if (winner === null) {
		return <></>;
	}
	return <>
		<div className="winner-msg">
			{
			winner === PLAYER_NONE
			? <p>Match nul...</p>
			: <p>Le {playerToText(winner)} a gagné !</p>
			}
			<p>Cliquez sur recommencer pour jouer à nouveau.</p>
		</div>
	</>
}



function Board({nbColumns, nbRows}: {nbColumns: number, nbRows: number}) {
	const winLength = 3;
	
	const [board, setBoard] = useState(createBoard());
	const [player, setPlayer] = useState(PLAYER_LEFT);
	const [winner, winningLine]: [Player|null, Position[]] = checkWinner();
	
	function createBoard(): Player[][] {
		const board: Player[][] = [];
		for (let x = 0; x < nbColumns; x++) {
		const column: Player[] = []
			for (let y = 0; y < nbRows; y++) {
				column.push(0);
			}
			board.push(column);
		}
		return board;
	}
	
	
	function getPlayerMarkAt(position: Position) {
		return board[position.x][position.y];
	}
	
	
	function checkWinnerOnLine(positions: Position[]): [Player|null, Position[]] {
		let streak: Position[] = []
		
		for (const position of positions) {
			const player = getPlayerMarkAt(position);
			
			if (player != PLAYER_NONE && (streak.length === 0 || player === getPlayerMarkAt(streak.at(-1)!))) {
				streak.push(position)
			} else {
				streak = [];
			}
			
			if (streak.length >= winLength) {
				break;
			}
		}
		
		if (streak.length >= winLength) {
			return [getPlayerMarkAt(streak[0]), streak];
		}
		
		return [null, []];
	}
	
	
	function* getVerticalLines(): Generator<Position[], void, void> {
		for (let y = 0; y < nbColumns; y++) {
			const line: Position[] = [];
			
			for (let x = 0; x < nbRows; x++) {
				line.push({x: x, y: y});
			}
			
			yield line;
		}
	}
	
	
	function* getHorizontalLines(): Generator<Position[], void, void> {
		for (let x = 0; x < nbColumns; x++) {
			const line: Position[] = [];
			
			for (let y = 0; y < nbRows; y++) {
				line.push({x: x, y: y});
			}
			
			yield line;
		}
	}
	
	function* getDiagonalLines(): Generator<Position[], void, void> {
		for (let startX = 0; startX <= nbColumns - winLength; startX++) {
			for (let startY = 0; startY <= nbRows - winLength; startY++) {
				const stop = Math.min(nbColumns - startX, nbRows - startY);
				
				const descendingDiagonal: Position[] = [];
				for (let offset = 0; offset < stop; offset++) {
					descendingDiagonal.push({x: startX + offset, y: startY + offset});
				}
				yield descendingDiagonal;
				
				const reverseStartY = nbRows - startY - 1;
				const ascendingDiagonal: Position[] = [];
				for (let offset = 0; offset < stop; offset++) {
					ascendingDiagonal.push({x: startX + offset, y: reverseStartY - offset});
				}
				yield ascendingDiagonal;
			}
		}
	}
	
	
	function* getAllLines(): Generator<Position[], void, void> {
		for (const line of getVerticalLines()) {
			yield line;
		}
		for (const line of getHorizontalLines()) {
			yield line;
		}
		for (const line of getDiagonalLines()) {
			yield line;
		}
	}
	
	
	function checkWinner(): [Player|null, Position[]] {
		// Winning
		for (const line of getAllLines()) {
			const [winner, winningPositions] = checkWinnerOnLine(line);
			
			if (winner !== null) {
				return [winner, winningPositions];
			}
		}
		
		
		// Draw
		if (board.every(column=>column.every(player => player != PLAYER_NONE))) {
			return [PLAYER_NONE, []];
		}
		
		// Game continuing
		return [null, []];
	}
	
	function onSquareClicked(position: Position) {
		const {x, y} = position;
		
		if (board[x][y] !== PLAYER_NONE || checkWinner()[0] !== null) {
			return;
		}
		
		const newBoard = board.slice(); // copy
		newBoard[x][y] = player;
		setPlayer(-player as Player);
		setBoard(newBoard);
	}
	
	function restart() {
		setBoard(createBoard());
	}
	
	
	const squares: ReactNode[] = []
	for (let x = 0; x < nbColumns; x++) {
		for (let y = 0; y < nbRows; y++) {
			const position: Position = {x: x, y: y};
			
			squares.push(<Square
				player={board[x][y]}
				inWinningLine={winningLine.some(winningPosition => arePositionsEqual(winningPosition, position))}
				clickCallback={() => onSquareClicked(position)}
				key={x*nbColumns+y}
			/>);
		}
	}
	
	if (nbColumns === 0 || nbRows === 0) {
		return <>
			<div className="error">Erreur : Le plateau ne peut pas avoir une dimension à 0.</div>
		</>
	}
	
	return <>
		{winner === null ? <PlayerMessage player={player} /> : null}
		<div className="squares" style={{gridTemplateColumns: `repeat(${nbColumns}, auto)`}}>
			{squares}
		</div>
		<WinnerMessage winner={winner} />
		<button className="restart" onClick={restart}>Recommencer</button>
	</>
}



function App() {
	return (
		<>
			<Board nbColumns={3} nbRows={3} />
		</>
	)
}

export default App
