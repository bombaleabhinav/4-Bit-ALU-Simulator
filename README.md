# 4-Bit ALU Diagram Simulator

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white) 
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

This is an  interactive 4-bit Arithmetic Logic Unit (ALU) simulator built purely with raw **HTML**, **CSS**, and **JavaScript** (no external frameoworks). 

This project was built to visually demonstrate the underlying electronics and mechanics of an Arithmetic Logic Unit through a premium and minimal web interface.
<br/>

##  Usage & Controls

- **Inputs (Reg A & Reg B)**
  Toggle the individual bit states from `0` to `1` by clicking on them. The visual ALU data bus will execute your changes instantaneously.
- **Selectors (S3, S2, S1, S0)**
  The opcodes dictating *which* arithmetic or logic mechanism the ALU should evaluate on the payload variables (`A` & `B`).
- **MODE**
  Switch over between executing Arithmetic instructions and generic Logics (like AND, OR, XOR, NOT). 
- **Carry In (Cin)**
  Inject a carry input bit directly into the loop (for arithemetic operations only).
- **Output (F3, F2, F1, F0)**
  Displays the raw 4-bit resulting execution pushed out from the ALU.
- **Carry Out (Carry)**
  Reflects the overflow output bit after an Arithmetic calculation , if any.
- **Current State**
  The dynamic box in the bottom right actively converts raw binary sequences into decimal values for quick reference of calculation outcomes (especially arithemetic ones).
- **Truth Tables Drawer**
  Located at the top right header, click `Truth Tables` to open a referencing document to understand opcode selection!

<br/>

## 
Crafted with ❤️ by **Abhinav**.
