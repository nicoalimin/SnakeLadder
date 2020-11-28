import { createAsyncThunk } from "@reduxjs/toolkit";
import { gameActions, playersActions } from "../reducers/root";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const asyncThunks = {};

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

    const playerIds = Object.keys(thunkApi.getState().players);
    thunkApi.dispatch(gameActions.init({ playerIds }));

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
    await sleep(1000);

    const { playerId, diceValue } = thunkApi.getState().game.currentTurn;
    const playerPosition = thunkApi.getState().game.playersState[playerId]
      .position;
    const to = playerPosition + diceValue;
    thunkApi.dispatch(gameActions.movePlayer({ playerId, to }));
  }
);
