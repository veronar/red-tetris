import * as gameHelpers from "../client/helpers/gameHelpers";
import * as tetrominos from "../client/helpers/tetrominos";

describe("gamehelpers", () => {
  const clearStage = Array.from(Array(gameHelpers.STAGE_HEIGHT), () =>
    new Array(gameHelpers.STAGE_WIDTH).fill([0, "clear"])
  );
  let player = {
    pos: { x: 0, y: 0 },
    tetromino: tetrominos.TETROMINOS["J"].shape,
    collided: false,
  };
  it("Makes Stage", () => {
    const stage = gameHelpers.createStage();
    expect(stage).toEqual(clearStage);
  });
  it("Generates Random shape", () => {
    const randomShape = tetrominos.randomTetromino();
    let result = false;
    Object.entries(tetrominos.TETROMINOS).map(([key, value]) => {
      if (randomShape === value) {
        result = true;
      }
    });
    expect(result).toBeTruthy();
  });
  it("tests collision", () => {
    expect(
      gameHelpers.checkCollision(player, clearStage, { x: 0, y: 1 })
    ).toBeFalsy();
    expect(
      gameHelpers.checkCollision(player, clearStage, { x: 0, y: 20 })
    ).toBeTruthy();
  });
});
