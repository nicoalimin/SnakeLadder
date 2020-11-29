import { prompts } from "./prompts";

export const BOARD_MAP_1 = {
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
            from: 12,
            to: 2,
        },
        {
            from: 58,
            to: 8,
        },
        {
            from: 37,
            to: 22,
        },
        {
            from: 44,
            to: 19,
        },
        {
            from: 17,
            to: 16,
        },
        {
            from: 52,
            to: 45,
        },
        {
            from: 63,
            to: 47,
        },
    ],
    prompts,
    dimensionSize: 8,
};