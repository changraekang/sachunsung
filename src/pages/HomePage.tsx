import styled from "styled-components";
import { Link } from "react-router-dom";
import crab_game_logo from "../assets/images/crab-game-logo.png";
const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 20px;
  min-height: 100vh;
  color: #5d4e37;
  font-family: "Arial", sans-serif;
  position: relative;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 2rem;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  color: #8b7355;
  font-weight: 600;
  position: relative;
  z-index: 1;
`;

const GameGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 800px;
  width: 100%;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
`;

const GameCard = styled(Link)`
  background: rgba(255, 255, 255, 0.7);
  border: 2px solid rgba(139, 115, 85, 0.3);
  border-radius: 20px;
  padding: 2rem;
  text-decoration: none;
  color: #5d4e37;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;

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
  font-size: 1.5rem;
  margin-bottom: 1rem;
  text-align: center;
  color: #8b7355;
  font-weight: 600;
  position: relative;
  z-index: 1;
`;

const GameDescription = styled.p`
  font-size: 1rem;
  text-align: center;
  opacity: 0.8;
  line-height: 1.6;
  color: #6b5b47;
  position: relative;
  z-index: 1;
`;

const HomePage = () => {
  return (
    <HomeContainer>
      <Title>베게네 오락실</Title>
      <img src={crab_game_logo} alt="베게네 오락실" width={300} height={300} />
      <GameGrid>
        <GameCard to="/shisen-sho">
          <GameTitle>🀄 사천성</GameTitle>
          <GameDescription>
            귀여운 베게들과 함께하는
            <br />
            전통 사천성 게임!
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
