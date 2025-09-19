import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import styled from "styled-components";

const HIGH_SCORE_KEY = "ocean-run-high-score";

interface BackgroundAsset {
  id: string;
  color: string;
  accent: string;
  url?: string;
}

interface ObstacleAsset {
  id: string;
  color: string;
  label: string;
  emoji?: string;
  url?: string;
}

interface FishAsset {
  color: string;
  emoji?: string;
  url?: string;
}

const BACKGROUND_ASSETS: BackgroundAsset[] = [
  {
    id: "sunlight",
    color: "#0a3d62",
    accent: "#1d6fa3",
    // url: "https://example.com/background-1.png",
  },
  {
    id: "reef",
    color: "#082a4d",
    accent: "#13426b",
    // url: "https://example.com/background-2.png",
  },
];

const OBSTACLE_ASSETS: ObstacleAsset[] = [
  {
    id: "puffer",
    color: "#f6bd60",
    label: "Puffer",
    emoji: "🐡",
    // url: "https://example.com/pufferfish.png",
  },
  {
    id: "starfish",
    color: "#f28482",
    label: "Starfish",
    emoji: "⭐",
    // url: "https://example.com/starfish.png",
  },
  {
    id: "octopus",
    color: "#9d4edd",
    label: "Octopus",
    emoji: "🐙",
    // url: "https://example.com/octopus.png",
  },
  {
    id: "shark",
    color: "#8e9aaf",
    label: "Shark",
    emoji: "🦈",
    // url: "https://example.com/shark.png",
  },
  {
    id: "ray",
    color: "#00afb9",
    label: "Ray",
    emoji: "🪸",
    // url: "https://example.com/ray.png",
  },
];

const FISH_ASSET: FishAsset = {
  color: "#f4a261",
  emoji: "🐠",
  // url: "https://example.com/player-fish.png",
};

const BASE_BACKGROUND_SPEED = 220;
const BASE_SPAWN_INTERVAL = 1.6;
const MIN_SPAWN_INTERVAL = 0.6;
const GRAVITY = 1800;
const SWIM_FORCE = -600;
const MAX_DIFFICULTY_FACTOR = 2.8;

const FISH_COLLISION_PADDING = 12;
const OBSTACLE_COLLISION_PADDING = 10;

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  type: ObstacleAsset;
  passed: boolean;
}

interface GameState {
  width: number;
  height: number;
  fish: {
    x: number;
    y: number;
    width: number;
    height: number;
    velocity: number;
  };
  backgroundOffset: number;
  backgroundSpeed: number;
  spawnTimer: number;
  spawnInterval: number;
  elapsedTime: number;
  difficultyFactor: number;
  obstacles: Obstacle[];
}

const createGameState = (width: number, height: number): GameState => {
  const fishHeight = Math.max(48, height * 0.12);
  const fishWidth = fishHeight * 1.35;

  return {
    width,
    height,
    fish: {
      x: width * 0.2,
      y: height / 2 - fishHeight / 2,
      width: fishWidth,
      height: fishHeight,
      velocity: 0,
    },
    backgroundOffset: 0,
    backgroundSpeed: BASE_BACKGROUND_SPEED,
    spawnTimer: 0,
    spawnInterval: BASE_SPAWN_INTERVAL,
    elapsedTime: 0,
    difficultyFactor: 1,
    obstacles: [],
  };
};

const checkCollision = (fish: GameState["fish"], obstacle: Obstacle) => {
  const fishRect = {
    x: fish.x + FISH_COLLISION_PADDING,
    y: fish.y + FISH_COLLISION_PADDING,
    width: fish.width - FISH_COLLISION_PADDING * 2,
    height: fish.height - FISH_COLLISION_PADDING * 2,
  };

  const obstacleRect = {
    x: obstacle.x + OBSTACLE_COLLISION_PADDING,
    y: obstacle.y + OBSTACLE_COLLISION_PADDING,
    width: obstacle.width - OBSTACLE_COLLISION_PADDING * 2,
    height: obstacle.height - OBSTACLE_COLLISION_PADDING * 2,
  };

  if (fishRect.width <= 0 || fishRect.height <= 0) {
    return false;
  }

  if (obstacleRect.width <= 0 || obstacleRect.height <= 0) {
    return false;
  }

  return (
    fishRect.x < obstacleRect.x + obstacleRect.width &&
    fishRect.x + fishRect.width > obstacleRect.x &&
    fishRect.y < obstacleRect.y + obstacleRect.height &&
    fishRect.y + fishRect.height > obstacleRect.y
  );
};

const drawBackgroundLayers = (
  ctx: CanvasRenderingContext2D,
  game: GameState,
  images: (HTMLImageElement | null)[],
) => {
  const { width, height, backgroundOffset } = game;
  if (width <= 0 || height <= 0) {
    return;
  }

  const layers = BACKGROUND_ASSETS.length;
  const totalWidth = width * layers;
  const safeTotalWidth = totalWidth > 0 ? totalWidth : width;
  const offset = ((backgroundOffset % safeTotalWidth) + safeTotalWidth) % safeTotalWidth;
  const baseIndex = Math.floor(offset / width);
  const offsetWithin = offset % width;

  for (let i = 0; i <= layers; i += 1) {
    const assetIndex = (baseIndex + i) % layers;
    const asset = BACKGROUND_ASSETS[assetIndex];
    const image = images[assetIndex];
    const drawX = i * width - offsetWithin;

    if (image) {
      ctx.drawImage(image, drawX, 0, width, height);
    } else {
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, asset.accent);
      gradient.addColorStop(1, asset.color);
      ctx.fillStyle = gradient;
      ctx.fillRect(drawX, 0, width, height);

      const bubbleCount = Math.max(8, Math.floor(width / 90));
      for (let bubble = 0; bubble < bubbleCount; bubble += 1) {
        const radius = (height / 120) * (0.75 + (bubble % 4) * 0.3);
        const bubbleX =
          drawX + ((bubble * 97 + (assetIndex + 1) * 53) % width);
        const bubbleY = ((bubble * 67 + assetIndex * 23) % height) * 0.9;
        ctx.save();
        ctx.globalAlpha = 0.05 + (bubble % 3) * 0.04;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.ellipse(bubbleX, bubbleY, radius, radius, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
  }
};

const drawFishSprite = (
  ctx: CanvasRenderingContext2D,
  fish: GameState["fish"],
  image: HTMLImageElement | null,
) => {
  if (image) {
    ctx.drawImage(image, fish.x, fish.y, fish.width, fish.height);
    return;
  }

  ctx.save();
  ctx.translate(fish.x, fish.y);
  ctx.fillStyle = FISH_ASSET.color;
  ctx.beginPath();
  ctx.ellipse(
    fish.width / 2,
    fish.height / 2,
    fish.width / 2,
    fish.height / 2,
    0,
    0,
    Math.PI * 2,
  );
  ctx.fill();

  ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
  ctx.beginPath();
  ctx.moveTo(fish.width * 0.25, fish.height * 0.5);
  ctx.lineTo(0, fish.height * 0.2);
  ctx.lineTo(0, fish.height * 0.8);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
  ctx.beginPath();
  ctx.arc(fish.width * 0.72, fish.height * 0.38, fish.height * 0.09, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#1f2933";
  ctx.beginPath();
  ctx.arc(fish.width * 0.76, fish.height * 0.38, fish.height * 0.045, 0, Math.PI * 2);
  ctx.fill();

  if (FISH_ASSET.emoji) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.font = `${Math.floor(fish.height * 0.7)}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(FISH_ASSET.emoji, fish.width / 2, fish.height / 2 + fish.height * 0.05);
  }

  ctx.restore();
};

const drawObstacleSprite = (
  ctx: CanvasRenderingContext2D,
  obstacle: Obstacle,
  image: HTMLImageElement | null,
) => {
  const { type } = obstacle;

  if (image) {
    ctx.drawImage(image, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    return;
  }

  ctx.save();
  ctx.translate(obstacle.x, obstacle.y);
  ctx.fillStyle = type.color;
  ctx.beginPath();
  ctx.ellipse(
    obstacle.width / 2,
    obstacle.height / 2,
    obstacle.width / 2,
    obstacle.height / 2,
    0,
    0,
    Math.PI * 2,
  );
  ctx.fill();

  ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
  ctx.lineWidth = Math.max(2, obstacle.width * 0.08);
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = `${Math.floor(obstacle.height * 0.55)}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const label = type.emoji ?? type.label;
  ctx.fillText(label, obstacle.width / 2, obstacle.height / 2 + obstacle.height * 0.05);

  ctx.restore();
};

const OceanRun = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const backgroundImagesRef = useRef<(HTMLImageElement | null)[]>(
    new Array(BACKGROUND_ASSETS.length).fill(null),
  );
  const obstacleImagesRef = useRef<Record<string, HTMLImageElement | null>>({});
  const fishImageRef = useRef<HTMLImageElement | null>(null);
  const animationRef = useRef<number>();
  const lastTimestampRef = useRef<number>(0);

  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [difficultyLevel, setDifficultyLevel] = useState(1);

  const gameRef = useRef<GameState>(createGameState(800, 450));
  const scoreRef = useRef(0);
  const highScoreRef = useRef(0);
  const difficultyLevelRef = useRef(1);
  const isPausedRef = useRef(false);
  const isGameOverRef = useRef(false);
  const swimRequestRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const stored = window.localStorage.getItem(HIGH_SCORE_KEY);
    if (stored) {
      const parsed = Number.parseInt(stored, 10);
      if (!Number.isNaN(parsed)) {
        setHighScore(parsed);
        highScoreRef.current = parsed;
      }
    }
  }, []);

  useEffect(() => {
    BACKGROUND_ASSETS.forEach((asset, index) => {
      if (!asset.url) {
        backgroundImagesRef.current[index] = null;
        return;
      }

      const image = new Image();
      image.crossOrigin = "anonymous";
      image.src = asset.url;
      image.onload = () => {
        backgroundImagesRef.current[index] = image;
      };
      image.onerror = () => {
        backgroundImagesRef.current[index] = null;
      };
    });

    OBSTACLE_ASSETS.forEach((asset) => {
      if (!asset.url) {
        obstacleImagesRef.current[asset.id] = null;
        return;
      }

      const image = new Image();
      image.crossOrigin = "anonymous";
      image.src = asset.url;
      image.onload = () => {
        obstacleImagesRef.current[asset.id] = image;
      };
      image.onerror = () => {
        obstacleImagesRef.current[asset.id] = null;
      };
    });

    if (FISH_ASSET.url) {
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.src = FISH_ASSET.url;
      image.onload = () => {
        fishImageRef.current = image;
      };
    }
  }, []);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    highScoreRef.current = highScore;
  }, [highScore]);

  useEffect(() => {
    difficultyLevelRef.current = difficultyLevel;
  }, [difficultyLevel]);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    isGameOverRef.current = isGameOver;
  }, [isGameOver]);

  const endGame = useCallback(() => {
    if (isGameOverRef.current) {
      return;
    }
    isGameOverRef.current = true;
    swimRequestRef.current = false;
    setIsGameOver(true);
    setIsPaused(false);
    isPausedRef.current = false;

    if (scoreRef.current > highScoreRef.current) {
      const nextHighScore = scoreRef.current;
      setHighScore(nextHighScore);
      highScoreRef.current = nextHighScore;
      if (typeof window !== "undefined") {
        window.localStorage.setItem(HIGH_SCORE_KEY, String(nextHighScore));
      }
    }
  }, []);

  const spawnObstacle = useCallback((game: GameState) => {
    const asset = OBSTACLE_ASSETS[Math.floor(Math.random() * OBSTACLE_ASSETS.length)];
    const baseSize = Math.max(game.height * 0.12, 48);
    const size = baseSize * (0.85 + Math.random() * 0.5);
    const width = size;
    const height = size;
    const verticalPadding = game.height * 0.08;
    const maxY = Math.max(verticalPadding, game.height - height - verticalPadding);
    const y = verticalPadding + Math.random() * Math.max(0, maxY - verticalPadding);
    const speedMultiplier = 0.6 + Math.random() * 0.5;

    game.obstacles.push({
      x: game.width + width,
      y,
      width,
      height,
      speed: game.backgroundSpeed * speedMultiplier,
      type: asset,
      passed: false,
    });
  }, []);

  const updateGame = useCallback(
    (delta: number) => {
      const game = gameRef.current;
      if (game.width <= 0 || game.height <= 0) {
        return;
      }

      game.elapsedTime += delta;
      const difficultyFactor = Math.min(
        MAX_DIFFICULTY_FACTOR,
        1 + game.elapsedTime / 30,
      );
      game.difficultyFactor = difficultyFactor;
      game.backgroundSpeed = BASE_BACKGROUND_SPEED * difficultyFactor;
      game.spawnInterval = Math.max(
        MIN_SPAWN_INTERVAL,
        BASE_SPAWN_INTERVAL / difficultyFactor,
      );

      const level = Math.min(10, 1 + Math.floor(game.elapsedTime / 12));
      if (level !== difficultyLevelRef.current) {
        difficultyLevelRef.current = level;
        setDifficultyLevel(level);
      }

      if (swimRequestRef.current) {
        game.fish.velocity = SWIM_FORCE;
        swimRequestRef.current = false;
      }

      game.fish.velocity += GRAVITY * delta;
      game.fish.y += game.fish.velocity * delta;

      if (game.fish.y < 0) {
        game.fish.y = 0;
        game.fish.velocity = Math.max(0, game.fish.velocity);
      }

      if (game.fish.y + game.fish.height >= game.height) {
        game.fish.y = game.height - game.fish.height;
        endGame();
        return;
      }

      const totalScrollWidth = Math.max(game.width * BACKGROUND_ASSETS.length, game.width);
      game.backgroundOffset += game.backgroundSpeed * delta;
      if (game.backgroundOffset >= totalScrollWidth) {
        game.backgroundOffset -= totalScrollWidth;
      }

      game.spawnTimer += delta;
      while (game.spawnTimer >= game.spawnInterval) {
        spawnObstacle(game);
        game.spawnTimer -= game.spawnInterval;
      }

      for (let index = game.obstacles.length - 1; index >= 0; index -= 1) {
        const obstacle = game.obstacles[index];
        obstacle.x -= (game.backgroundSpeed + obstacle.speed) * delta;

        if (!obstacle.passed && obstacle.x + obstacle.width < game.fish.x) {
          obstacle.passed = true;
          const nextScore = scoreRef.current + 1;
          scoreRef.current = nextScore;
          setScore(nextScore);
        }

        if (checkCollision(game.fish, obstacle)) {
          endGame();
          return;
        }

        if (obstacle.x + obstacle.width < -game.width * 0.15) {
          game.obstacles.splice(index, 1);
        }
      }
    },
    [endGame, spawnObstacle, setDifficultyLevel, setScore],
  );

  const drawGame = useCallback(() => {
    const ctx = contextRef.current;
    const game = gameRef.current;
    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, game.width, game.height);
    drawBackgroundLayers(ctx, game, backgroundImagesRef.current);

    game.obstacles.forEach((obstacle) => {
      const image = obstacleImagesRef.current[obstacle.type.id] ?? null;
      drawObstacleSprite(ctx, obstacle, image);
    });

    drawFishSprite(ctx, game.fish, fishImageRef.current);

    const seabedHeight = Math.max(32, game.height * 0.08);
    const gradient = ctx.createLinearGradient(0, game.height - seabedHeight, 0, game.height);
    gradient.addColorStop(0, "rgba(9, 34, 68, 0)");
    gradient.addColorStop(1, "rgba(9, 34, 68, 0.55)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, game.height - seabedHeight, game.width, seabedHeight);
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = contextRef.current;
    if (!canvas || !container || !ctx) {
      return;
    }

    const maxWidth = Math.min(container.clientWidth, 960);
    const calculatedHeight = maxWidth * 0.56;
    const height = Math.max(320, Math.min(620, calculatedHeight));
    const ratio = window.devicePixelRatio || 1;

    canvas.width = Math.floor(maxWidth * ratio);
    canvas.height = Math.floor(height * ratio);
    canvas.style.width = `${maxWidth}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.imageSmoothingEnabled = true;

    const game = gameRef.current;
    game.width = maxWidth;
    game.height = height;
    const fishHeight = Math.max(48, height * 0.12);
    const fishWidth = fishHeight * 1.35;
    game.fish.width = fishWidth;
    game.fish.height = fishHeight;
    game.fish.x = maxWidth * 0.2;
    game.fish.y = Math.min(game.fish.y, height - fishHeight - 4);
    if (game.fish.y < 0) {
      game.fish.y = 0;
    }
  }, []);

  const restartGame = useCallback(() => {
    const { width, height } = gameRef.current;
    gameRef.current = createGameState(width, height);
    scoreRef.current = 0;
    setScore(0);
    const initialLevel = 1;
    difficultyLevelRef.current = initialLevel;
    setDifficultyLevel(initialLevel);
    setIsGameOver(false);
    isGameOverRef.current = false;
    setIsPaused(false);
    isPausedRef.current = false;
    swimRequestRef.current = false;
    lastTimestampRef.current = performance.now();
    drawGame();
  }, [drawGame, setDifficultyLevel, setScore]);

  const requestSwim = useCallback(() => {
    if (isPausedRef.current || isGameOverRef.current) {
      return;
    }
    swimRequestRef.current = true;
  }, []);

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLCanvasElement>) => {
      event.preventDefault();
      requestSwim();
    },
    [requestSwim],
  );

  const togglePause = useCallback(() => {
    if (isGameOverRef.current) {
      return;
    }

    setIsPaused((prev) => {
      const next = !prev;
      isPausedRef.current = next;
      if (!next) {
        lastTimestampRef.current = performance.now();
      }
      return next;
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space" || event.code === "ArrowUp") {
        event.preventDefault();
        requestSwim();
        return;
      }

      if (event.key === "p" || event.key === "P") {
        event.preventDefault();
        togglePause();
        return;
      }

      if (event.key === "r" || event.key === "R") {
        event.preventDefault();
        restartGame();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [requestSwim, restartGame, togglePause]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) {
      return undefined;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return undefined;
    }

    contextRef.current = context;
    context.imageSmoothingEnabled = true;

    const handleResize = () => {
      resizeCanvas();
      drawGame();
    };

    handleResize();
    restartGame();

    const observer = new ResizeObserver(handleResize);
    observer.observe(container);

    const loop = (timestamp: number) => {
      if (!lastTimestampRef.current) {
        lastTimestampRef.current = timestamp;
      }
      let delta = (timestamp - lastTimestampRef.current) / 1000;
      if (!Number.isFinite(delta) || delta < 0) {
        delta = 0;
      }
      delta = Math.min(delta, 0.05);
      lastTimestampRef.current = timestamp;

      if (!isPausedRef.current && !isGameOverRef.current) {
        updateGame(delta);
      }

      drawGame();
      animationRef.current = window.requestAnimationFrame(loop);
    };

    animationRef.current = window.requestAnimationFrame(loop);

    return () => {
      observer.disconnect();
      if (animationRef.current) {
        window.cancelAnimationFrame(animationRef.current);
      }
    };
  }, [drawGame, resizeCanvas, restartGame, updateGame]);

  return (
    <PageWrapper>
      <Heading>오션 런</Heading>
      <SubHeading>터치·클릭 또는 Space/↑ 키로 물고기를 조종해 장애물을 피해보세요!</SubHeading>
      <CanvasSection ref={containerRef}>
        <GameCanvas
          ref={canvasRef}
          role="img"
          aria-label="Ocean Run 게임 캔버스"
          onPointerDown={handlePointerDown}
          onPointerUp={(event) => event.preventDefault()}
          onPointerLeave={(event) => event.preventDefault()}
          tabIndex={0}
        />
        <CanvasOverlay>
          <ScoreHud role="status" aria-live="polite">
            <ScoreRow>
              <ScoreLabel>점수</ScoreLabel>
              <ScoreValue>{score}</ScoreValue>
            </ScoreRow>
            <ScoreRow>
              <ScoreLabel>최고점</ScoreLabel>
              <ScoreValue>{highScore}</ScoreValue>
            </ScoreRow>
            <DifficultyTag>난이도 Lv.{difficultyLevel}</DifficultyTag>
          </ScoreHud>
          {!isGameOver && isPaused && (
            <CenterMessage>
              <CenterTitle>일시정지</CenterTitle>
              <CenterHint>P 키 또는 버튼으로 다시 시작</CenterHint>
            </CenterMessage>
          )}
          {isGameOver && (
            <ModalBackdrop>
              <ModalCard>
                <ModalTitle>게임 오버</ModalTitle>
                <ModalStats>
                  <span>
                    이번 점수 <strong>{score}</strong>
                  </span>
                  <span>
                    최고 점수 <strong>{highScore}</strong>
                  </span>
                </ModalStats>
                <ModalButton type="button" onClick={restartGame}>
                  다시 도전하기 (R)
                </ModalButton>
              </ModalCard>
            </ModalBackdrop>
          )}
          <FloatingControls>
            <ControlButton type="button" onClick={togglePause} disabled={isGameOver}>
              {isPaused ? "재개 (P)" : "일시정지 (P)"}
            </ControlButton>
            <ControlButton type="button" onClick={restartGame}>
              다시 시작 (R)
            </ControlButton>
          </FloatingControls>
        </CanvasOverlay>
      </CanvasSection>
      <InfoGrid>
        <InfoCard>
          <InfoTitle>조작 방법</InfoTitle>
          <InfoList>
            <InfoItem>
              <Highlight>터치/클릭</Highlight> 또는 <Highlight>Space / ↑</Highlight> : 위로 헤엄치기
            </InfoItem>
            <InfoItem>
              <Highlight>P</Highlight> : 일시정지 / 재개
            </InfoItem>
            <InfoItem>
              <Highlight>R</Highlight> : 즉시 재시작
            </InfoItem>
          </InfoList>
        </InfoCard>
        <InfoCard>
          <InfoTitle>게임 팁</InfoTitle>
          <InfoList>
            <InfoItem>
              시간이 지날수록 <Highlight>속도</Highlight>와 <Highlight>장애물 등장</Highlight>이 빨라져요.
            </InfoItem>
            <InfoItem>
              화면 왼쪽 상단에서 <Highlight>점수</Highlight>와 <Highlight>최고점</Highlight>을 확인해 보세요.
            </InfoItem>
            <InfoItem>
              배경/장애물 이미지는 파일 상단의 <Highlight>url</Highlight> 값을 바꾸면 간편하게 교체할 수 있어요.
            </InfoItem>
          </InfoList>
        </InfoCard>
      </InfoGrid>
    </PageWrapper>
  );
};

const PageWrapper = styled.div`
  min-height: 100vh;
  padding: clamp(1.5rem, 3vw, 3rem) 1.25rem clamp(4rem, 6vw, 6rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(1.5rem, 3vw, 2.75rem);
  background: linear-gradient(
    180deg,
    ${({ theme }) => theme.colors.sky} 0%,
    ${({ theme }) => theme.colors.background} 100%
  );
`;

const Heading = styled.h1`
  font-size: clamp(2rem, 5vw, 3rem);
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
`;

const SubHeading = styled.p`
  margin: 0;
  max-width: 640px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: clamp(1rem, 2.5vw, 1.15rem);
`;

const CanvasSection = styled.div`
  position: relative;
  width: min(960px, 100%);
  border-radius: ${({ theme }) => theme.radii.xl};
  box-shadow: 0 25px 45px rgba(8, 33, 66, 0.25);
  overflow: hidden;
`;

const GameCanvas = styled.canvas`
  display: block;
  width: 100%;
  height: auto;
  background: linear-gradient(180deg, #0a3d62 0%, #13426b 100%);
  cursor: pointer;
  touch-action: none;
  outline: none;

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const CanvasOverlay = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ScoreHud = styled.div`
  pointer-events: none;
  align-self: flex-start;
  margin: clamp(0.75rem, 2vw, 1.5rem);
  padding: clamp(0.75rem, 2vw, 1.2rem) clamp(1rem, 2.5vw, 1.6rem);
  background: rgba(7, 31, 56, 0.6);
  color: #f1fbff;
  border-radius: ${({ theme }) => theme.radii.lg};
  backdrop-filter: blur(6px);
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 160px;
`;

const ScoreRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
`;

const ScoreLabel = styled.span`
  font-size: 0.9rem;
  opacity: 0.85;
`;

const ScoreValue = styled.span`
  font-size: 1.5rem;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

const DifficultyTag = styled.span`
  align-self: flex-start;
  margin-top: 0.25rem;
  font-size: 0.85rem;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  background: rgba(255, 255, 255, 0.12);
  padding: 0.35rem 0.75rem;
  border-radius: ${({ theme }) => theme.radii.full};
`;

const FloatingControls = styled.div`
  pointer-events: auto;
  position: absolute;
  right: clamp(0.75rem, 2vw, 1.5rem);
  bottom: clamp(0.75rem, 2vw, 1.5rem);
  display: flex;
  gap: 0.75rem;
`;

const ControlButton = styled.button`
  border: none;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.onPrimary};
  font-size: 0.95rem;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  padding: 0.55rem 1.15rem;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: transform ${({ theme }) => theme.transitions.base},
    box-shadow ${({ theme }) => theme.transitions.base};

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CenterMessage = styled.div`
  pointer-events: none;
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #ffffff;
  text-align: center;
  background: rgba(6, 20, 36, 0.35);
`;

const CenterTitle = styled.strong`
  font-size: clamp(1.6rem, 4vw, 2.2rem);
`;

const CenterHint = styled.span`
  font-size: 1rem;
  opacity: 0.85;
`;

const ModalBackdrop = styled.div`
  pointer-events: auto;
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(4, 16, 32, 0.45);
`;

const ModalCard = styled.div`
  background: rgba(12, 40, 70, 0.9);
  color: #f1fbff;
  padding: clamp(1.2rem, 4vw, 1.8rem);
  border-radius: ${({ theme }) => theme.radii.xl};
  width: min(320px, 80vw);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 18px 35px rgba(4, 16, 32, 0.35);
  text-align: center;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: clamp(1.4rem, 3vw, 1.8rem);
`;

const ModalStats = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 1rem;
  opacity: 0.95;

  strong {
    font-size: 1.2rem;
  }
`;

const ModalButton = styled.button`
  border: none;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.warning};
  color: ${({ theme }) => theme.colors.onWarning};
  font-size: 1rem;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  padding: 0.65rem 1.35rem;
  cursor: pointer;
  transition: transform ${({ theme }) => theme.transitions.base},
    box-shadow ${({ theme }) => theme.transitions.base};

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }
`;

const InfoGrid = styled.div`
  width: min(960px, 100%);
  display: grid;
  gap: clamp(1rem, 3vw, 1.5rem);
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
`;

const InfoCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.xs};
  padding: clamp(1rem, 3vw, 1.5rem);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const InfoTitle = styled.h2`
  margin: 0;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.text};
`;

const InfoList = styled.ul`
  margin: 0;
  padding-left: 1.1rem;
  display: grid;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.95rem;
`;

const InfoItem = styled.li`
  line-height: 1.5;
`;

const Highlight = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

export default OceanRun;

