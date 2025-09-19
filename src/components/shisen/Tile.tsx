import { forwardRef, memo, useCallback } from "react";
import styled, { css, keyframes } from "styled-components";
import { TILE_IMAGES } from "../../constants/crabImages";
import type { Position, TileValue } from "../../lib/shisen/types";

const shake = keyframes`
  0% { transform: translateX(0); }
  20% { transform: translateX(-4%); }
  40% { transform: translateX(4%); }
  60% { transform: translateX(-3%); }
  80% { transform: translateX(3%); }
  100% { transform: translateX(0); }
`;

const TileButton = styled.button<{
  $isSelected: boolean;
  $isHinted: boolean;
  $isMismatch: boolean;
  $isRemoved: boolean;
  $isFocused: boolean;
}>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  aspect-ratio: 1;
  border: none;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  transition: transform ${({ theme }) => theme.transitions.base},
    background-color ${({ theme }) => theme.transitions.base},
    box-shadow ${({ theme }) => theme.transitions.base},
    color ${({ theme }) => theme.transitions.base},
    opacity ${({ theme }) => theme.transitions.base};
  cursor: pointer;
  user-select: none;
  padding: ${({ theme }) => theme.spacing[2]};
  opacity: ${({ $isRemoved }) => ($isRemoved ? 0 : 1)};
  transform: ${({ $isRemoved }) => ($isRemoved ? "scale(0.8)" : "scale(1)")};
  pointer-events: ${({ $isRemoved }) => ($isRemoved ? "none" : "auto")};
  visibility: ${({ $isRemoved }) => ($isRemoved ? "hidden" : "visible")};
  outline: none;

  ${({ $isHinted, theme }) =>
    $isHinted &&
    css`
      box-shadow: 0 0 0 3px ${theme.colors.hint} inset, ${theme.shadows.sm};
    `}

  ${({ $isSelected, theme }) =>
    $isSelected &&
    css`
      background-color: ${theme.colors.primary};
      color: ${theme.colors.onPrimary};
      box-shadow: 0 0 0 3px ${theme.colors.outline} inset, ${theme.shadows.md};
      transform: scale(1.03);
    `}

  ${({ $isMismatch, theme }) =>
    $isMismatch &&
    css`
      background-color: ${theme.colors.danger};
      color: ${theme.colors.onDanger};
      animation: ${shake} 0.35s ease;
    `}

  ${({ $isFocused, theme }) =>
    $isFocused &&
    css`
      box-shadow: 0 0 0 3px ${theme.colors.outline};
    `}

  &:hover {
    transform: ${({ $isRemoved, theme }) =>
      $isRemoved ? "scale(0.8)" : `translateY(-${theme.spacing[1]})`};
  }

  &:disabled {
    cursor: default;
    opacity: ${({ $isRemoved }) => ($isRemoved ? 0 : 0.65)};
  }
`;

const TileImage = styled.img`
  width: 40px;
  height: 50px;
  object-fit: contain;
  border-radius: ${({ theme }) => theme.radii.md};
`;

interface TileProps {
  value: TileValue;
  position: Position;
  isSelected: boolean;
  isHinted: boolean;
  isMismatch: boolean;
  isFocused: boolean;
  disabled: boolean;
  onSelect(position: Position): void;
}

const getTileImage = (value: number) => TILE_IMAGES[value % TILE_IMAGES.length];

const TileComponent = forwardRef<HTMLButtonElement, TileProps>(
  (
    {
      value,
      position,
      isSelected,
      isHinted,
      isMismatch,
      isFocused,
      disabled,
      onSelect,
    },
    ref
  ) => {
    const handleClick = useCallback(() => {
      if (disabled || value === null) {
        return;
      }
      onSelect(position);
    }, [disabled, onSelect, position, value]);

    const ariaLabel = value === null ? "빈 칸" : `타일 ${value + 1}`;

    return (
      <TileButton
        type="button"
        onClick={handleClick}
        ref={ref}
        disabled={disabled || value === null}
        aria-label={ariaLabel}
        $isSelected={isSelected}
        $isHinted={isHinted}
        $isMismatch={isMismatch}
        $isRemoved={value === null}
        $isFocused={isFocused}
        tabIndex={isFocused && value !== null && !disabled ? 0 : -1}
      >
        {value !== null ? (
          <TileImage src={getTileImage(value)} alt={`베게 ${value + 1}`} />
        ) : null}
      </TileButton>
    );
  }
);

TileComponent.displayName = "Tile";

const Tile = memo(TileComponent);

export default Tile;
