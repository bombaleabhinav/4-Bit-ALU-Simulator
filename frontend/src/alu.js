/**
 * ALU Operations Module
 * Implements all 16 logic and 16 arithmetic operations for a 4-bit ALU
 * based on the 74181 ALU truth tables.
 *
 * All operations work on 4-bit values (0-15).
 * Ported from the Python backend.
 */

const MASK = 0x0f; // 4-bit mask

/**
 * Perform a logic operation based on selection lines S (0-15).
 * Mode M = 1 (High) selects logic operations.
 *
 * @param {number} A - 4-bit input
 * @param {number} B - 4-bit input
 * @param {number} S - Selection lines (0-15)
 * @returns {[number, string]} [result, description]
 */
function logicOperation(A, B, S) {
    switch (S) {
        case 0:
            return [(~A) & MASK, "NOT A"];
        case 1:
            return [(~(A | B)) & MASK, "NOT (A OR B)"];
        case 2:
            return [((~A) & B) & MASK, "(NOT A) AND B"];
        case 3:
            return [0, "Logical 0"];
        case 4:
            return [(~(A & B)) & MASK, "NOT (A AND B)"];
        case 5:
            return [(~B) & MASK, "NOT B"];
        case 6:
            return [(A ^ B) & MASK, "A XOR B"];
        case 7:
            return [(A & (~B)) & MASK, "A AND (NOT B)"];
        case 8:
            return [((~A) | B) & MASK, "(NOT A) OR B"];
        case 9:
            return [(~(A ^ B)) & MASK, "A XNOR B"];
        case 10:
            return [B & MASK, "B"];
        case 11:
            return [(A & B) & MASK, "A AND B"];
        case 12:
            return [MASK, "Logical 1"];
        case 13:
            return [(A | (~B)) & MASK, "A OR (NOT B)"];
        case 14:
            return [(A | B) & MASK, "A OR B"];
        case 15:
            return [A & MASK, "A"];
        default:
            return [0, "Invalid S"];
    }
}

/**
 * Perform an arithmetic operation based on selection lines S (0-15).
 * Mode M = 0 (Low) selects arithmetic operations.
 *
 * @param {number} A - 4-bit input
 * @param {number} B - 4-bit input
 * @param {number} S - Selection lines (0-15)
 * @param {number} cin - Carry in (0 or 1)
 * @returns {[number, number, string]} [result, carry_out, description]
 */
function arithmeticOperation(A, B, S, cin) {
    const not_A = (~A) & MASK;
    const not_B = (~B) & MASK;
    const A_or_B = (A | B) & MASK;
    const A_and_B = (A & B) & MASK;
    const A_or_notB = (A | not_B) & MASK;
    const A_and_notB = (A & not_B) & MASK;

    let raw, desc;

    switch (S) {
        case 0:
            if (cin === 1) { raw = A; desc = "A"; }
            else { raw = A + 1; desc = "A Plus 1"; }
            break;
        case 1:
            if (cin === 1) { raw = A_or_B; desc = "A OR B"; }
            else { raw = A_or_B + 1; desc = "(A OR B) Plus 1"; }
            break;
        case 2:
            if (cin === 1) { raw = A_or_notB; desc = "A OR (NOT B)"; }
            else { raw = A_or_notB + 1; desc = "(A OR NOT B) Plus 1"; }
            break;
        case 3:
            if (cin === 1) { raw = MASK; desc = "Minus 1 (2's Complement)"; }
            else { raw = 0; desc = "Zero"; }
            break;
        case 4:
            if (cin === 1) { raw = A + A_and_notB; desc = "A Plus (A AND NOT B)"; }
            else { raw = A + A_and_notB + 1; desc = "A Plus (A AND NOT B) Plus 1"; }
            break;
        case 5:
            if (cin === 1) { raw = A_or_B + A_and_notB; desc = "(A OR B) Plus (A AND NOT B)"; }
            else { raw = A_or_B + A_and_notB + 1; desc = "(A OR B) Plus (A AND NOT B) Plus 1"; }
            break;
        case 6:
            if (cin === 1) { raw = A - B - 1; desc = "A Minus B Minus 1"; }
            else { raw = A - B; desc = "A Minus B"; }
            break;
        case 7:
            if (cin === 1) { raw = A_and_B - 1; desc = "(A AND B) Minus 1"; }
            else { raw = A_and_B; desc = "A AND B"; }
            break;
        case 8:
            if (cin === 1) { raw = A + A_and_B; desc = "A Plus (A AND B)"; }
            else { raw = A + A_and_B + 1; desc = "A Plus (A AND B) Plus 1"; }
            break;
        case 9:
            if (cin === 1) { raw = A + B; desc = "A Plus B"; }
            else { raw = A + B + 1; desc = "A Plus B Plus 1"; }
            break;
        case 10:
            if (cin === 1) { raw = A_or_notB + A_and_B; desc = "(A OR NOT B) Plus (A AND B)"; }
            else { raw = A_or_notB + A_and_B + 1; desc = "(A OR NOT B) Plus (A AND B) Plus 1"; }
            break;
        case 11:
            if (cin === 1) { raw = A_and_B - 1; desc = "(A AND B) Minus 1"; }
            else { raw = A_and_B; desc = "A AND B"; }
            break;
        case 12:
            if (cin === 1) { raw = A + A; desc = "A Plus A"; }
            else { raw = A + A + 1; desc = "A Plus A Plus 1"; }
            break;
        case 13:
            if (cin === 1) { raw = A_or_B + A; desc = "(A OR B) Plus A"; }
            else { raw = A_or_B + A + 1; desc = "(A OR B) Plus A Plus 1"; }
            break;
        case 14:
            if (cin === 1) { raw = A_or_notB + A; desc = "(A OR NOT B) Plus A"; }
            else { raw = A_or_notB + A + 1; desc = "(A OR NOT B) Plus A Plus 1"; }
            break;
        case 15:
            if (cin === 1) { raw = A - 1; desc = "A Minus 1"; }
            else { raw = A; desc = "A"; }
            break;
        default:
            raw = 0; desc = "Invalid S";
    }

    // Compute carry
    let carry;
    if (raw < 0) {
        raw = raw + 16; // 2's complement wrap
        carry = 0;
    } else if (raw > MASK) {
        carry = 1;
    } else {
        carry = 0;
    }

    const result = raw & MASK;
    return [result, carry, desc];
}

/**
 * Compute ALU output.
 *
 * @param {number} A - 4-bit input (0-15)
 * @param {number} B - 4-bit input (0-15)
 * @param {number} S - Selection lines (0-15)
 * @param {number} mode - 1 = logic, 0 = arithmetic
 * @param {number} cin - Carry in (0 or 1)
 * @returns {{ Y: number, carry: number, operation: string }}
 */
export function computeALU(A, B, S, mode, cin) {
    // Clamp inputs to 4 bits
    A = A & MASK;
    B = B & MASK;
    S = S & MASK;

    if (mode === 1) {
        const [result, description] = logicOperation(A, B, S);
        return { Y: result, carry: 0, operation: description };
    } else {
        const [result, carry, description] = arithmeticOperation(A, B, S, cin);
        return { Y: result, carry, operation: description };
    }
}
