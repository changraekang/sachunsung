import React from "react";
import styled from "styled-components";
import kakao_ico from "../assets/images/kakao_ico.png"; // Corrected import statement

const { Kakao } = window;

const KakaoShareButton = ({ correctCount, questions }) => {
  const url = "https://ghibli.movie-hop.com";
  const resultUrl = window.location.href;
  React.useEffect(() => {
    try {
      if (!Kakao.isInitialized()) {
        Kakao.init("4056626004790c74276d8fbe866ad653");
        Kakao.isInitialized();
        console.log("Kakao is initialized");
      } else {
        console.log("Kakao is already initialized");
      }
    } catch (error) {
      console.log("Kakao is not initialized");
      console.error(error);
    }
  }, []);
  const description = correctCount + " / " + questions;
  const shareKakao = () => {
    Kakao.Link.sendDefault({
      objectType: "feed",
      content: {
        title: "지브리풍 영화퀴즈",
        description: description,
        imageUrl: `https://assets.movie-hop.com/ghibli/ghibli-logo.webp`,
        link: {
          mobileWebUrl: resultUrl,
          webUrl: resultUrl,
        },
      },
      buttons: [
        {
          title: "나도 퀴즈풀러가기",
          link: {
            mobileWebUrl: url,
            webUrl: url,
          },
        },
      ],
    });
  };

  return (
    <>
      <Button onClick={shareKakao}>
        공유하기 <img src={kakao_ico} alt="kakao_ico" width={30} height={35} />{" "}
      </Button>
    </>
  );
};

export default KakaoShareButton;
const Button = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: center;
  padding: 10px;
  padding-left: 25px;
  padding-right: 25px;
  border-radius: 25px; // 패딩을 70%로 조정
  color: #3a1c1c;
  font-size: 1rem; // 폰트 크기를 70%로 조정
  background-color: #fae301;
  cursor: pointer;
  word-break: keep-all;
  // 여백을 70%로 조정
  font-family: "DoHyeon-Regular";
`;
