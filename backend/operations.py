"""
ALU Operations Module
Implements all 16 logic and 16 arithmetic operations for a 4-bit ALU
based on the 74181 ALU truth tables.

All operations work on 4-bit values (0-15).
Compatible with Python 3.8+.
"""

MASK = 0x0F  # 4-bit mask


def logic_operation(A, B, S):
    """
    Perform a logic operation based on selection lines S (0-15).
    Mode M = 1 (High) selects logic operations.

    Returns (result, description).
    Result is masked to 4 bits. No carry for logic operations.

    Truth table (active high data):
    S=0:  NOT A
    S=1:  NOT(A OR B)    = ~(A | B)   (NOR)
    S=2:  (NOT A) AND B  = ~A & B
    S=3:  Logical 0
    S=4:  NOT(A AND B)   = ~(A & B)   (NAND)
    S=5:  NOT B
    S=6:  A XOR B
    S=7:  A AND (NOT B)  = A & ~B
    S=8:  (NOT A) OR B   = ~A | B
    S=9:  NOT(A XOR B)   = ~(A ^ B)   (XNOR)
    S=10: B
    S=11: A AND B
    S=12: Logical 1
    S=13: A OR (NOT B)   = A | ~B
    S=14: A OR B
    S=15: A
    """
    if S == 0:
        return (~A) & MASK, "NOT A"
    elif S == 1:
        return (~(A | B)) & MASK, "NOT (A OR B)"
    elif S == 2:
        return ((~A) & B) & MASK, "(NOT A) AND B"
    elif S == 3:
        return 0, "Logical 0"
    elif S == 4:
        return (~(A & B)) & MASK, "NOT (A AND B)"
    elif S == 5:
        return (~B) & MASK, "NOT B"
    elif S == 6:
        return (A ^ B) & MASK, "A XOR B"
    elif S == 7:
        return (A & (~B)) & MASK, "A AND (NOT B)"
    elif S == 8:
        return ((~A) | B) & MASK, "(NOT A) OR B"
    elif S == 9:
        return (~(A ^ B)) & MASK, "A XNOR B"
    elif S == 10:
        return B & MASK, "B"
    elif S == 11:
        return (A & B) & MASK, "A AND B"
    elif S == 12:
        return MASK, "Logical 1"
    elif S == 13:
        return (A | (~B)) & MASK, "A OR (NOT B)"
    elif S == 14:
        return (A | B) & MASK, "A OR B"
    elif S == 15:
        return A & MASK, "A"
    else:
        return 0, "Invalid S"


def arithmetic_operation(A, B, S, cin):
    """
    Perform an arithmetic operation based on selection lines S (0-15).
    Mode M = 0 (Low) selects arithmetic operations.

    cin = 1 means carry in (Cn = H, with carry)
    cin = 0 means no carry in (Cn = L, no carry)

    Returns (result, carry_out, description).
    Result is masked to 4 bits.

    Truth table (active high data):
    Cn=H (cin=1)                          | Cn=L (cin=0)
    S=0:  F = A                           | F = A Plus 1
    S=1:  F = A + B                       | F = (A+B) Plus 1       (where + is OR)
    S=2:  F = A + (NOT B)                 | F = (A + NOT B) Plus 1 (where + is OR)
    S=3:  F = Minus 1 (2's Compl)         | F = Zero
    S=4:  F = A Plus (A AND NOT B)        | F = A Plus (A AND NOT B) Plus 1
    S=5:  F = (A + B) Plus (A AND NOT B)  | F = (A+B) Plus (A AND NOT B) Plus 1
    S=6:  F = A Minus B Minus 1           | F = A Minus B
    S=7:  F = (A AND B) Minus 1           | F = A AND B
    S=8:  F = A Plus (A AND B)            | F = A Plus (A AND B) Plus 1
    S=9:  F = A Plus B                    | F = A Plus B Plus 1    (arithmetic +)
    S=10: F = (A + NOT B) Plus (A AND B)  | F = (A+NOT B) Plus (A AND B) Plus 1
    S=11: F = (A AND B) Minus 1           | F = A AND B
    S=12: F = A Plus A                    | F = A Plus A Plus 1
    S=13: F = (A + B) Plus A              | F = (A+B) Plus A Plus 1
    S=14: F = (A + NOT B) Plus A          | F = (A+NOT B) Plus A Plus 1
    S=15: F = A Minus 1                   | F = A

    Note: "+" in expressions like "A+B" means OR, "Plus" means arithmetic addition.
    """
    # Precompute useful values
    not_A = (~A) & MASK
    not_B = (~B) & MASK
    A_or_B = (A | B) & MASK
    A_and_B = (A & B) & MASK
    A_or_notB = (A | not_B) & MASK
    A_and_notB = (A & not_B) & MASK

    if S == 0:
        if cin == 1:
            raw, desc = A, "A"
        else:
            raw, desc = A + 1, "A Plus 1"
    elif S == 1:
        if cin == 1:
            raw, desc = A_or_B, "A OR B"
        else:
            raw, desc = A_or_B + 1, "(A OR B) Plus 1"
    elif S == 2:
        if cin == 1:
            raw, desc = A_or_notB, "A OR (NOT B)"
        else:
            raw, desc = A_or_notB + 1, "(A OR NOT B) Plus 1"
    elif S == 3:
        if cin == 1:
            raw, desc = MASK, "Minus 1 (2's Complement)"
        else:
            raw, desc = 0, "Zero"
    elif S == 4:
        if cin == 1:
            raw, desc = A + A_and_notB, "A Plus (A AND NOT B)"
        else:
            raw, desc = A + A_and_notB + 1, "A Plus (A AND NOT B) Plus 1"
    elif S == 5:
        if cin == 1:
            raw, desc = A_or_B + A_and_notB, "(A OR B) Plus (A AND NOT B)"
        else:
            raw, desc = A_or_B + A_and_notB + 1, "(A OR B) Plus (A AND NOT B) Plus 1"
    elif S == 6:
        if cin == 1:
            raw, desc = A - B - 1, "A Minus B Minus 1"
        else:
            raw, desc = A - B, "A Minus B"
    elif S == 7:
        if cin == 1:
            raw, desc = A_and_B - 1, "(A AND B) Minus 1"
        else:
            raw, desc = A_and_B, "A AND B"
    elif S == 8:
        if cin == 1:
            raw, desc = A + A_and_B, "A Plus (A AND B)"
        else:
            raw, desc = A + A_and_B + 1, "A Plus (A AND B) Plus 1"
    elif S == 9:
        if cin == 1:
            raw, desc = A + B, "A Plus B"
        else:
            raw, desc = A + B + 1, "A Plus B Plus 1"
    elif S == 10:
        if cin == 1:
            raw, desc = A_or_notB + A_and_B, "(A OR NOT B) Plus (A AND B)"
        else:
            raw, desc = A_or_notB + A_and_B + 1, "(A OR NOT B) Plus (A AND B) Plus 1"
    elif S == 11:
        if cin == 1:
            raw, desc = A_and_B - 1, "(A AND B) Minus 1"
        else:
            raw, desc = A_and_B, "A AND B"
    elif S == 12:
        if cin == 1:
            raw, desc = A + A, "A Plus A"
        else:
            raw, desc = A + A + 1, "A Plus A Plus 1"
    elif S == 13:
        if cin == 1:
            raw, desc = A_or_B + A, "(A OR B) Plus A"
        else:
            raw, desc = A_or_B + A + 1, "(A OR B) Plus A Plus 1"
    elif S == 14:
        if cin == 1:
            raw, desc = A_or_notB + A, "(A OR NOT B) Plus A"
        else:
            raw, desc = A_or_notB + A + 1, "(A OR NOT B) Plus A Plus 1"
    elif S == 15:
        if cin == 1:
            raw, desc = A - 1, "A Minus 1"
        else:
            raw, desc = A, "A"
    else:
        raw, desc = 0, "Invalid S"

    # Compute carry: if raw exceeds 4-bit range or wraps around
    if raw < 0:
        raw = raw + 16  # 2's complement wrap
        carry = 0
    elif raw > MASK:
        carry = 1
    else:
        carry = 0

    result = raw & MASK
    return result, carry, desc
