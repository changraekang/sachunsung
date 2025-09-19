import styled from "styled-components";
import { Link } from "react-router-dom";
import crab_game_logo from "../assets/images/crab-game-logo.png";
import { TILE_IMAGES } from "../constants/crabImages";
const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 20px 16px;
  min-height: 100vh;
  color: #5d4e37;
  font-family: "Arial", sans-serif;
  position: relative;
  box-sizing: border-box;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  color: #8b7355;
  font-weight: 600;
  position: relative;
  z-index: 1;

  @media (min-width: 768px) {
    font-size: 3rem;
    margin-bottom: 2rem;
  }
`;

const GameGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  max-width: 800px;
  width: 100%;
  position: relative;
  align-items: center;
  z-index: 1;

  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    padding: 0 2rem;
  }
`;

const GameCard = styled(Link)`
  background: rgba(255, 255, 255, 0.7);
  border: 2px solid rgba(139, 115, 85, 0.3);
  border-radius: 20px;
  padding: 1.5rem;
  text-decoration: none;
  color: #5d4e37;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (min-width: 768px) {
    padding: 2rem;
  }

  &::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    transform: rotate(45deg);
    transition: all 0.6s ease;
    opacity: 0;
  }

  &:hover {
    transform: translateY(-8px) scale(1.02);
    background: rgba(255, 255, 255, 0.9);
    border-color: rgba(139, 115, 85, 0.5);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);

    &::before {
      opacity: 1;
      transform: rotate(45deg) translate(50%, 50%);
    }
  }
`;

const GameTitle = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 0.8rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8b7355;
  font-weight: 600;
  position: relative;
  z-index: 1;

  @media (min-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
`;

const GameDescription = styled.p`
  font-size: 0.9rem;
  text-align: center;
  opacity: 0.8;
  line-height: 1.6;
  color: #6b5b47;
  position: relative;
  z-index: 1;

  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

const LogoImage = styled.img`
  width: 200px;
  height: 200px;
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    width: 300px;
    height: 300px;
    margin-bottom: 2rem;
  }
`;

const HomePage = () => {
  return (
    <HomeContainer>
      <Title>베게네 오락실</Title>
      <LogoImage src={crab_game_logo} alt="베게네 오락실" />
      <GameGrid>
        <GameCard to="/shisen-sho">
          <GameTitle>
            <img
              src={
                "https://assets.sparkling-rae.com/crab-game/crab-shisen-sho.webp"
              }
              width={72}
              height={72}
              alt="사천성"
            />
            사천성
          </GameTitle>
          <GameDescription>
            귀여운 베게들과 함께하는
            <br />
            전통 사천성 게임!
          </GameDescription>
        </GameCard>

        <GameCard to="/crab-memory">
          <GameTitle>
            <img
              src={TILE_IMAGES[0]}
              width={72}
              height={72}
              alt="크랩 메모리"
            />
            크랩 메모리
          </GameTitle>
          <GameDescription>
            짝을 맞추며 기억력을 테스트!
            <br />
            다양한 난이도와 타이머에 도전하세요.
          </GameDescription>
        </GameCard>

        <GameCard to="/coming-soon">
          <GameTitle>🎯 새로운 게임</GameTitle>
          <GameDescription>
            더 많은 베게들과 함께할
            <br />
            재미있는 게임들이 곧 출시됩니다!
          </GameDescription>
        </GameCard>
      </GameGrid>
    </HomeContainer>
  );
};

export default HomePage;
