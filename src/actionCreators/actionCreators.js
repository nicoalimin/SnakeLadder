import { createAsyncThunk } from "@reduxjs/toolkit";
import { gameActions, playersActions } from "../reducers/root";
import { sleep } from "../utils/sleep";
const random = require("random"); // Need to replace this eventually.

export const macroActions = {};

const SIMULATION_DELAY_TIME = 1000;

/** For testing and demo purpose. To Be Deleted. */
macroActions.simulateAGame = createAsyncThunk(
  "simulateAGame",
  async (_, thunkApi) => {
    thunkApi.dispatch(
      playersActions.add({
        name: "Michael",
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      })
    );
    thunkApi.dispatch(
      gameActions.addPlayerToGame({
        playerId: Object.values(thunkApi.getState().players).find(
          (player) => player.name === "Michael"
        ).id,
      })
    );
    await sleep(SIMULATION_DELAY_TIME);

    thunkApi.dispatch(
      playersActions.add({
        name: "Najla",
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      })
    );
    thunkApi.dispatch(
      gameActions.addPlayerToGame({
        playerId: Object.values(thunkApi.getState().players).find(
          (player) => player.name === "Najla"
        ).id,
      })
    );
    await sleep(SIMULATION_DELAY_TIME);

    thunkApi.dispatch(
      playersActions.add({
        name: "Nezika",
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      })
    );
    thunkApi.dispatch(
      gameActions.addPlayerToGame({
        playerId: Object.values(thunkApi.getState().players).find(
          (player) => player.name === "Nezika"
        ).id,
      })
    );
    await sleep(SIMULATION_DELAY_TIME);

    thunkApi.dispatch(
      playersActions.add({
        name: "Jessica",
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      })
    );
    await sleep(SIMULATION_DELAY_TIME);

    thunkApi.dispatch(
      playersActions.add({
        name: "Winny",
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      })
    );
    await sleep(SIMULATION_DELAY_TIME);

    thunkApi.dispatch(
      playersActions.add({
        name: "Jennifer",
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      })
    );
    await sleep(SIMULATION_DELAY_TIME);

    thunkApi.dispatch(
      playersActions.add({
        name: "Kynan",
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      })
    );
    await sleep(SIMULATION_DELAY_TIME);

    // Load the players and initialize the game.
    const playerIds = Object.keys(thunkApi.getState().players);
    thunkApi.dispatch(gameActions.init({ playerIds }));
    await sleep(SIMULATION_DELAY_TIME);

    // Simulate a game.
    thunkApi.dispatch(gameActions.start());
    await sleep(SIMULATION_DELAY_TIME);

    // await thunkApi.dispatch(macroActions.executeATurn());
    // await sleep(SIMULATION_DELAY_TIME);
    // thunkApi.dispatch(gameActions.nextTurn());

    // await thunkApi.dispatch(macroActions.executeATurn());
    // await sleep(SIMULATION_DELAY_TIME);
    // thunkApi.dispatch(gameActions.nextTurn());

    // await thunkApi.dispatch(macroActions.executeATurn());
    // await sleep(SIMULATION_DELAY_TIME);
    // thunkApi.dispatch(gameActions.nextTurn());

    // await thunkApi.dispatch(macroActions.executeATurn());
    // await sleep(SIMULATION_DELAY_TIME);
    // thunkApi.dispatch(gameActions.nextTurn());

    // await thunkApi.dispatch(macroActions.executeATurn());
    // await sleep(SIMULATION_DELAY_TIME);
    // thunkApi.dispatch(gameActions.nextTurn());
  }
);

/** A thunk that automatically executes a turn. */
macroActions.executeATurn = createAsyncThunk(
  "executeATurn",
  async (_, thunkApi) => {
    // Roll Dice
    thunkApi.dispatch(gameActions.rollDice());
    await sleep(2000);

    const { playerId, diceValue } = thunkApi.getState().game.currentTurn;
    const playerPosition = thunkApi.getState().game.playersState[playerId]
      .position;

    // Move to target one step at a time.
    const to = playerPosition + diceValue;
    for (let i = playerPosition + 1; i <= to; i++) {
      thunkApi.dispatch(gameActions.movePlayer({ playerId, to: i }));
      await sleep(500);
    }

    const portals = [
      ...thunkApi.getState().board.ladders,
      ...thunkApi.getState().board.snakes,
    ];

    const portal =portals.find((portal) => portal.from === to);

    if (portal) {
      thunkApi.dispatch(gameActions.movePlayer({ playerId, to: portal.to }));
    }

    // Get prompt card.
    const numTiles = Math.pow(thunkApi.getState().board.dimensionSize, 2);
    let promptNumber;
    do {
      promptNumber = to + Math.floor(random.normal(to, numTiles / 2)());
    } while (promptNumber < 1 || numTiles < promptNumber);

    thunkApi.dispatch(gameActions.setPromptNumber({ promptNumber }));
  }
);

macroActions.addAndRegisterPlayer = (player) => (dispatch, getState) => {
  dispatch(playersActions.add(player));
  dispatch(
    gameActions.addPlayerToGame({
      playerId: Object.values(getState().players).find(
        (p) => p.name === player.name
      ).id,
    })
  );
};

macroActions.startNewGame = () => (dispatch, getState) => {
  const playerIds = Object.keys(getState().players);
  dispatch(gameActions.init({ playerIds }));
  dispatch(gameActions.start());
};
