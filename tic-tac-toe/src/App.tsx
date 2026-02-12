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
	return <>
		<div className={"player-msg " + playerToClass(player)}>
			{
				player === PLAYER_NONE
				? <>Fin</>
				: <>Au tour du {playerToText(player)} : {playerToMark(player)}</>
			}
		</div>
	</>
}


function WinnerMessage({winner}: {winner: Player|null}) {
	if (winner === null) {
		return <>
			<div>
				<p>&nbsp;</p>
				<p>&nbsp;</p>
			</div>
		</>;
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



function Board({nbColumns, nbRows, winLength}: {nbColumns: number, nbRows: number, winLength: number}) {
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
	
	
	function checkWinnerOnLine(line: Position[]): [Player|null, Position[]] {
		let streak: Position[] = []
		
		for (const position of line) {
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
		for (let y = 0; y < nbRows; y++) {
			const line: Position[] = [];
			
			for (let x = 0; x < nbColumns; x++) {
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
		
		if (board[x][y] !== PLAYER_NONE || winner !== null) {
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
				key={x*nbRows+y}
			/>);
		}
	}
	
	if (nbColumns === 0 || nbRows === 0) {
		return <>
			<div className="error">Erreur : Le plateau ne peut pas avoir une dimension à 0.</div>
		</>
	}
	
	return <div>
		<PlayerMessage player={winner == null ? player : PLAYER_NONE} />
		<div className="squares" style={{gridTemplateColumns: `repeat(${nbColumns}, auto)`}}>
			{squares}
		</div>
		<WinnerMessage winner={winner} />
		<button className="restart" onClick={restart}>Recommencer</button>
	</div>
}



function App() {
	const [nbRows, setNbRows] = useState(3);
	const [nbColumns, setNbColumns] = useState(3);
	const [winLength, setWinLength] = useState(3);
	const [newNbRows, setNewNbRows] = useState(3);
	const [newNbColumns, setNewNbColumns] = useState(3);
	
	function applySizeAndRestart(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
		event.preventDefault();
		setNbRows(newNbRows);
		setNbColumns(newNbColumns);
	}
	
	return (
		<>
			<Board
				nbColumns={nbRows}
				nbRows={nbColumns}
				winLength={winLength}
				key={nbRows + "-" + nbColumns} // Resets the board when changed
			/>
			
			<form>
				<div className="field">
					<label htmlFor="nb-to-win">Longeur gagnante&nbsp;:</label>
					<input
						type="number"
						name="nb-to-win"
						id="nb-to-win"
						value={winLength}
						min={1}
						max={Math.max(newNbColumns, newNbRows, nbRows, nbColumns)}
						onChange={event=>setWinLength(parseInt(event.target.value))}
					/>
				</div>
				<div className="field">
					<label htmlFor="nb-rows">Nombre de lignes&nbsp;:</label>
					<input
						type="number"
						name="nb-rows"
						id="nb-rows"
						value={newNbRows}
						onChange={event=>setNewNbRows(parseInt(event.target.value))}
					/>
				</div>
				<div className="field">
					<label htmlFor="nb-columns">Nombre de colonnes&nbsp;:</label>
					<input
						type="number"
						name="nb-columns"
						id="nb-columns"
						value={newNbColumns}
						onChange={event=>setNewNbColumns(parseInt(event.target.value))}
					/>
				</div>
				{newNbColumns!=nbColumns || newNbRows!=nbRows?<button type="submit" onClick={applySizeAndRestart}>Recommencer et appliquer</button>:<></>}
			</form>
		</>
	)
}

export default App
