import { nanoid, customAlphabet } from 'nanoid';

// Limit to numeric IDs with size 10.
customAlphabet("1234567890", 10);

export function generateId() {
    return nanoid();
}