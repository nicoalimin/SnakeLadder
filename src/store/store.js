import { configureStore } from '@reduxjs/toolkit';
import { playersReducer , gameReducer, boardReducer } from '../reducers/root';

const preloadedState = {
    players: {
        1: "Michael",
    },
    game: {
        currentTurn: {
            playerId: 1,
            diceValue: 2,
        },
        playersPosition: {
            1: 23,
            2: 35,
        },
    },
    map: {
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
        prompts: {
            1: {
                id: 1,
                message: "Something Something",
            },
        }
    }
};

export const store = configureStore({
    reducer: {
        players: playersReducer,
        game: gameReducer,
        map: boardReducer,
    },
    preloadedState,
});