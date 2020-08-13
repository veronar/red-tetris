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
    const stub = jest.fn();
    result = renderHook(() => usePlayer(stub)).result;
    act(() => {
      result.current.resetPlayer([{
        shape: [
          ['Z', 'Z', 0],
          [0, 'Z', 'Z'],
          [0, 0, 0],
        ],
        color: '227, 78, 78',
      }], 0);    });
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
      let stub = jest.fn();
      act(() => {
        player.resetPlayer([{
		shape: [
			['Z', 'Z', 0],
			[0, 'Z', 'Z'],
			[0, 0, 0],
		],
		color: '227, 78, 78',
	}], 0);
      });
      let initPlayer = {
        ...player.player,
        tetromino: tetrominosHelper.TETROMINOS["J"].shape,
      };
      act(() => {
        player.playerRotate({}, 1);
      });
      expect(player.player.tetromino).not.toEqual(initPlayer.tetromino);
    });
    it("should not rotate player", () => {
      const { result } = renderHook(() => usePlayer(jest.fn()));
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
      const { result } = renderHook(() => usePlayer(jest.fn()));
      let initPlayer;
      act(() => {
        result.current.resetPlayer([{shape: 'fdf'}], 0);
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

  // describe("test useStage", () => {
  //   it("should do something", () => {
  //     let stub = jest.fn();
  //     const playerStage = renderHook(() => usePlayer(stub)).result;
  //     const { result, rerender } = renderHook(() =>
  //       useStage(
  //         playerStage.current.player,
  //         playerStage.current.resetPlayer,
  //         mockSocket
  //       )
  //     );
  //     const resetPl = jest.spyOn(playerStage.current, "resetPlayer");
  //     playerStage.current.player.pos = { x: 5, y: 2 };
  //     playerStage.current.player.collided = true;
  //     rerender();
  //     expect(resetPl).toHaveBeenCalledTimes(1);
  //   });
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
});
