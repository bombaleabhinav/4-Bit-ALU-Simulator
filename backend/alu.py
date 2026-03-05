"""
ALU Core Module
Routes operations to either logic or arithmetic unit based on mode.
"""

from operations import logic_operation, arithmetic_operation

MASK = 0x0F


def compute_alu(A: int, B: int, S: int, mode: int, cin: int) -> dict:
    """
    Compute ALU output.

    Parameters:
        A    : 4-bit input (0-15)
        B    : 4-bit input (0-15)
        S    : Selection lines (0-15)
        mode : 1 = logic operations, 0 = arithmetic operations
        cin  : Carry in (0 or 1)

    Returns:
        dict with keys: Y (int), carry (int), operation (str)
    """
    # Clamp inputs to 4 bits
    A = A & MASK
    B = B & MASK
    S = S & MASK

    if mode == 1:
        # Logic operations — no carry
        result, description = logic_operation(A, B, S)
        return {
            "Y": result,
            "carry": 0,
            "operation": description,
        }
    else:
        # Arithmetic operations
        result, carry, description = arithmetic_operation(A, B, S, cin)
        return {
            "Y": result,
            "carry": carry,
            "operation": description,
        }
