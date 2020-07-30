import * as gameHelpers from "../client/helpers/gameHelpers";
import { renderHook, act } from "@testing-library/react-hooks";
import * as tetrominos from "../client/helpers/tetrominos";
import { usePlayer } from "../client/hooks/usePlayer";
import { useStage } from "../client/hooks/useStage";
import { useInterval } from "../client/hooks/useInterval";
import { useGameStatus } from "../client/hooks/useGameStatus";


describe("Testing Tetris hooks", () => {
  const clearStage = Array.from(Array(gameHelpers.STAGE_HEIGHT), () =>
    new Array(gameHelpers.STAGE_WIDTH).fill([0, "clear"])
  );
  let player;
  let stage;
  let gameStatus;
  let results;
  let result;
  beforeEach(() => {
    result = renderHook(usePlayer).result;
    act(() => {
      result.current.resetPlayer();
    });
    player = result.current;
    result = renderHook(() => useStage(player.player, player.resetPlayer))
      .result;
    stage = result.current;
    // result = renderHook(() => useGameStatus(stage.rowsCleared));
    // gameStatus = result.current;
  });

  describe("test usePlayer", () => {
    it("should rotate player", () => {
      const { result } = renderHook(usePlayer);

      const checkCollisionSpy = jest
        .spyOn(tetrominos, "randomTetromino")
        .mockImplementation(() => {
          return tetrominos.TETROMINOS["J"];
        });
      act(() => {
        result.current.resetPlayer();
      });
      let initPlayer = { ...result.current.player };
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
        useStage(playerStage.current.player, playerStage.current.resetPlayer)
      );
      const resetPl = jest.spyOn(playerStage.current, "resetPlayer");
      playerStage.current.player.pos = { x: 5, y: 2 };
      playerStage.current.player.collided = true;
      rerender();
      expect(resetPl).toHaveBeenCalledTimes(1);
    });
  });
  // describe("test useGameStatus", () => {
  // 	it("should do something", () => {
  // 		let rowsCleared = 0;
  // 		const {result, rerender} = renderHook(() => useGameStatus(), {initialProps: {rowsCleared: 3}});
  // 		console.log(result.current)
  // 		act(() => {
  // 			// result.current.setLevel(1);
  // 			// result.current.setScore(40);
  // 			rowsCleared = 1;
  // 			rerender();

  // 			// rerender()
  // 		})
  // 		console.log(result.current)
  // 	});
  // });

  describe("test useInterval", () => {
    it("should do something", () => {
      jest.useFakeTimers();
      const stub = jest.fn();
      renderHook(() => useInterval(stub, 1));
      jest.advanceTimersByTime(50);
      expect(stub).toHaveBeenCalled();
    });
  });
  

//   jest.mock("usePlayer", () => ({
// 	usePlayer: jest.fn().mockImplementation(() => ({
// 		player: player,
// 		updatePlayerPos: mockUpdatePlayerPos,
// 		resetPlayer: mockResetPlayer,
// 		playerRotate: mockPlayerRotate,
// 	})),
//   }));
});
