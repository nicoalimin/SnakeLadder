/** Returns a promise after some delay. */
export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}