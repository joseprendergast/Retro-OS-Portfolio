import { useState, useCallback, useEffect } from 'react';
import Win95Button from './Win95Button';

type CellState = {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
};

type GameState = 'playing' | 'won' | 'lost';
type Difficulty = 'beginner' | 'intermediate' | 'expert';

const DIFFICULTIES: Record<Difficulty, { rows: number; cols: number; mines: number }> = {
  beginner: { rows: 8, cols: 8, mines: 10 },
  intermediate: { rows: 16, cols: 16, mines: 40 },
  expert: { rows: 16, cols: 30, mines: 99 },
};

const NUMBER_COLORS = ['', '#0000FF', '#008000', '#FF0000', '#000080', '#800000', '#008080', '#000000', '#808080'];

export default function Minesweeper() {
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [grid, setGrid] = useState<CellState[][]>([]);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [mineCount, setMineCount] = useState(10);
  const [time, setTime] = useState(0);
  const [isFirstClick, setIsFirstClick] = useState(true);
  const [isMouseDown, setIsMouseDown] = useState(false);

  const { rows, cols, mines } = DIFFICULTIES[difficulty];

  const initializeGrid = useCallback(() => {
    const newGrid: CellState[][] = Array(rows).fill(null).map(() =>
      Array(cols).fill(null).map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        adjacentMines: 0,
      }))
    );
    setGrid(newGrid);
    setGameState('playing');
    setMineCount(mines);
    setTime(0);
    setIsFirstClick(true);
  }, [rows, cols, mines]);

  useEffect(() => {
    initializeGrid();
  }, [initializeGrid]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === 'playing' && !isFirstClick) {
      interval = setInterval(() => setTime(t => Math.min(t + 1, 999)), 1000);
    }
    return () => clearInterval(interval);
  }, [gameState, isFirstClick]);

  const placeMines = (excludeRow: number, excludeCol: number) => {
    const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
    let placedMines = 0;

    while (placedMines < mines) {
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);
      
      if (!newGrid[r][c].isMine && !(Math.abs(r - excludeRow) <= 1 && Math.abs(c - excludeCol) <= 1)) {
        newGrid[r][c].isMine = true;
        placedMines++;
      }
    }

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!newGrid[r][c].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr, nc = c + dc;
              if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && newGrid[nr][nc].isMine) {
                count++;
              }
            }
          }
          newGrid[r][c].adjacentMines = count;
        }
      }
    }

    return newGrid;
  };

  const revealCell = (r: number, c: number, currentGrid: CellState[][]) => {
    if (r < 0 || r >= rows || c < 0 || c >= cols) return;
    if (currentGrid[r][c].isRevealed || currentGrid[r][c].isFlagged) return;

    currentGrid[r][c].isRevealed = true;

    if (currentGrid[r][c].adjacentMines === 0 && !currentGrid[r][c].isMine) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          revealCell(r + dr, c + dc, currentGrid);
        }
      }
    }
  };

  const checkWin = (currentGrid: CellState[][]) => {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!currentGrid[r][c].isMine && !currentGrid[r][c].isRevealed) {
          return false;
        }
      }
    }
    return true;
  };

  const handleCellClick = (r: number, c: number) => {
    if (gameState !== 'playing' || grid[r][c].isFlagged || grid[r][c].isRevealed) return;

    let currentGrid = grid.map(row => row.map(cell => ({ ...cell })));

    if (isFirstClick) {
      currentGrid = placeMines(r, c);
      setIsFirstClick(false);
    }

    if (currentGrid[r][c].isMine) {
      currentGrid[r][c].isRevealed = true;
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          if (currentGrid[i][j].isMine) {
            currentGrid[i][j].isRevealed = true;
          }
        }
      }
      setGrid(currentGrid);
      setGameState('lost');
      return;
    }

    revealCell(r, c, currentGrid);
    setGrid(currentGrid);

    if (checkWin(currentGrid)) {
      setGameState('won');
    }
  };

  const handleRightClick = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameState !== 'playing' || grid[r][c].isRevealed) return;

    const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
    newGrid[r][c].isFlagged = !newGrid[r][c].isFlagged;
    setGrid(newGrid);
    setMineCount(prev => newGrid[r][c].isFlagged ? prev - 1 : prev + 1);
  };

  const getFaceEmoji = () => {
    if (gameState === 'won') return '😎';
    if (gameState === 'lost') return '😵';
    if (isMouseDown) return '😮';
    return '🙂';
  };

  const formatNumber = (n: number) => String(Math.max(0, Math.min(999, n))).padStart(3, '0');

  return (
    <div className="flex flex-col items-center p-2 bg-[#c0c0c0]" data-testid="minesweeper">
      {/* Difficulty selector */}
      <div className="flex gap-2 mb-2">
        {(['beginner', 'intermediate', 'expert'] as Difficulty[]).map(d => (
          <Win95Button
            key={d}
            pressed={difficulty === d}
            onClick={() => { setDifficulty(d); }}
            className="text-[10px] min-w-[70px]"
            data-testid={`button-difficulty-${d}`}
          >
            {d.charAt(0).toUpperCase() + d.slice(1)}
          </Win95Button>
        ))}
      </div>

      {/* Game container */}
      <div className="win95-raised p-1">
        {/* Header */}
        <div className="win95-sunken flex items-center justify-between p-1 mb-1">
          <div className="bg-black text-red-500 font-mono text-[20px] px-1 w-[50px] text-center" data-testid="text-mine-count">
            {formatNumber(mineCount)}
          </div>
          <button
            className="win95-button w-[30px] h-[30px] min-w-0 p-0 text-[20px] flex items-center justify-center"
            onClick={initializeGrid}
            onMouseDown={() => setIsMouseDown(true)}
            onMouseUp={() => setIsMouseDown(false)}
            onMouseLeave={() => setIsMouseDown(false)}
            data-testid="button-new-game"
          >
            {getFaceEmoji()}
          </button>
          <div className="bg-black text-red-500 font-mono text-[20px] px-1 w-[50px] text-center" data-testid="text-timer">
            {formatNumber(time)}
          </div>
        </div>

        {/* Grid */}
        <div
          className="win95-sunken p-[1px] inline-block"
          onMouseDown={() => setIsMouseDown(true)}
          onMouseUp={() => setIsMouseDown(false)}
          onMouseLeave={() => setIsMouseDown(false)}
        >
          {grid.map((row, r) => (
            <div key={r} className="flex">
              {row.map((cell, c) => (
                <button
                  key={c}
                  className={`w-[16px] h-[16px] text-[11px] font-bold flex items-center justify-center border-0 p-0 ${
                    cell.isRevealed
                      ? 'bg-[#c0c0c0] border border-[#808080]'
                      : 'win95-raised'
                  } ${cell.isRevealed && cell.isMine && gameState === 'lost' ? 'bg-red-500' : ''}`}
                  onClick={() => handleCellClick(r, c)}
                  onContextMenu={(e) => handleRightClick(e, r, c)}
                  disabled={gameState !== 'playing'}
                  data-testid={`cell-${r}-${c}`}
                >
                  {cell.isRevealed ? (
                    cell.isMine ? '💣' : (
                      cell.adjacentMines > 0 ? (
                        <span style={{ color: NUMBER_COLORS[cell.adjacentMines] }}>
                          {cell.adjacentMines}
                        </span>
                      ) : ''
                    )
                  ) : (
                    cell.isFlagged ? '🚩' : ''
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Game status */}
      {gameState !== 'playing' && (
        <div className="mt-2 text-[12px] font-bold" data-testid="text-game-status">
          {gameState === 'won' ? 'You Win!' : 'Game Over!'}
        </div>
      )}
    </div>
  );
}
