import { createAsyncThunk } from "@reduxjs/toolkit";
import { gameActions, playersActions } from "../reducers/root";
import { sleep } from "../utils/sleep";

export const asyncThunks = {};

/** For testing and demo purpose. To Be Deleted. */
asyncThunks.simulateAGame = createAsyncThunk(
  "simulateAGame",
  async (_, thunkApi) => {
    thunkApi.dispatch(playersActions.add({ name: "Michael" }));
    thunkApi.dispatch(playersActions.add({ name: "Najla" }));
    thunkApi.dispatch(playersActions.add({ name: "Nezika" }));
    thunkApi.dispatch(playersActions.add({ name: "Jessica" }));
    thunkApi.dispatch(playersActions.add({ name: "Winny" }));
    thunkApi.dispatch(playersActions.add({ name: "Jennifer" }));
    thunkApi.dispatch(playersActions.add({ name: "Kynan" }));

    // Load the players and initialize the game.
    const playerIds = Object.keys(thunkApi.getState().players);
    thunkApi.dispatch(gameActions.init({ playerIds }));

    // Simulate a game.
    await thunkApi.dispatch(asyncThunks.executeATurn());
    thunkApi.dispatch(gameActions.nextTurn());

    await thunkApi.dispatch(asyncThunks.executeATurn());
    thunkApi.dispatch(gameActions.nextTurn());

    await thunkApi.dispatch(asyncThunks.executeATurn());
    thunkApi.dispatch(gameActions.nextTurn());

    await thunkApi.dispatch(asyncThunks.executeATurn());
    thunkApi.dispatch(gameActions.nextTurn());

    await thunkApi.dispatch(asyncThunks.executeATurn());
    thunkApi.dispatch(gameActions.nextTurn());
  }
);

/** A thunk that automatically executes a turn. */
asyncThunks.executeATurn = createAsyncThunk(
  "executeATurn",
  async (_, thunkApi) => {
    thunkApi.dispatch(gameActions.rollDice());
    await sleep(2000);

    const { playerId, diceValue } = thunkApi.getState().game.currentTurn;
    const playerPosition = thunkApi.getState().game.playersState[playerId]
      .position;
    const to = playerPosition + diceValue;
    thunkApi.dispatch(gameActions.movePlayer({ playerId, to }));
  }
);
