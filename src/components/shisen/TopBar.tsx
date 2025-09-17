import styled, { css } from "styled-components";

interface TopBarProps {
  timeRemaining: number;
  score: number;
  bestScore: number;
  comboCount: number;
  isPaused: boolean;
  disableActions: boolean;
  pauseDisabled: boolean;
  hintPenalty: number;
  shufflePenalty: number;
  onHint(): void;
  onShuffle(): void;
  onPauseToggle(): void;
  onReset(): void;
}

const Container = styled.header`
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.xl};
  box-shadow: ${({ theme }) => theme.shadows.md};
  padding: ${({ theme }) => theme.spacing[3]};
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  box-sizing: border-box;
`;

const StatsGroup = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[0]};
`;

const StatLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const StatValue = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text};
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const ActionButton = styled.button<{ $variant?: "primary" | "accent" | "warning" }>`
  border: none;
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[2]}`};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition:
    transform ${({ theme }) => theme.transitions.base},
    box-shadow ${({ theme }) => theme.transitions.base},
    background-color ${({ theme }) => theme.transitions.base};
  box-shadow: ${({ theme }) => theme.shadows.xs};
  color: ${({ theme }) => theme.colors.onPrimary};
  background: ${({ theme }) => theme.colors.primary};

  ${({ $variant, theme }) =>
    $variant === "accent" &&
    css`
      background: ${theme.colors.accent};
      color: ${theme.colors.text};
    `}

  ${({ $variant, theme }) =>
    $variant === "warning" &&
    css`
      background: ${theme.colors.warning};
      color: ${theme.colors.onWarning};
    `}

  &:hover:not(:disabled) {
    transform: translateY(-${({ theme }) => theme.spacing[1]});
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    box-shadow: none;
  }
`;

const ComboBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 ${({ theme }) => theme.spacing[1]};
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const formatTime = (seconds: number) => {
  const mm = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const ss = Math.max(0, seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${mm}:${ss}`;
};

const TopBar = ({
  timeRemaining,
  score,
  bestScore,
  comboCount,
  isPaused,
  disableActions,
  pauseDisabled,
  hintPenalty,
  shufflePenalty,
  onHint,
  onShuffle,
  onPauseToggle,
  onReset,
}: TopBarProps) => {
  const showCombo = comboCount > 1;

  return (
    <Container>
      <StatsGroup>
        <Stat>
          <StatLabel>남은 시간</StatLabel>
          <StatValue>{formatTime(timeRemaining)}</StatValue>
        </Stat>
        <Stat>
          <StatLabel>점수</StatLabel>
          <StatValue>{score}</StatValue>
        </Stat>
        <Stat>
          <StatLabel>최고 점수</StatLabel>
          <StatValue>{bestScore}</StatValue>
        </Stat>
        {showCombo ? (
          <Stat>
            <StatLabel>콤보</StatLabel>
            <ComboBadge>{comboCount} 연속!</ComboBadge>
          </Stat>
        ) : null}
      </StatsGroup>
      <ButtonGroup>
        <ActionButton
          type="button"
          onClick={onHint}
          disabled={disableActions}
          $variant="warning"
          title={`힌트 사용 시 ${hintPenalty}점 감소`}
        >
          힌트 (-{hintPenalty})
        </ActionButton>
        <ActionButton
          type="button"
          onClick={onShuffle}
          disabled={disableActions}
          $variant="accent"
          title={`셔플 사용 시 ${shufflePenalty}점 감소`}
        >
          셔플 (-{shufflePenalty})
        </ActionButton>
        <ActionButton
          type="button"
          onClick={onPauseToggle}
          $variant="primary"
          disabled={pauseDisabled}
        >
          {isPaused ? "재개" : "일시정지"}
        </ActionButton>
        <ActionButton type="button" onClick={onReset} $variant="accent">
          다시하기
        </ActionButton>
      </ButtonGroup>
    </Container>
  );
};

export default TopBar;
