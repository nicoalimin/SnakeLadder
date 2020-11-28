import { configureStore } from '@reduxjs/toolkit';
import { playersReducer , gameReducer, boardReducer } from '../reducers/root';
import { prompts } from "../constants/prompts";
import { BOARD_MAP_1 } from '../constants/boardMapOne';


const preloadedState = {
    players: {
    },
    game: {
        state: "NOT_STARTED",
        currentTurn: {
            playerId: undefined,
            diceValue: undefined,
        },
        playersState: {
        },
    },
    board: BOARD_MAP_1,
};

export const store = configureStore({
    reducer: {
        players: playersReducer,
        game: gameReducer,
        board: boardReducer,
    },
    preloadedState,
});