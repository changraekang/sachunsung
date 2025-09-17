import React, { useState, useEffect } from "react";
import styled from "styled-components";
import questionsData from "../data/questions";
import TotoroLoading from "../components/TotoroLoading";
import { useTheme } from "styled-components";
import fail from "../assets/images/fail.gif";
import success from "../assets/images/success.gif";
const Container = styled.div`
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  max-height: 90vh;
`;
const QuestionText = styled.h2`
  color: ${({ theme }) => theme.colors.text};
`;
const QuestionNumber = styled.div`
  font-size: 1.25rem;
  font-weight: bold;
  background-color: #000;
  color: #fff;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  padding: 0.25rem 1rem;
  display: inline-block;
`;
const HintText = styled.p`
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.2rem;
`;
const QuestionImage = styled.img`
  width: 100%;
  max-height: 300px;
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
  margin-bottom: 1.5rem;
  object-fit: cover;
`;

const Input = styled.input`
  padding: 0.5rem;
  width: 100%;
  font-size: 1rem;
  border-radius: 12px;
  font-family: "Ownglyph_corncorn-Rg", sans-serif;
`;

const Button = styled.button`
  background-color: ${({ theme }) => theme.colors.button};
  color: ${({ theme }) => theme.colors.buttonText};
  border: none;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  font-size: 1.2rem;
  cursor: pointer;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  min-width: 80px;
  &:disabled {
    background-color: #ccc;
    color: white;
    cursor: not-allowed;
  }
`;
const HintButton = styled.button`
  background-color: ${({ theme }) => theme.colors.button};
  color: ${({ theme }) => theme.colors.buttonText};
  border: none;
  width: 140px;
  align-self: center;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 1.4rem;
  font-weight: 600;
`;

const AnswerReveal = styled.div`
  margin-top: 0rem;
`;

const AnswerImage = styled.img`
  width: 100%;
  max-width: 400px;
  border-radius: 12px;
  margin-top: 1rem;
`;

const CircleSVG = styled.svg`
  width: 20px;
  height: 20px;
  margin: 0 2px;
  vertical-align: middle;
`;

const getRandomQuestions = (allQuestions, count) => {
  const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const loadImage = (src) =>
  new Promise((resolve) => {
    const img = new Image();
    img.src = src;
    img.onload = resolve;
    img.onerror = resolve;
  });

const getHintText = (movieTitle, showHint) => {
  const normalizedTitle = movieTitle.normalize("NFC");
  if (normalizedTitle.length > 5 && showHint) {
    let titleArray = Array.from(normalizedTitle);
    if (titleArray.length <= 6) {
      return titleArray.map((char, index) =>
        index < 2 ? (
          char
        ) : (
          <CircleSVG key={index} viewBox="0 0 24 24">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
          </CircleSVG>
        )
      );
    } else if (titleArray.length >= 10) {
      return titleArray.map((char, index) =>
        index < 3 ? (
          char
        ) : (
          <CircleSVG key={index} viewBox="0 0 24 24">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
          </CircleSVG>
        )
      );
    } else {
      return titleArray.map((char, index) =>
        index < 4 ? (
          char
        ) : (
          <CircleSVG key={index} viewBox="0 0 24 24">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
          </CircleSVG>
        )
      );
    }
  } else {
    return Array(normalizedTitle.length)
      .fill(null)
      .map((_, index) => (
        <CircleSVG key={index} viewBox="0 0 24 24">
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
        </CircleSVG>
      ));
  }
};

const QuizPage = ({ onSubmit }) => {
  const quizCount = 6;
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(Array(quizCount).fill(""));
  const [showAnswer, setShowAnswer] = useState(false);
  const [ready, setReady] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const theme = useTheme();
  
  const BulbIcon = () => (
    <svg
      width="36px"
      height="36px"
      viewBox="-5 0 36 36"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <title>bulb</title>
      <desc>Created with Sketch.</desc>
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g transform="translate(0, 0)">
          <rect
            fill="#0C0058"
            fillRule="nonzero"
            x="9"
            y="32"
            width="10"
            height="5"
          />
          <path
            d="M21,25 C19.083,26.186 19,28.742 19,31 L19,32 L9,32 L9,31 C9,28.742 8.882,26.126 7,25 C3.20609078,22.4972208 0.945490024,18.236742 1,13.692 C1.08619278,6.59783885 6.90581136,0.91610047 14,1 C21.0941886,0.91610047 26.9138072,6.59783885 27,13.692 C27.05451,18.236742 24.7939092,22.4972208 21,25 Z"
            fill={theme.colors.button}
            fillRule="nonzero"
          />
          <path
            d="M16,22.633 L16,32 L12,32 L12,22.633 C9.60755934,21.7928697 8.00471171,19.5356595 8,17 L11.6,17 C11.6,18.3254834 12.6745166,19.4 14,19.4 C15.3254834,19.4 16.4,18.3254834 16.4,17 L20,17 C19.9952883,19.5356595 18.3924407,21.7928697 16,22.633 Z"
            fill="#FFFFFF"
            fillRule="nonzero"
          />
        </g>
      </g>
    </svg>
  );
  
  useEffect(() => {
    const selected = getRandomQuestions(questionsData, quizCount);
    setQuestions(selected);

    const preload = selected.flatMap((q) => [
      loadImage(q.quizImage),
      loadImage(q.image),
    ]);

    const delay = new Promise((resolve) => setTimeout(resolve, 500));

    Promise.all([Promise.all(preload), delay]).then(() => {
      setReady(true);
    });
  }, []);

  const handleChange = (e) => {
    const newAnswers = [...answers];
    newAnswers[current] = e.target.value;
    setAnswers(newAnswers);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && answers[current]) {
      handleNext();
    }
  };

  const handleNext = () => {
    window.scrollTo(0, 0); // 화면을 상단으로 스크롤
    if (showAnswer) {
      if (current < quizCount - 1) {
        setCurrent(current + 1);
        setShowAnswer(false);
        setShowHint(false);
      } else {
        let userAnswers = [];
        for (let i = 0; i < answers.length; i++) {
          userAnswers.push({
            question: questions[i].movie,
            answer: answers[i],
          });
        }

        onSubmit(userAnswers);
      }
    } else {
      setShowHint(false);
      setShowAnswer(true);
    }
  };

  const normalize = (str) =>
    str.trim().replace(/\s/g, "").normalize("NFC").toLowerCase();

  if (!ready || questions.length === 0) {
    return (
      <Container>
        <img
          src="https://assets.movie-hop.com/ghibli/ghibli-logo.webp"
          alt="logo"
          height={300}
          width={300}
          style={{ borderRadius: "16%" }}
        />
        <p>문제를 준비 중입니다...⏳</p>
      </Container>
    );
  }

  const currentQ = questions[current];
  const userInput = answers[current];
  const normalizedInput = normalize(userInput);
  const normalizedAnswer = normalize(currentQ.movie);
  const isCorrect = normalizedInput === normalizedAnswer;

  return (
    <Container>
      <TotoroLoading count={current} />        
      <QuestionNumber>
        Q{current + 1}. 이 영화의 제목은? &nbsp;(
        {currentQ.movie.normalize("NFC").length}글자)
      </QuestionNumber>
      <QuestionImage src={currentQ.quizImage} alt="문제 이미지" />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.4rem",
        }}
      >
        {currentQ.movie.normalize("NFC").length > 5 && !showAnswer && (
          <div style={{ flex: 1 }} onClick={() => setShowHint(true)}>
            <BulbIcon />
          </div>
        )}
        {!showAnswer && (
          <HintText
            style={{
              flex: 4,
              textAlign: "center",
              alignItems: "center",
              alignContent: "center",
            }}
          >
            {getHintText(currentQ.movie, showHint)}
          </HintText>
        )}
      </div>
      {!showAnswer && (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Input
            type="text"
            value={userInput}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="정답을 입력하세요"
            autoComplete="off"
            spellCheck="false"
          />
          <Button onClick={handleNext} disabled={!userInput}>
            제출
          </Button>
        </div>
      )}
      {showAnswer && (
        <AnswerReveal>
          <img src={isCorrect ? success : fail} style={{ width: "120px", height: "120px" , borderRadius: "12px"}} alt="정답 이미지" />
          <h3>
            {isCorrect
              ? "정답입니다! 🎉"
              : `오답입니다! 😢 정답: ${currentQ.movie}`}
          </h3>
          <Button onClick={handleNext}>
            {current === quizCount - 1 ? "결과 보기" : "다음 문제"}
          </Button>
        </AnswerReveal>
      )}
    </Container>
  );
};

export default QuizPage;
