import { useState, useEffect, useCallback } from 'react';
import { Button, Panel } from 'react95';
import styled from 'styled-components';

type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
type Card = { suit: Suit; value: number; faceUp: boolean };
type GameState = 'playing' | 'won';

const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
const SUIT_SYMBOLS: Record<Suit, string> = { hearts: 'H', diamonds: 'D', clubs: 'C', spades: 'S' };
const SUIT_COLORS: Record<Suit, string> = { hearts: '#FF0000', diamonds: '#FF0000', clubs: '#000000', spades: '#000000' };
const VALUE_NAMES: Record<number, string> = { 1: 'A', 11: 'J', 12: 'Q', 13: 'K' };

const createDeck = (): Card[] => {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (let value = 1; value <= 13; value++) {
      deck.push({ suit, value, faceUp: false });
    }
  }
  return deck;
};

const shuffleDeck = (deck: Card[]): Card[] => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #008000;
  padding: 16px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const StatsContainer = styled.div`
  display: flex;
  gap: 16px;
  color: white;
  font-size: 12px;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const StockWasteContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const FoundationsContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const TableauContainer = styled.div`
  display: flex;
  gap: 8px;
  flex: 1;
`;

const TableauPile = styled.div`
  position: relative;
  flex: 1;
  min-width: 50px;
`;

const CardSlot = styled.div<{ $dashed?: boolean }>`
  width: 50px;
  height: 70px;
  border-radius: 3px;
  border: 2px dashed ${props => props.$dashed ? 'rgba(255,255,255,0.3)' : '#006600'};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: rgba(255,255,255,0.5);
  font-size: 20px;
`;

const CardBack = styled.div`
  width: 50px;
  height: 70px;
  border-radius: 3px;
  background: linear-gradient(135deg, #0000aa 0%, #000088 100%);
  border: 1px solid white;
  cursor: pointer;
`;

const CardFace = styled.div<{ $isSelected?: boolean; $color: string }>`
  width: 50px;
  height: 70px;
  border-radius: 3px;
  background: white;
  border: ${props => props.$isSelected ? '2px solid #ffff00' : '1px solid #808080'};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 4px;
  font-size: 12px;
  font-weight: bold;
  color: ${props => props.$color};
  user-select: none;
`;

const CardCenter = styled.div`
  font-size: 18px;
  text-align: center;
`;

const CardCorner = styled.div<{ $rotated?: boolean }>`
  ${props => props.$rotated && 'transform: rotate(180deg);'}
`;

const StackedCard = styled.div<{ $offset: number }>`
  position: absolute;
  top: ${props => props.$offset * 20}px;
`;

const WinOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
`;

const WinDialog = styled(Panel)`
  padding: 16px;
  text-align: center;
  background: #c0c0c0;
`;

export default function Solitaire() {
  const [stock, setStock] = useState<Card[]>([]);
  const [waste, setWaste] = useState<Card[]>([]);
  const [foundations, setFoundations] = useState<Card[][]>([[], [], [], []]);
  const [tableau, setTableau] = useState<Card[][]>([[], [], [], [], [], [], []]);
  const [selectedCards, setSelectedCards] = useState<{ source: string; cards: Card[]; sourceIndex?: number } | null>(null);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);

  const initializeGame = useCallback(() => {
    const deck = shuffleDeck(createDeck());
    const newTableau: Card[][] = [[], [], [], [], [], [], []];
    let cardIndex = 0;

    for (let i = 0; i < 7; i++) {
      for (let j = i; j < 7; j++) {
        const card = { ...deck[cardIndex++], faceUp: i === j };
        newTableau[j].push(card);
      }
    }

    setTableau(newTableau);
    setStock(deck.slice(cardIndex));
    setWaste([]);
    setFoundations([[], [], [], []]);
    setSelectedCards(null);
    setGameState('playing');
    setMoves(0);
    setTime(0);
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === 'playing') {
      interval = setInterval(() => setTime(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [gameState]);

  const checkWin = () => {
    return foundations.every(f => f.length === 13);
  };

  const drawFromStock = () => {
    if (stock.length === 0) {
      setStock(waste.map(c => ({ ...c, faceUp: false })).reverse());
      setWaste([]);
    } else {
      const card = { ...stock[stock.length - 1], faceUp: true };
      setStock(stock.slice(0, -1));
      setWaste([...waste, card]);
    }
    setMoves(m => m + 1);
  };

  const canPlaceOnFoundation = (card: Card, foundationIndex: number): boolean => {
    const foundation = foundations[foundationIndex];
    if (foundation.length === 0) {
      return card.value === 1;
    }
    const topCard = foundation[foundation.length - 1];
    return card.suit === topCard.suit && card.value === topCard.value + 1;
  };

  const canPlaceOnTableau = (card: Card, pileIndex: number): boolean => {
    const pile = tableau[pileIndex];
    if (pile.length === 0) {
      return card.value === 13;
    }
    const topCard = pile[pile.length - 1];
    const isRed = (s: Suit) => s === 'hearts' || s === 'diamonds';
    return isRed(card.suit) !== isRed(topCard.suit) && card.value === topCard.value - 1;
  };

  const handleCardClick = (source: string, cards: Card[], sourceIndex?: number) => {
    if (!selectedCards) {
      if (cards.length > 0 && cards[0].faceUp) {
        setSelectedCards({ source, cards, sourceIndex });
      }
    } else {
      if (source.startsWith('foundation')) {
        const foundationIndex = parseInt(source.replace('foundation', ''));
        if (selectedCards.cards.length === 1 && canPlaceOnFoundation(selectedCards.cards[0], foundationIndex)) {
          moveCards(selectedCards, source, foundationIndex);
        }
      } else if (source.startsWith('tableau')) {
        const pileIndex = parseInt(source.replace('tableau', ''));
        if (canPlaceOnTableau(selectedCards.cards[0], pileIndex)) {
          moveCards(selectedCards, source, pileIndex);
        }
      }
      setSelectedCards(null);
    }
  };

  const moveCards = (from: { source: string; cards: Card[]; sourceIndex?: number }, to: string, toIndex: number) => {
    const cardCount = from.cards.length;

    if (from.source === 'waste') {
      setWaste(waste.slice(0, -1));
    } else if (from.source.startsWith('tableau')) {
      const pileIndex = from.sourceIndex!;
      const newPile = tableau[pileIndex].slice(0, -cardCount);
      if (newPile.length > 0 && !newPile[newPile.length - 1].faceUp) {
        newPile[newPile.length - 1].faceUp = true;
      }
      const newTableau = [...tableau];
      newTableau[pileIndex] = newPile;
      setTableau(newTableau);
    } else if (from.source.startsWith('foundation')) {
      const foundationIndex = from.sourceIndex!;
      const newFoundations = [...foundations];
      newFoundations[foundationIndex] = foundations[foundationIndex].slice(0, -1);
      setFoundations(newFoundations);
    }

    if (to.startsWith('foundation')) {
      const newFoundations = [...foundations];
      newFoundations[toIndex] = [...foundations[toIndex], ...from.cards];
      setFoundations(newFoundations);
    } else if (to.startsWith('tableau')) {
      const newTableau = [...tableau];
      newTableau[toIndex] = [...tableau[toIndex], ...from.cards];
      setTableau(newTableau);
    }

    setMoves(m => m + 1);

    setTimeout(() => {
      if (checkWin()) {
        setGameState('won');
      }
    }, 100);
  };

  const handleDoubleClick = (source: string, card: Card, sourceIndex?: number) => {
    for (let i = 0; i < 4; i++) {
      if (canPlaceOnFoundation(card, i)) {
        moveCards({ source, cards: [card], sourceIndex }, `foundation${i}`, i);
        return;
      }
    }
  };

  const getCardDisplay = (value: number): string => VALUE_NAMES[value] || String(value);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const CardComponent = ({ card, onClick, onDoubleClick, isSelected }: {
    card: Card | null;
    onClick?: () => void;
    onDoubleClick?: () => void;
    isSelected?: boolean;
  }) => {
    if (!card) {
      return <CardSlot onClick={onClick} />;
    }

    if (!card.faceUp) {
      return <CardBack onClick={onClick} />;
    }

    return (
      <CardFace
        $isSelected={isSelected}
        $color={SUIT_COLORS[card.suit]}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
      >
        <CardCorner>{getCardDisplay(card.value)}{SUIT_SYMBOLS[card.suit]}</CardCorner>
        <CardCenter>{SUIT_SYMBOLS[card.suit]}</CardCenter>
        <CardCorner $rotated>{getCardDisplay(card.value)}{SUIT_SYMBOLS[card.suit]}</CardCorner>
      </CardFace>
    );
  };

  return (
    <Container data-testid="solitaire">
      <Header>
        <Button onClick={initializeGame} data-testid="button-new-game">New Game</Button>
        <StatsContainer>
          <span data-testid="text-moves">Moves: {moves}</span>
          <span data-testid="text-time">Time: {formatTime(time)}</span>
        </StatsContainer>
      </Header>

      <TopRow>
        <StockWasteContainer>
          <div onClick={drawFromStock} data-testid="stock-pile">
            {stock.length > 0 ? (
              <CardBack />
            ) : (
              <CardSlot $dashed>R</CardSlot>
            )}
          </div>
          <div data-testid="waste-pile">
            {waste.length > 0 ? (
              <CardComponent
                card={waste[waste.length - 1]}
                onClick={() => handleCardClick('waste', [waste[waste.length - 1]])}
                onDoubleClick={() => handleDoubleClick('waste', waste[waste.length - 1])}
                isSelected={selectedCards?.source === 'waste'}
              />
            ) : (
              <CardSlot />
            )}
          </div>
        </StockWasteContainer>

        <FoundationsContainer>
          {foundations.map((foundation, i) => (
            <div
              key={i}
              onClick={() => handleCardClick(`foundation${i}`, foundation.length > 0 ? [foundation[foundation.length - 1]] : [], i)}
              data-testid={`foundation-${i}`}
            >
              {foundation.length > 0 ? (
                <CardComponent
                  card={foundation[foundation.length - 1]}
                  isSelected={selectedCards?.source === `foundation${i}`}
                />
              ) : (
                <CardSlot $dashed>{SUIT_SYMBOLS[SUITS[i]]}</CardSlot>
              )}
            </div>
          ))}
        </FoundationsContainer>
      </TopRow>

      <TableauContainer>
        {tableau.map((pile, pileIndex) => (
          <TableauPile
            key={pileIndex}
            onClick={() => pile.length === 0 && handleCardClick(`tableau${pileIndex}`, [], pileIndex)}
            data-testid={`tableau-${pileIndex}`}
          >
            {pile.length === 0 ? (
              <CardSlot />
            ) : (
              pile.map((card, cardIndex) => {
                const isTopCard = cardIndex === pile.length - 1;
                const faceUpCards = pile.slice(cardIndex).filter(c => c.faceUp);
                const isSelectable = card.faceUp && faceUpCards.length > 0;

                return (
                  <StackedCard key={cardIndex} $offset={cardIndex}>
                    <CardComponent
                      card={card}
                      onClick={() => isSelectable && handleCardClick(`tableau${pileIndex}`, pile.slice(cardIndex), pileIndex)}
                      onDoubleClick={() => isTopCard && card.faceUp && handleDoubleClick(`tableau${pileIndex}`, card, pileIndex)}
                      isSelected={selectedCards?.source === `tableau${pileIndex}` && selectedCards.cards.includes(card)}
                    />
                  </StackedCard>
                );
              })
            )}
          </TableauPile>
        ))}
      </TableauContainer>

      {gameState === 'won' && (
        <WinOverlay>
          <WinDialog variant="outside">
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>Congratulations!</h2>
            <p style={{ fontSize: '12px', marginBottom: '16px' }}>You won in {moves} moves and {formatTime(time)}!</p>
            <Button onClick={initializeGame}>Play Again</Button>
          </WinDialog>
        </WinOverlay>
      )}
    </Container>
  );
}
