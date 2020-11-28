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
  addPlayerToGame: createAction("game/addPlayerToGame"),
  rollDice: createAction("game/rollDice"),
  setPromptNumber: createAction("game/setPromptNumber"),
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

const initializePlayerState = () => ({
  position: 1,
});

export const gameReducer = createReducer(
  {
    state: GAME_STATE.NOT_STARTED,
    currentTurn: {
      playerId: undefined,
      diceValue: undefined,
      promptNumber: undefined,
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
          acc[id] = initializePlayerState();
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
          playerIds[
            (playerIds.indexOf(currentPlayerId) + 1) % playerIds.length
          ];
        state.currentTurn.playerId = nextPlayerId;
        state.currentTurn.diceValue = undefined;
        state.currentTurn.promptNumber = undefined;
      })
      .addCase(
        gameActions.setPromptNumber,
        (state, { payload: { promptNumber } }) => {
          state.currentTurn.promptNumber = promptNumber;
        }
      )
      .addCase(
        gameActions.addPlayerToGame,
        (state, { payload: { playerId } }) => {
          state.playersState[playerId] = initializePlayerState();
        }
      );
  }
);

export const boardReducer = createReducer({}, (builder) => {});
