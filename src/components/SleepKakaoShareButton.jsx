import React from "react";
import styled from "styled-components";
import kakao_ico from "../assets/images/kakao_ico.png"; // Corrected import statement

const { Kakao } = window;

const SleepKakaoShareButton = ({ sleepResult }) => {
  const url = "https://crab-game.sparkling-rae.com/sleep-test";
  const resultUrl = window.location.href;
  React.useEffect(() => {
    try {
      if (!Kakao.isInitialized()) {
        Kakao.init("c26d1dfad60d03492f69054ba08132b1");
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
  const description = sleepResult.name + " / " + sleepResult.desc;
  const shareKakao = () => {
    Kakao.Link.sendDefault({
      objectType: "feed",
      content: {
        title: "내 수면타입 알아보게",
        description: description,
        imageUrl: sleepResult.image,
        link: {
          mobileWebUrl: resultUrl,
          webUrl: resultUrl,
        },
      },
      buttons: [
        {
          title: "내 수면타입 알아보게 놀러가기",
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

export default SleepKakaoShareButton;
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
