import { useState, useCallback, useEffect } from 'react';
import { Button, Panel } from 'react95';
import styled from 'styled-components';

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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  background: #c0c0c0;
`;

const DifficultyRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
`;

const DifficultyButton = styled(Button)<{ $active?: boolean }>`
  font-size: 10px;
  min-width: 70px;
  ${props => props.$active && `
    box-shadow: inset 1px 1px 2px rgba(0,0,0,0.3);
  `}
`;

const GameContainer = styled(Panel)`
  padding: 4px;
`;

const Header = styled(Panel)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px;
  margin-bottom: 4px;
`;

const Counter = styled.div`
  background: black;
  color: #ff0000;
  font-family: monospace;
  font-size: 20px;
  padding: 0 4px;
  width: 50px;
  text-align: center;
`;

const FaceButton = styled(Button)`
  width: 30px;
  height: 30px;
  min-width: 0;
  padding: 0;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const GridContainer = styled(Panel)`
  padding: 1px;
  display: inline-block;
`;

const GridRow = styled.div`
  display: flex;
`;

const Cell = styled.button<{ $revealed?: boolean; $exploded?: boolean }>`
  width: 16px;
  height: 16px;
  font-size: 11px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  padding: 0;
  cursor: pointer;
  background: ${props => props.$revealed ? '#c0c0c0' : '#c0c0c0'};
  ${props => props.$revealed ? `
    border: 1px solid #808080;
  ` : `
    border-top: 2px solid #ffffff;
    border-left: 2px solid #ffffff;
    border-bottom: 2px solid #808080;
    border-right: 2px solid #808080;
  `}
  ${props => props.$exploded && `
    background: #ff0000;
  `}
  &:disabled {
    cursor: default;
  }
`;

const GameStatus = styled.div`
  margin-top: 8px;
  font-size: 12px;
  font-weight: bold;
`;

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

  const getFaceIcon = () => {
    if (gameState === 'won') return '8)';
    if (gameState === 'lost') return 'X(';
    if (isMouseDown) return ':O';
    return ':)';
  };

  const formatNumber = (n: number) => String(Math.max(0, Math.min(999, n))).padStart(3, '0');

  return (
    <Container data-testid="minesweeper">
      <DifficultyRow>
        {(['beginner', 'intermediate', 'expert'] as Difficulty[]).map(d => (
          <DifficultyButton
            key={d}
            $active={difficulty === d}
            onClick={() => { setDifficulty(d); }}
            data-testid={`button-difficulty-${d}`}
          >
            {d.charAt(0).toUpperCase() + d.slice(1)}
          </DifficultyButton>
        ))}
      </DifficultyRow>

      <GameContainer variant="outside">
        <Header variant="well">
          <Counter data-testid="text-mine-count">
            {formatNumber(mineCount)}
          </Counter>
          <FaceButton
            onClick={initializeGrid}
            onMouseDown={() => setIsMouseDown(true)}
            onMouseUp={() => setIsMouseDown(false)}
            onMouseLeave={() => setIsMouseDown(false)}
            data-testid="button-new-game"
          >
            {getFaceIcon()}
          </FaceButton>
          <Counter data-testid="text-timer">
            {formatNumber(time)}
          </Counter>
        </Header>

        <GridContainer
          variant="well"
          onMouseDown={() => setIsMouseDown(true)}
          onMouseUp={() => setIsMouseDown(false)}
          onMouseLeave={() => setIsMouseDown(false)}
        >
          {grid.map((row, r) => (
            <GridRow key={r}>
              {row.map((cell, c) => (
                <Cell
                  key={c}
                  $revealed={cell.isRevealed}
                  $exploded={cell.isRevealed && cell.isMine && gameState === 'lost'}
                  onClick={() => handleCellClick(r, c)}
                  onContextMenu={(e) => handleRightClick(e, r, c)}
                  disabled={gameState !== 'playing'}
                  data-testid={`cell-${r}-${c}`}
                >
                  {cell.isRevealed ? (
                    cell.isMine ? '*' : (
                      cell.adjacentMines > 0 ? (
                        <span style={{ color: NUMBER_COLORS[cell.adjacentMines] }}>
                          {cell.adjacentMines}
                        </span>
                      ) : ''
                    )
                  ) : (
                    cell.isFlagged ? 'F' : ''
                  )}
                </Cell>
              ))}
            </GridRow>
          ))}
        </GridContainer>
      </GameContainer>

      {gameState !== 'playing' && (
        <GameStatus data-testid="text-game-status">
          {gameState === 'won' ? 'You Win!' : 'Game Over!'}
        </GameStatus>
      )}
    </Container>
  );
}
