import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import {
  AXIS_LETTER_MAP,
  AXIS_ORDER,
  SLEEP_QUESTIONS,
  SLEEP_RESULT_TYPES,
  SleepLetter,
  SleepResultType,
} from "../constants/sleepTestData";
import SleepKakaoShareButton from "../components/SleepKakaoShareButton";

type Stage = "intro" | "quiz" | "result";

const INITIAL_SCORES: Record<SleepLetter, number> = {
  F: 0,
  L: 0,
  M: 0,
  Q: 0,
  S: 0,
  D: 0,
  C: 0,
  N: 0,
};

const SleepTest = () => {
  const [stage, setStage] = useState<Stage>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scores, setScores] = useState<Record<SleepLetter, number>>({
    ...INITIAL_SCORES,
  });
  const [result, setResult] = useState<SleepResultType | null>(null);

  const totalQuestions = SLEEP_QUESTIONS.length;
  const currentQuestion = SLEEP_QUESTIONS[currentIndex];

  const progressPercent = useMemo(() => {
    if (stage !== "quiz") {
      return 0;
    }

    return Math.min((currentIndex / totalQuestions) * 100, 100);
  }, [currentIndex, stage, totalQuestions]);

  const handleStart = () => {
    setStage("quiz");
    setCurrentIndex(0);
    setScores({ ...INITIAL_SCORES });
    setResult(null);
  };

  const handleRestart = () => {
    setStage("intro");
    setCurrentIndex(0);
    setScores({ ...INITIAL_SCORES });
    setResult(null);
  };

  const handleAnswer = (isYes: boolean) => {
    if (!currentQuestion) {
      return;
    }

    const axisLetters = AXIS_LETTER_MAP[currentQuestion.axis];
    const yesLetter = currentQuestion.yes;
    const noLetter =
      axisLetters[0] === yesLetter ? axisLetters[1] : axisLetters[0];
    const selectedLetter = isYes ? yesLetter : noLetter;

    const updatedScores = {
      ...scores,
      [selectedLetter]: scores[selectedLetter] + 1,
    };

    const isLastQuestion = currentIndex + 1 === totalQuestions;

    if (isLastQuestion) {
      const finalResult = determineResult(updatedScores);
      setScores(updatedScores);
      setResult(finalResult);
      setStage("result");
    } else {
      setScores(updatedScores);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  return (
    <PageWrapper>
      <Content>
        {stage === "intro" && (
          <IntroCard>
            <img
              src={"https://assets.sparkling-rae.com/crab-game/sleep-crab.png"}
              width={300}
              height={300}
              alt="내 수면타입 알아보게"
            />
            <IntroTitle>내 수면타입 알아보게</IntroTitle>
            <StartButton type="button" onClick={handleStart}>
              시작하기
            </StartButton>
          </IntroCard>
        )}

        {stage === "quiz" && currentQuestion && (
          <QuizCard>
            <ProgressBarWrapper>
              <ProgressLabel>
                {currentIndex + 1} / {totalQuestions}
              </ProgressLabel>
              <ProgressBar>
                <ProgressFill $percent={progressPercent} />
              </ProgressBar>
            </ProgressBarWrapper>
            <QuestionHeading>
              Q{currentQuestion.id}. {currentQuestion.text}
            </QuestionHeading>
            <OptionGroup>
              <OptionButton type="button" onClick={() => handleAnswer(true)}>
                예
              </OptionButton>
              <OptionButton
                type="button"
                $variant="outline"
                onClick={() => handleAnswer(false)}
              >
                아니오
              </OptionButton>
            </OptionGroup>
          </QuizCard>
        )}

        {stage === "result" && result && (
          <ResultCard>
            <CodeBadge>{result.code}</CodeBadge>
            <CharacterArt>
              {result.image ? (
                <CharacterImage
                  src={result.image}
                  alt={`${result.name} 캐릭터`}
                  loading="lazy"
                />
              ) : null}
            </CharacterArt>
            <ResultName>{result.name}</ResultName>
            <ResultDescription>{result.desc}</ResultDescription>
            <TipSection>
              <TipLabel>추천 수면 팁</TipLabel>
              <TipText>{result.tip}</TipText>
            </TipSection>
            <ResultActions>
              <PrimaryAction type="button" onClick={handleRestart}>
                다시하기
              </PrimaryAction>
              <HomeAction to="/">홈으로</HomeAction>
            </ResultActions>
            <SleepKakaoShareButton sleepResult={result} />
          </ResultCard>
        )}
      </Content>
    </PageWrapper>
  );
};

const determineResult = (
  score: Record<SleepLetter, number>
): SleepResultType => {
  const code = AXIS_ORDER.map((axis) => {
    const [first, second] = AXIS_LETTER_MAP[axis];
    return score[first] >= score[second] ? first : second;
  }).join("");

  const found = SLEEP_RESULT_TYPES.find((type) => type.code === code);

  if (found) {
    return found;
  }

  return {
    code,
    name: `${code} 게`,
    desc: "아직 준비 중인 타입이에요! 곧 새로운 게 친구를 소개할게요.",
    tip: "편안한 루틴을 기록하며 나만의 수면 습관을 만들어보세요.",
    image: "",
  };
};

const PageWrapper = styled.div`
  min-height: 100vh;
  padding: clamp(2rem, 5vw, 4rem) clamp(1rem, 6vw, 3rem);
  width: 400px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

const Content = styled.main`
  width: min(100%, 720px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(2rem, 4vw, 3rem);
`;

const CardBase = styled.section`
  width: 100%;
  background: rgba(255, 255, 255, 0.92);
  border: 2px solid rgba(143, 177, 143, 0.25);
  border-radius: 32px;
  box-shadow: 0 24px 60px rgba(143, 177, 143, 0.18);
  padding: clamp(1.75rem, 4vw, 3rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: clamp(1.5rem, 3vw, 2.25rem);
`;

const IntroCard = styled(CardBase)`
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(247, 251, 243, 0.95) 100%
  );
`;

const IntroTitle = styled.h1`
  margin: 0;
  font-size: clamp(2rem, 4vw, 2.75rem);
  color: #5b6c46;
`;

const IntroDescription = styled.p`
  margin: 0;
  max-width: 32rem;
  font-size: clamp(1rem, 2.6vw, 1.2rem);
  line-height: 1.6;
  color: #6f7c5d;
`;

const StartButton = styled.button`
  border: none;
  border-radius: 999px;
  padding: 0.85rem 2.4rem;
  font-size: 1.05rem;
  font-weight: 600;
  background: linear-gradient(135deg, #a2c6a8 0%, #8fb1f2 100%);
  color: #ffffff;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover,
  &:focus-visible {
    transform: translateY(-2px);
    box-shadow: 0 12px 30px rgba(143, 177, 143, 0.25);
  }
`;

const QuizCard = styled(CardBase)`
  align-items: stretch;
  text-align: left;
  width: 400px;
  gap: clamp(1.5rem, 3vw, 2rem);
`;

const ProgressBarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ProgressLabel = styled.span`
  align-self: flex-end;
  font-size: 0.95rem;
  color: #7c8c69;
  letter-spacing: 0.02em;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 12px;
  background: rgba(175, 193, 171, 0.25);
  border-radius: 999px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $percent: number }>`
  height: 100%;
  width: ${({ $percent }) => $percent}%;
  background: linear-gradient(135deg, #88c6c4 0%, #a3c7f0 100%);
  border-radius: 999px;
  transition: width 0.35s ease;
`;

const QuestionHeading = styled.h2`
  margin: 0;
  font-size: clamp(1.3rem, 3.2vw, 1.65rem);
  color: #50614d;
  line-height: 1.5;
`;

const OptionGroup = styled.div`
  display: grid;
  gap: 0.85rem;

  @media (min-width: 520px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const OptionButton = styled.button<{ $variant?: "outline" }>`
  border-radius: 20px;
  padding: 1rem 1.25rem;
  font-size: 1.05rem;
  font-weight: 600;
  border: ${({ $variant }) =>
    $variant === "outline" ? "2px solid #9ab6c0" : "none"};
  background: ${({ $variant }) =>
    $variant === "outline"
      ? "#ffffff"
      : "linear-gradient(135deg, #9bd0b4 0%, #84b7f0 100%)"};
  color: ${({ $variant }) => ($variant === "outline" ? "#5c708d" : "#ffffff")};
  box-shadow: ${({ $variant }) =>
    $variant === "outline"
      ? "0 6px 16px rgba(154, 182, 192, 0.18)"
      : "0 12px 28px rgba(124, 176, 185, 0.3)"};
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover,
  &:focus-visible {
    transform: translateY(-2px);
    box-shadow: ${({ $variant }) =>
      $variant === "outline"
        ? "0 10px 24px rgba(154, 182, 192, 0.2)"
        : "0 16px 32px rgba(124, 176, 185, 0.32)"};
  }
`;

const ResultCard = styled(CardBase)`
  gap: clamp(1.25rem, 3vw, 1.75rem);
`;

const CodeBadge = styled.div`
  padding: 0.35rem 1.4rem;
  border-radius: 999px;
  background: rgba(136, 198, 196, 0.28);
  color: #517579;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.2em;
`;

const CharacterArt = styled.div`
  position: relative;
  width: clamp(160px, 40vw, 200px);
  height: clamp(160px, 40vw, 200px);
  border-radius: 36px;
  background: linear-gradient(
    180deg,
    rgba(246, 255, 243, 0.9) 0%,
    rgba(211, 235, 255, 0.9) 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: inset 0 0 0 6px rgba(255, 255, 255, 0.55),
    0 20px 45px rgba(124, 161, 194, 0.25);
`;

const CharacterImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  inset: 0;
`;

const CharacterEmoji = styled.span`
  font-size: clamp(4rem, 8vw, 5rem);
  z-index: 1;
`;

const ResultName = styled.h3`
  margin: 0;
  font-size: clamp(1.6rem, 3.4vw, 2rem);
  color: #50614d;
`;

const ResultDescription = styled.p`
  margin: 0;
  font-size: clamp(1rem, 2.5vw, 1.1rem);
  color: #5f6f57;
  line-height: 1.7;
`;

const TipSection = styled.div`
  width: 100%;
  background: rgba(241, 248, 235, 0.85);
  border-radius: 24px;
  padding: 1.1rem 1.4rem;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
`;

const TipLabel = styled.span`
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: #7c8c69;
  text-transform: uppercase;
`;

const TipText = styled.p`
  margin: 0;
  font-size: 1rem;
  color: #50614d;
  line-height: 1.6;
`;

const ResultActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  @media (min-width: 520px) {
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
`;

const PrimaryAction = styled.button`
  border: none;
  border-radius: 999px;
  padding: 0.85rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  background: linear-gradient(135deg, #8fd0b6 0%, #8aa9f5 100%);
  color: #ffffff;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover,
  &:focus-visible {
    transform: translateY(-2px);
    box-shadow: 0 12px 28px rgba(138, 169, 245, 0.3);
  }
`;

const HomeAction = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 0.85rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  color: #6a7d98;
  background: #ffffff;
  border: 2px solid rgba(139, 158, 191, 0.35);
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover,
  &:focus-visible {
    transform: translateY(-2px);
    box-shadow: 0 12px 26px rgba(139, 158, 191, 0.25);
  }
`;

export default SleepTest;
