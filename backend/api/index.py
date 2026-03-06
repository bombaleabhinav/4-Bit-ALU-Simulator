"""
Vercel Serverless Function – 4-bit ALU Simulator API
Deployed as a Python serverless function on Vercel.
"""

import sys
import os

# Add the backend root to the path so we can import alu & operations
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from alu import compute_alu

app = FastAPI(
    title="4-bit ALU Simulator API",
    description="Simulates a 74181-style 4-bit Arithmetic Logic Unit",
    version="1.0.0",
)

# Allow frontend to call the backend (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ALURequest(BaseModel):
    A: int = Field(..., ge=0, le=15, description="4-bit input A (A3 A2 A1 A0)")
    B: int = Field(..., ge=0, le=15, description="4-bit input B (B3 B2 B1 B0)")
    S: int = Field(..., ge=0, le=15, description="Selection lines (S3 S2 S1 S0)")
    mode: int = Field(..., ge=0, le=1, description="0 = arithmetic, 1 = logic")
    cin: int = Field(..., ge=0, le=1, description="Carry in")


class ALUResponse(BaseModel):
    Y: int = Field(..., description="4-bit output (0-15)")
    carry: int = Field(..., description="Carry out (0 or 1)")
    operation: str = Field(..., description="Text description of the operation performed")


@app.post("/api/alu", response_model=ALUResponse)
def alu_endpoint(req: ALURequest):
    result = compute_alu(A=req.A, B=req.B, S=req.S, mode=req.mode, cin=req.cin)
    return result


@app.get("/api")
def root():
    return {"message": "4-bit ALU Simulator API is running"}
