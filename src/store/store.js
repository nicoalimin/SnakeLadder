import { configureStore } from '@reduxjs/toolkit';
import { playersReducer , gameReducer, boardReducer } from '../reducers/root';
import { prompts } from "../constants/prompts";


const preloadedState = {
    players: {
    },
    game: {
        state: "NOT_STARTED",
        currentTurn: {
            playerId: 1,
            diceValue: 2,
        },
        playersState: {
        },
    },
    board: {
        ladders: [
            {
                from: 15,
                to: 20,
            },
            {
                from: 9,
                to: 23,
            },
            {
                from: 26,
                to: 41,
            },
            {
                from: 38,
                to: 61,
            },
            {
                from: 31,
                to: 46,
            },
        ],
        snakes: [
            {
                from: 15,
                to: 20,
            },
            {
                from: 9,
                to: 23,
            },
            {
                from: 26,
                to: 41,
            },
            {
                from: 38,
                to: 61,
            },
            {
                from: 31,
                to: 46,
            },
        ],
        prompts: prompts
    }
};

export const store = configureStore({
    reducer: {
        players: playersReducer,
        game: gameReducer,
        board: boardReducer,
    },
    preloadedState,
});