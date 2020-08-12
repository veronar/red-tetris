import * as gameHelpers from "../client/helpers/gameHelpers";
import { renderHook, act } from "@testing-library/react-hooks";
import * as tetrominosHelper from "../client/helpers/tetrominos";
import { usePlayer } from "../client/hooks/usePlayer";
import { useStage } from "../client/hooks/useStage";
import { useInterval } from "../client/hooks/useInterval";
import { useGameStatus } from "../client/hooks/useGameStatus";
import { mainSocket } from "../client/helpers/socket";

describe("Testing Tetris hooks", () => {
  const clearStage = Array.from(Array(gameHelpers.STAGE_HEIGHT), () =>
    new Array(gameHelpers.STAGE_WIDTH).fill([0, "clear"])
  );
  let player;
  let stage;
  let gameStatus;
  let results;
  let result;
  let mockSocket = {
    emit: jest.fn(),
  };
  beforeEach(() => {
    result = renderHook(usePlayer).result;
    act(() => {
      result.current.resetPlayer();
    });
    player = result.current;
    result = renderHook(() =>
      useStage(player.player, player.resetPlayer, mainSocket)
    ).result;
    stage = result.current;
    // result = renderHook(() => useGameStatus(stage.rowsCleared));
    // gameStatus = result.current;
  });

  describe("test usePlayer", () => {
    it("should rotate player", () => {
      const { result } = renderHook(usePlayer);
      act(() => {
        result.current.resetPlayer();
      });
      let initPlayer = {
        ...result.current.player,
        tetromino: tetrominosHelper.TETROMINOS["J"].shape,
      };
      act(() => {
        result.current.playerRotate(stage.stage, 1);
      });
      expect(result.current.player.tetromino).not.toEqual(initPlayer.tetromino);
    });
    it("should not rotate player", () => {
      const { result } = renderHook(usePlayer);
      const checkCollisionSpy = jest
        .spyOn(gameHelpers, "checkCollision")
        .mockImplementation(() => {
          return true;
        });
      let initPlayer = { ...result.current.player };
      act(() => {
        result.current.playerRotate(stage.stage, 1);
      });
      expect(checkCollisionSpy).toHaveBeenCalled();
      expect(result.current.player.tetromino).toEqual(initPlayer.tetromino);
    });
    it("should move player", () => {
      const { result } = renderHook(usePlayer);
      let initPlayer;
      act(() => {
        result.current.resetPlayer();
      });
      initPlayer = { ...result.current.player };
      act(() => {
        result.current.updatePlayerPos({ x: 0, y: 0, collided: true });
      });
      initPlayer.pos.x += 0;
      initPlayer.pos.y += 0;
      initPlayer.collided = true;
      expect(initPlayer).toEqual(result.current.player);
    });
  });

  describe("test useStage", () => {
    it("should do something", () => {
      const playerStage = renderHook(usePlayer).result;
      const { result, rerender } = renderHook(() =>
        useStage(
          playerStage.current.player,
          playerStage.current.resetPlayer,
          mockSocket
        )
      );
      const resetPl = jest.spyOn(playerStage.current, "resetPlayer");
      playerStage.current.player.pos = { x: 5, y: 2 };
      playerStage.current.player.collided = true;
      rerender();
      expect(resetPl).toHaveBeenCalledTimes(1);
    });
  });

  describe("test useInterval", () => {
    it("should do something", () => {
      jest.useFakeTimers();
      const stub = jest.fn();
      renderHook(() => useInterval(stub, 1));
      jest.advanceTimersByTime(50);
      expect(stub).toHaveBeenCalled();
    });
  });
});
