import { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { TILE_IMAGES } from "../constants/crabImages";

const TIMER_SECONDS = 60;
const RANKINGS_KEY = "crab_memory_rankings";
const DESKTOP_BREAKPOINT = 768;

type Difficulty = "easy" | "normal" | "hard";
type SoundType = "flip" | "match" | "win";

interface Card {
  id: number;
  pairId: number;
  image: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface RankingEntry {
  time: number;
  moves: number;
  date: string;
  difficulty: Difficulty;
}

const DIFFICULTY_SETTINGS: Record<
  Difficulty,
  { label: string; mobilePairs: number; desktopPairs: number }
> = {
  easy: { label: "쉬움", mobilePairs: 6, desktopPairs: 8 },
  normal: { label: "보통", mobilePairs: 8, desktopPairs: 12 },
  hard: { label: "어려움", mobilePairs: 10, desktopPairs: 15 },
};

const SOUND_SOURCES: Partial<Record<SoundType, string>> = {};

const shuffle = <T,>(items: T[]): T[] => {
  const array = [...items];
  for (let index = array.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [array[index], array[randomIndex]] = [array[randomIndex], array[index]];
  }
  return array;
};

const formatTime = (totalSeconds: number) => {
  const safeSeconds = Math.max(0, totalSeconds);
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const isRankingEntry = (value: unknown): value is RankingEntry => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const entry = value as Partial<RankingEntry>;
  return (
    typeof entry.time === "number" &&
    typeof entry.moves === "number" &&
    typeof entry.date === "string" &&
    entry.difficulty !== undefined &&
    ["easy", "normal", "hard"].includes(entry.difficulty)
  );
};

const loadRankings = (): RankingEntry[] => {
  if (typeof window === "undefined") {
    return [];
  }

  const stored = window.localStorage.getItem(RANKINGS_KEY);
  if (!stored) {
    return [];
  }

  try {
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isRankingEntry).slice(0, 5);
  } catch (error) {
    console.error("Failed to parse crab memory rankings", error);
    return [];
  }
};

const createAudioMap = (): Partial<Record<SoundType, HTMLAudioElement>> => {
  if (typeof window === "undefined" || typeof Audio === "undefined") {
    return {};
  }

  const map: Partial<Record<SoundType, HTMLAudioElement>> = {};
  (Object.entries(SOUND_SOURCES) as Array<[SoundType, string]>).forEach(
    ([type, source]) => {
      if (!source) {
        return;
      }
      const audio = new Audio(source);
      audio.preload = "auto";
      map[type] = audio;
    }
  );
  return map;
};

const CrabMemory = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [isDesktop, setIsDesktop] = useState<boolean>(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`).matches;
  });
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [hasWon, setHasWon] = useState(false);
  const [statusText, setStatusText] = useState("카드를 뒤집어 시작하세요.");
  const [rankings, setRankings] = useState<RankingEntry[]>(() =>
    loadRankings()
  );

  const audioMap = useMemo(createAudioMap, []);

  const playSound = useCallback(
    (type: SoundType) => {
      const audio = audioMap[type];
      if (!audio) {
        return;
      }
      audio.currentTime = 0;
      void audio.play().catch(() => undefined);
    },
    [audioMap]
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia(
      `(min-width: ${DESKTOP_BREAKPOINT}px)`
    );

    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsDesktop(event.matches);
    };

    setIsDesktop(mediaQuery.matches);

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    if (typeof mediaQuery.addListener === "function") {
      const listener = (event: MediaQueryListEvent) => handleChange(event);
      mediaQuery.addListener(listener);
      return () => mediaQuery.removeListener(listener);
    }

    return undefined;
  }, []);

  const pairCount = useMemo(() => {
    const setting = DIFFICULTY_SETTINGS[difficulty];
    return isDesktop ? setting.desktopPairs : setting.mobilePairs;
  }, [difficulty, isDesktop]);

  const createDeck = useCallback((): Card[] => {
    const safePairCount = Math.min(pairCount, TILE_IMAGES.length);
    const selectedImages = shuffle(TILE_IMAGES).slice(0, safePairCount);
    const duplicated = selectedImages.flatMap((image, index) => [
      {
        id: index * 2,
        pairId: index,
        image,
        isFlipped: false,
        isMatched: false,
      },
      {
        id: index * 2 + 1,
        pairId: index,
        image,
        isFlipped: false,
        isMatched: false,
      },
    ]);
    return shuffle(duplicated);
  }, [pairCount]);

  const initializeGame = useCallback(
    (options?: { preserveStatus?: boolean }) => {
      setCards(createDeck());
      setSelectedIds([]);
      setMoves(0);
      setStartTime(null);
      setElapsedTime(0);
      setHasWon(false);
      setTimeLeft(TIMER_SECONDS);
      if (!options?.preserveStatus) {
        setStatusText("카드를 뒤집어 시작하세요.");
      }
    },
    [createDeck]
  );

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    if (startTime === null || hasWon) {
      return;
    }

    if (typeof window === "undefined") {
      return;
    }

    const interval = window.setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [startTime, hasWon]);

  useEffect(() => {
    if (!timerEnabled || startTime === null || hasWon) {
      return;
    }

    if (typeof window === "undefined") {
      return;
    }

    const interval = window.setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          return 0;
        }
        return previous - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [timerEnabled, startTime, hasWon]);

  useEffect(() => {
    if (selectedIds.length !== 2) {
      return;
    }

    const [firstId, secondId] = selectedIds;
    const firstCard = cards.find((card) => card.id === firstId);
    const secondCard = cards.find((card) => card.id === secondId);

    if (!firstCard || !secondCard) {
      setSelectedIds([]);
      return;
    }

    setMoves((value) => value + 1);

    if (firstCard.pairId === secondCard.pairId) {
      setCards((previous) =>
        previous.map((card) =>
          card.pairId === firstCard.pairId
            ? { ...card, isMatched: true, isFlipped: true }
            : card
        )
      );
      setSelectedIds([]);
      playSound("match");
      return;
    }

    if (typeof window === "undefined") {
      setSelectedIds([]);
      return;
    }

    const timeout = window.setTimeout(() => {
      setCards((previous) =>
        previous.map((card) =>
          card.id === firstId || card.id === secondId
            ? { ...card, isFlipped: false }
            : card
        )
      );
      setSelectedIds([]);
    }, 800);

    return () => window.clearTimeout(timeout);
  }, [selectedIds, cards, playSound]);

  useEffect(() => {
    if (cards.length === 0 || hasWon) {
      return;
    }

    const allMatched = cards.every((card) => card.isMatched);
    if (allMatched) {
      setHasWon(true);
    }
  }, [cards, hasWon]);

  useEffect(() => {
    if (!timerEnabled || timeLeft > 0) {
      return;
    }

    setStatusText("시간 초과! 다시 도전해보세요.");
    initializeGame({ preserveStatus: true });
  }, [timerEnabled, timeLeft, initializeGame]);

  useEffect(() => {
    if (!hasWon || startTime === null) {
      return;
    }

    const finalTime = Math.floor((Date.now() - startTime) / 1000);
    if (elapsedTime !== finalTime) {
      setElapsedTime(finalTime);
    }

    setStartTime(null);
    setStatusText(
      `축하합니다! ${formatTime(finalTime)}만에 ${moves}번의 시도로 성공했어요.`
    );
    playSound("win");

    const newEntry: RankingEntry = {
      time: finalTime,
      moves,
      date: new Date().toISOString(),
      difficulty,
    };

    setRankings((previous) => {
      const updated = [...previous, newEntry]
        .sort((a, b) => {
          if (a.time !== b.time) {
            return a.time - b.time;
          }
          return a.moves - b.moves;
        })
        .slice(0, 5);

      if (typeof window !== "undefined") {
        window.localStorage.setItem(RANKINGS_KEY, JSON.stringify(updated));
      }

      return updated;
    });
  }, [hasWon, startTime, elapsedTime, moves, difficulty, playSound]);

  const handleCardClick = useCallback(
    (cardId: number) => {
      if (hasWon) {
        return;
      }

      if (timerEnabled && timeLeft <= 0) {
        return;
      }

      const card = cards.find((item) => item.id === cardId);
      if (!card || card.isMatched || card.isFlipped) {
        return;
      }

      if (selectedIds.length === 2) {
        return;
      }

      setCards((previous) =>
        previous.map((item) =>
          item.id === cardId ? { ...item, isFlipped: true } : item
        )
      );

      if (startTime === null) {
        setStartTime(Date.now());
        setStatusText("같은 그림을 찾아보세요!");
      }

      setSelectedIds((value) => [...value, cardId]);
      playSound("flip");
    },
    [
      cards,
      hasWon,
      timerEnabled,
      timeLeft,
      selectedIds.length,
      startTime,
      playSound,
    ]
  );

  const handleDifficultyChange = (value: Difficulty) => {
    if (value === difficulty) {
      return;
    }
    setDifficulty(value);
  };

  const handleReset = () => {
    initializeGame();
  };

  const handleTimerToggle = () => {
    setTimerEnabled((previous) => {
      const next = !previous;
      if (next) {
        const referenceTime = startTime
          ? Math.floor((Date.now() - startTime) / 1000)
          : elapsedTime;
        setTimeLeft(Math.max(TIMER_SECONDS - referenceTime, 0));
      } else {
        setTimeLeft(TIMER_SECONDS);
      }
      return next;
    });
  };

  const currentTimeDisplay = timerEnabled
    ? formatTime(timeLeft)
    : formatTime(elapsedTime);

  const effectivePairCount = Math.min(pairCount, TILE_IMAGES.length);

  const gridColumnSize = useMemo(() => {
    if (effectivePairCount >= 15) {
      return "repeat(auto-fit, minmax(96px, 1fr))";
    }
    if (effectivePairCount >= 10) {
      return "repeat(auto-fit, minmax(88px, 1fr))";
    }
    return "repeat(auto-fit, minmax(80px, 1fr))";
  }, [effectivePairCount]);

  return (
    <PageContainer>
      <HeaderSection>
        <Title>크랩 메모리</Title>
        <Subtitle>귀여운 베게 친구들의 그림을 짝지어 보세요!</Subtitle>
      </HeaderSection>

      <ControlsRow>
        <ControlGroup>
          <ControlLabel>난이도</ControlLabel>
          <DifficultyList>
            {(
              Object.entries(DIFFICULTY_SETTINGS) as Array<
                [
                  Difficulty,
                  { label: string; mobilePairs: number; desktopPairs: number }
                ]
              >
            ).map(([value, config]) => (
              <DifficultyButton
                key={value}
                type="button"
                $active={value === difficulty}
                onClick={() => handleDifficultyChange(value)}
              >
                {config.label}
              </DifficultyButton>
            ))}
          </DifficultyList>
        </ControlGroup>

        <ControlGroup>
          <ControlLabel>옵션</ControlLabel>
          <OptionsRow>
            <ToggleWrapper>
              <ToggleInput
                id="timer-toggle"
                type="checkbox"
                checked={timerEnabled}
                onChange={handleTimerToggle}
              />
              <ToggleText>60초 제한</ToggleText>
            </ToggleWrapper>

            <ResetButton type="button" onClick={handleReset}>
              다시 시작
            </ResetButton>
          </OptionsRow>
        </ControlGroup>
      </ControlsRow>

      <StatsBar>
        <StatItem>
          <StatLabel>난이도</StatLabel>
          <StatValue>{DIFFICULTY_SETTINGS[difficulty].label}</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>카드 쌍</StatLabel>
          <StatValue>{effectivePairCount}쌍</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>시도 횟수</StatLabel>
          <StatValue>{moves}</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>{timerEnabled ? "남은 시간" : "경과 시간"}</StatLabel>
          <StatValue>{currentTimeDisplay}</StatValue>
        </StatItem>
      </StatsBar>

      <StatusBanner>{statusText}</StatusBanner>

      <BoardGrid $templateColumns={gridColumnSize}>
        {cards.map((card) => {
          const isDisabled =
            card.isMatched ||
            card.isFlipped ||
            selectedIds.length === 2 ||
            hasWon ||
            (timerEnabled && timeLeft <= 0);

          return (
            <CardButton
              key={card.id}
              type="button"
              onClick={() => handleCardClick(card.id)}
              disabled={isDisabled}
              $isFlipped={card.isFlipped || card.isMatched}
              $isMatched={card.isMatched}
              aria-label={card.isMatched ? "이미 맞춘 카드" : "카드 뒤집기"}
            >
              {card.isFlipped || card.isMatched ? (
                <CardFace>
                  <CardImage src={card.image} alt="베게 친구" />
                </CardFace>
              ) : (
                <CardBack>
                  <CardBackImage src={TILE_IMAGES[0]} alt="크랩 메모리" />
                </CardBack>
              )}
            </CardButton>
          );
        })}
      </BoardGrid>

      <RankingsSection>
        <RankingsHeader>🏆 TOP 5 기록</RankingsHeader>
        {rankings.length === 0 ? (
          <EmptyRankings>
            아직 기록이 없습니다. 지금 도전해 보세요!
          </EmptyRankings>
        ) : (
          <RankingsList>
            {rankings.map((entry, index) => (
              <RankingItem key={`${entry.date}-${index}`}>
                <RankingOrder>{index + 1}</RankingOrder>
                <RankingDetails>
                  <RankingPrimary>
                    {DIFFICULTY_SETTINGS[entry.difficulty].label} ·{" "}
                    {formatTime(entry.time)} · {entry.moves}회
                  </RankingPrimary>
                  <RankingSecondary>
                    {new Date(entry.date).toLocaleDateString()}
                  </RankingSecondary>
                </RankingDetails>
              </RankingItem>
            ))}
          </RankingsList>
        )}
      </RankingsSection>
    </PageContainer>
  );
};

const PageContainer = styled.main`
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[5]} ${({ theme }) => theme.spacing[3]};
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.text};
`;

const HeaderSection = styled.header`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
  text-align: center;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  color: ${({ theme }) => theme.colors.primary};
  margin: 0;
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ControlsRow = styled.section`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[3]};
  justify-content: space-between;
  align-items: flex-start;
`;

const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const ControlLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  letter-spacing: 0.02em;
`;

const DifficultyList = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const DifficultyButton = styled.button<{ $active: boolean }>`
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid
    ${({ theme, $active }) =>
      $active ? theme.colors.primary : theme.colors.border};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.primary : theme.colors.surface};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.onPrimary : theme.colors.text};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  cursor: pointer;
  transition: background ${({ theme }) => theme.transitions.base},
    transform ${({ theme }) => theme.transitions.base};

  &:hover {
    transform: translateY(-2px);
  }
`;

const OptionsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[2]};
  align-items: center;
`;

const ToggleWrapper = styled.label`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  cursor: pointer;
  user-select: none;
`;

const ToggleInput = styled.input`
  appearance: none;
  width: 2.5rem;
  height: 1.4rem;
  border-radius: 9999px;
  background: ${({ theme }) => theme.colors.border};
  position: relative;
  outline: none;
  transition: background ${({ theme }) => theme.transitions.base};
  margin: 0;
  flex-shrink: 0;

  &:checked {
    background: ${({ theme }) => theme.colors.primary};
  }

  &:before {
    content: "";
    position: absolute;
    top: 0.15rem;
    left: 0.2rem;
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.surface};
    transition: transform ${({ theme }) => theme.transitions.base};
  }

  &:checked:before {
    transform: translateX(1rem);
  }
`;

const ToggleText = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text};
`;

const ResetButton = styled.button`
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: none;
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.onPrimary};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.xs};
  transition: transform ${({ theme }) => theme.transitions.base},
    box-shadow ${({ theme }) => theme.transitions.base};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }
`;

const StatsBar = styled.section`
  display: grid;
  gap: ${({ theme }) => theme.spacing[2]};
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  padding: ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.xs};
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const StatLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  letter-spacing: 0.05em;
  text-transform: uppercase;
`;

const StatValue = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

const StatusBanner = styled.div`
  padding: ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surfaceMuted};
  text-align: center;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text};
`;

const BoardGrid = styled.div<{ $templateColumns: string }>`
  display: grid;
  width: 100%;
  gap: ${({ theme }) => theme.spacing[3]};
  grid-template-columns: ${({ $templateColumns }) => $templateColumns};
  justify-items: center;
`;

const CardButton = styled.button<{ $isFlipped: boolean; $isMatched: boolean }>`
  width: 100%;
  height: 120px;
  border-radius: ${({ theme }) => theme.radii.lg};
  border: none;
  padding: ${({ theme }) => theme.spacing[2]};
  background: ${({ theme, $isFlipped }) =>
    $isFlipped ? theme.colors.surface : theme.colors.primary};
  color: ${({ theme }) => theme.colors.onPrimary};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  cursor: pointer;
  transition: transform ${({ theme }) => theme.transitions.base},
    box-shadow ${({ theme }) => theme.transitions.base};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }

  &:disabled {
    cursor: default;
    opacity: ${({ $isMatched }) => ($isMatched ? 0.7 : 0.85)};
    transform: none;
  }
`;

const CardFace = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
`;

const CardImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: contain;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  pointer-events: none;
  -webkit-touch-callout: none;
  -webkit-user-drag: none;
  -khtml-user-select: none;
`;

const CardBack = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSizes.xl};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.bg};
  color: #ffffff;
  overflow: hidden;
`;

const CardBackImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: contain;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  pointer-events: none;
  -webkit-touch-callout: none;
  -webkit-user-drag: none;
  -khtml-user-select: none;
`;

const RankingsSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.xs};
`;

const RankingsHeader = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.primary};
`;

const EmptyRankings = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const RankingsList = styled.ol`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const RankingItem = styled.li`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surfaceMuted};
`;

const RankingOrder = styled.span`
  width: 2rem;
  height: 2rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.onPrimary};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

const RankingDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const RankingPrimary = styled.span`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const RankingSecondary = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export default CrabMemory;
