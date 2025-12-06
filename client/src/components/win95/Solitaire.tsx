import { useState, useEffect, useCallback } from 'react';
import Win95Button from './Win95Button';

type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
type Card = { suit: Suit; value: number; faceUp: boolean };
type GameState = 'playing' | 'won';

const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
const SUIT_SYMBOLS: Record<Suit, string> = { hearts: '♥', diamonds: '♦', clubs: '♣', spades: '♠' };
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
      return (
        <div
          className="w-[50px] h-[70px] rounded-sm border-2 border-dashed border-[#006600] bg-transparent cursor-pointer"
          onClick={onClick}
        />
      );
    }

    if (!card.faceUp) {
      return (
        <div
          className="w-[50px] h-[70px] rounded-sm bg-gradient-to-br from-blue-800 to-blue-600 border border-white cursor-pointer"
          onClick={onClick}
        />
      );
    }

    return (
      <div
        className={`w-[50px] h-[70px] rounded-sm bg-white border ${
          isSelected ? 'border-yellow-400 border-2' : 'border-gray-400'
        } cursor-pointer flex flex-col justify-between p-1 text-[12px] font-bold select-none`}
        style={{ color: SUIT_COLORS[card.suit] }}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
      >
        <div>{getCardDisplay(card.value)}{SUIT_SYMBOLS[card.suit]}</div>
        <div className="text-[18px] text-center">{SUIT_SYMBOLS[card.suit]}</div>
        <div className="rotate-180">{getCardDisplay(card.value)}{SUIT_SYMBOLS[card.suit]}</div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#008000] p-4" data-testid="solitaire">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <Win95Button onClick={initializeGame} data-testid="button-new-game">New Game</Win95Button>
        <div className="flex gap-4 text-white text-[12px]">
          <span data-testid="text-moves">Moves: {moves}</span>
          <span data-testid="text-time">Time: {formatTime(time)}</span>
        </div>
      </div>

      {/* Top row: Stock, Waste, and Foundations */}
      <div className="flex justify-between mb-4">
        <div className="flex gap-2">
          {/* Stock */}
          <div onClick={drawFromStock} data-testid="stock-pile">
            {stock.length > 0 ? (
              <CardComponent card={{ ...stock[stock.length - 1], faceUp: false }} />
            ) : (
              <div className="w-[50px] h-[70px] rounded-sm border-2 border-dashed border-white/30 flex items-center justify-center text-white cursor-pointer">
                ↻
              </div>
            )}
          </div>
          {/* Waste */}
          <div data-testid="waste-pile">
            {waste.length > 0 ? (
              <CardComponent
                card={waste[waste.length - 1]}
                onClick={() => handleCardClick('waste', [waste[waste.length - 1]])}
                onDoubleClick={() => handleDoubleClick('waste', waste[waste.length - 1])}
                isSelected={selectedCards?.source === 'waste'}
              />
            ) : (
              <CardComponent card={null} />
            )}
          </div>
        </div>

        {/* Foundations */}
        <div className="flex gap-2">
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
                <div className="w-[50px] h-[70px] rounded-sm border-2 border-dashed border-white/30 flex items-center justify-center text-white/50 text-[20px]">
                  {SUIT_SYMBOLS[SUITS[i]]}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tableau */}
      <div className="flex gap-2 flex-1">
        {tableau.map((pile, pileIndex) => (
          <div
            key={pileIndex}
            className="relative flex-1 min-w-[50px]"
            onClick={() => pile.length === 0 && handleCardClick(`tableau${pileIndex}`, [], pileIndex)}
            data-testid={`tableau-${pileIndex}`}
          >
            {pile.length === 0 ? (
              <CardComponent card={null} />
            ) : (
              pile.map((card, cardIndex) => {
                const isTopCard = cardIndex === pile.length - 1;
                const faceUpCards = pile.slice(cardIndex).filter(c => c.faceUp);
                const isSelectable = card.faceUp && faceUpCards.length > 0;

                return (
                  <div
                    key={cardIndex}
                    className="absolute"
                    style={{ top: cardIndex * 20 }}
                  >
                    <CardComponent
                      card={card}
                      onClick={() => isSelectable && handleCardClick(`tableau${pileIndex}`, pile.slice(cardIndex), pileIndex)}
                      onDoubleClick={() => isTopCard && card.faceUp && handleDoubleClick(`tableau${pileIndex}`, card, pileIndex)}
                      isSelected={selectedCards?.source === `tableau${pileIndex}` && selectedCards.cards.includes(card)}
                    />
                  </div>
                );
              })
            )}
          </div>
        ))}
      </div>

      {/* Win message */}
      {gameState === 'won' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="win95-window p-4 text-center">
            <h2 className="text-[16px] font-bold mb-2">Congratulations!</h2>
            <p className="text-[12px] mb-4">You won in {moves} moves and {formatTime(time)}!</p>
            <Win95Button onClick={initializeGame}>Play Again</Win95Button>
          </div>
        </div>
      )}
    </div>
  );
}
