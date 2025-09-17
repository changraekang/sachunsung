import React, { useState, useEffect } from "react";
import styled from "styled-components";
import KakaoShareButton from "../components/KakaoShareButton";
import YoutubeEmbed from "../components/YoutubeEmbed";
const Wrapper = styled.div`
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
`;

const Score = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const Summary = styled.div`
  text-align: left;
  margin-top: 2rem;
`;

const Answer = styled.div`
  margin-bottom: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  background-color: #fdfdfd;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const AnswerImage = styled.img`
  width: 100%;
  max-width: 150px;
  border-radius: 12px;
  margin-top: 0.5rem;
  object-fit: contain;
  background-color: red;
`;

const normalize = (str) =>
  str.trim().replace(/\s/g, "").normalize("NFC").toLowerCase();

const ResultPage = ({ answers }) => {
  const correctCount = answers.reduce((acc, { question, answer }) => {
    if (question == null || answer == null) {
      return acc;
    }
    const normalizedQuestion = normalize(question);
    const normalizedAnswer = normalize(answer);
    console.log(`Normalized Question: ${normalizedQuestion}`);
    console.log(`Normalized Answer: ${normalizedAnswer}`);
    const isCorrect = normalizedQuestion === normalizedAnswer;
    console.log(`Is Correct: ${isCorrect}`);
    return acc + (isCorrect ? 1 : 0);
  }, 0);

  return (
    <Wrapper>
      <h1>🎉 퀴즈 완료!</h1>
      <Score>
        당신의 점수는 {correctCount} / {answers.length} 입니다.
      </Score>
      <KakaoShareButton
        correctCount={correctCount}
        questions={answers.length}
      />

      <Score>개발자 유튜브 채널 구독 부탁드립니다.</Score>
      <YoutubeEmbed />
      <Summary>
        {answers.map((q, i) => {
          const isCorrect =
            normalize(answers[i].answer) === normalize(q.question);
          return (
            <Answer key={i}>
              <div style={{ alignSelf: "center" }}>
                <strong>Q{i + 1}.</strong> <br />
                당신의 답변: {answers[i].answer || "(미입력)"}
                <br />
                정답: {q.question}
                <br />
                결과: {isCorrect ? "⭕ 정답" : "❌ 오답"}
              </div>
              <div style={{ paddingLeft: "1rem" }}>
                <AnswerImage
                  src={`https://assets.movie-hop.com/ghibli/ghibli_${q.question}.webp`}
                  alt="문제 이미지"
                />
              </div>
            </Answer>
          );
        })}
      </Summary>
    </Wrapper>
  );
};

export default ResultPage;
