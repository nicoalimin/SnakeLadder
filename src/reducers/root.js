import { createAction, createReducer } from "@reduxjs/toolkit";
import { generateId } from "../utils/generateId";

// ----- Players ------
export const playersActions = {
  add: createAction("players/add"),
  delete: createAction("players/delete"),
};

export const gameActions = {
  init: createAction("game/init"),
  start: createAction("game/start"),
  rollDice: createAction("game/rollDice"),
  movePlayer: createAction("game/movePlayer"),
  nextTurn: createAction("game/nextTurn"),
};

export const playersReducer = createReducer({}, (builder) => {
  builder
    .addCase(playersActions.add, (state, { payload }) => {
      const newId = `player-${generateId()}`;
      state[newId] = {
        ...payload,
        id: newId,
      };
    })
    .addCase(playersActions.delete, (state, { payload }) => {
      delete state[payload.id];
    });
});

// -------- Games ----
const GAME_STATE = {
  NOT_STARTED: "NOT_STARTED",
  IN_PROGRESS: "IN_PROGRESS",
  DONE: "DONE",
};

export const gameReducer = createReducer(
  {
    state: GAME_STATE.NOT_STARTED,
    currentTurn: {
      playerId: undefined,
      diceValue: undefined,
    },
    playersState: {},
  },
  (builder) => {
    builder
      .addCase(gameActions.init, (state, { payload: { playerIds } }) => {
        state.state = GAME_STATE.NOT_STARTED;

        state.currentTurn.playerId = playerIds?.[0];
        state.currentTurn.diceValue = undefined;

        // Resets All players to tile 1.
        state.playersState = playerIds.reduce((acc, id) => {
          acc[id] = { position: 1 };
          return acc;
        }, {});
      })
      .addCase(gameActions.start, (state) => {
        state.state = GAME_STATE.IN_PROGRESS;
      })
      .addCase(gameActions.rollDice, (state) => {
        state.currentTurn.diceValue = Math.ceil(Math.random() * 6);
      })
      .addCase(
        gameActions.movePlayer,
        (state, { payload: { playerId, to } }) => {
          state.playersState[playerId].position = to;
        }
      )
      .addCase(gameActions.nextTurn, (state) => {
        const playerIds = Object.keys(state.playersState);
        const currentPlayerId = state.currentTurn.playerId;

        const nextPlayerId =
        playerIds[(playerIds.indexOf(currentPlayerId) + 1) % playerIds.length];
        state.currentTurn.playerId = nextPlayerId;
        state.currentTurn.diceValue = undefined;
      });
  }
);

export const boardReducer = createReducer({}, (builder) => {});
