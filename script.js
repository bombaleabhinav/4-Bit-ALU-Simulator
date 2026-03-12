// ==========================================
// CONFIGURATION VARIABLES
// ==========================================

// You can change REG_BIT_SPACING to squish or stretch the 4 bits inside the registers!
const REG_A_START_Y = 100;
const REG_B_START_Y = 475;
const REG_BIT_SPACING = 75; // <-- Edit this mathematically to push the items closer together (default was 100)

// Output box placement variables
const OUT_BOX_TOP = 340; // Vertical center of the output box
const OUT_BOX_LEFT = 925; // Left edge of the output box
const OUT_BIT_SPACING = 50; // Horizontal spacing between each output node

// Dynamically compute layout loops at boot
function configureRegisters() {
    // Background bounding box styling
    document.querySelector('.group-a').style.top = (REG_A_START_Y - 20) + 'px';
    document.querySelector('.group-a').style.height = (3 * REG_BIT_SPACING + 65) + 'px';

    document.querySelector('.group-b').style.top = (REG_B_START_Y - 20) + 'px';
    document.querySelector('.group-b').style.height = (3 * REG_BIT_SPACING + 65) + 'px';

    for (let i = 0; i < 4; i++) {
        let bit = 3 - i;
        let ay = REG_A_START_Y + (i * REG_BIT_SPACING);
        let by = REG_B_START_Y + (i * REG_BIT_SPACING);

        // Re-position button nodes over UI
        document.querySelector(`.in-a${bit}`).style.top = ay + 'px';
        document.querySelector(`.in-b${bit}`).style.top = by + 'px';

        // Rewrite corresponding drawn SVG vectors so logic traces correctly align too
        let aPath = document.getElementById(`path-a${bit}-arith`);
        let aParts = aPath.getAttribute('d').split(' ');
        aParts[2] = (ay + 2);
        aParts[5] = (ay + 2);
        aPath.setAttribute('d', aParts.join(' '));

        let bPath = document.getElementById(`path-b${bit}-arith`);
        let bParts = bPath.getAttribute('d').split(' ');
        bParts[2] = (by + 12);
        bParts[5] = (by + 12);
        bPath.setAttribute('d', bParts.join(' '));

        let bLogic = document.getElementById(`path-b${bit}-logic`);
        let blParts = bLogic.getAttribute('d').split(' ');
        blParts[2] = (by + 12);
        bLogic.setAttribute('d', blParts.join(' '));
    }
}
configureRegisters(); // Run the math engine now over nodes!

// Dynamically position the output register box and its nodes horizontally
function configureOutputs() {
    const outBox = document.querySelector('.group-out');
    const totalNodes = 5; // Cout, F3, F2, F1, F0
    const boxWidth = (totalNodes - 1) * OUT_BIT_SPACING + 50;
    const boxHeight = 80;

    outBox.style.top = (OUT_BOX_TOP - 15) + 'px';
    outBox.style.left = (OUT_BOX_LEFT - 10) + 'px';
    outBox.style.width = boxWidth + 'px';
    outBox.style.height = boxHeight + 'px';

    // Position each output node horizontally within the box
    const nodes = ['cout', 'f3', 'f2', 'f1', 'f0'];
    nodes.forEach((id, i) => {
        const el = document.getElementById('node-' + id);
        if (el) {
            el.style.left = (OUT_BOX_LEFT + 5 + i * OUT_BIT_SPACING) + 'px';
            el.style.top = (OUT_BOX_TOP) + 'px';
        }
    });
}
configureOutputs();

// MUX DOM positioning handler over boundaries 
const MUX_BOX_TOP = 110; // Edit: Control ONLY the vertical visual position of the multiplexer box itself
const MUX_ARROWS_TOP = 150; // Edit: Control the mathematical vertical alignment anchor for all MUX arrows
const MUX_ARROW_PADDING = 50; // Edit: Equal padding distance of the two incoming arrows on the top/bottom edges

function configureMultiplexer() {
    document.querySelector('.multiplexer').style.top = MUX_BOX_TOP + 'px';

    // The Mux's actual Y coordinate relative to the SVG canvas is MUX_ARROWS_TOP + 10
    // Because alu-enclosure is at top: 50, but circuit-wrapper starts at top: 40 (50 - 40 = +10px offset bias)
    const muxSvgY = MUX_ARROWS_TOP + 10;
    const muxHeight = 400; // Defined cleanly mirroring height constraint inside .multiplexer CSS bounds 

    // Calculate precisely where the Arithmetic and Logic blocks end, and where the Multiplexer begins!
    const blockRightEdge = 625; // Exits right boundary of Arith/Logic units
    const muxLeftEdge = 708; // Enters left boundary of Multiplexer (5px buffer padding for arrowhead drawing)

    const arithY = muxSvgY + MUX_ARROW_PADDING;
    document.getElementById('arith-out-line').setAttribute('d', `M ${blockRightEdge} ${arithY} L ${muxLeftEdge} ${arithY}`);

    const logicY = muxSvgY + muxHeight - MUX_ARROW_PADDING;
    document.getElementById('logic-out-line').setAttribute('d', `M ${blockRightEdge} ${logicY} L ${muxLeftEdge} ${logicY}`);

    const modeLine = document.getElementById('mode-mux-line');
    if (modeLine) { // Snap mode trace going upwards into the bottom of the Multiplexer from its new bottom-anchored position
        const muxBottomY = muxSvgY + muxHeight;
        modeLine.setAttribute('d', `M 780 750 L 780 ${muxBottomY}`);
    }

    // Centralized mux bounding exit-trajectory automatically attached sequentially 
    const muxRightEdge = 715;
    const muxCenterY = muxSvgY + (muxHeight / 2);
    document.getElementById('mux-out-line').setAttribute('d', `M ${muxRightEdge} ${muxCenterY} L ${OUT_BOX_LEFT - 10} ${muxCenterY}`);

    // Connect Cout from Arith block to the output box
    const coutNodeX = OUT_BOX_LEFT + 5 + 12; // Center of the first horizontal node (Cout)
    document.getElementById('cout-out-line').setAttribute('d', `M ${blockRightEdge} 100 L ${coutNodeX} 100 L ${coutNodeX} ${OUT_BOX_TOP - 15}`);
}
configureMultiplexer();

// Change this number to control how far up the 4 arrows from the S register reach into the Arithmetic Unit 
// 357 exactly touches the Arithmetic Unit's bottom border edge.
const S_ARROW_REACH_Y = 357;

document.getElementById('s3-arith').setAttribute('d', `M 300 650 L 300 ${S_ARROW_REACH_Y}`);
document.getElementById('s2-arith').setAttribute('d', `M 380 650 L 380 ${S_ARROW_REACH_Y}`);
document.getElementById('s1-arith').setAttribute('d', `M 460 650 L 460 ${S_ARROW_REACH_Y}`);
document.getElementById('s0-arith').setAttribute('d', `M 540 650 L 540 ${S_ARROW_REACH_Y}`);
// ==========================================

// Truth Tables implementation
const logicOps = [
    { label: "A̅", fn: (a, b) => ~a },
    { label: "A OR B", fn: (a, b) => a | b },
    { label: "A AND B̅", fn: (a, b) => a & (~b & 15) },
    { label: "Logical 0", fn: (a, b) => 0 },
    { label: "A AND B̅", fn: (a, b) => a & (~b & 15) },
    { label: "B̅", fn: (a, b) => ~b },
    { label: "A XOR B", fn: (a, b) => a ^ b },
    { label: "A AND B", fn: (a, b) => a & b },
    { label: "A OR B", fn: (a, b) => a | b },
    { label: "A XOR B", fn: (a, b) => a ^ b },
    { label: "B", fn: (a, b) => b },
    { label: "A AND B", fn: (a, b) => a & b },
    { label: "Logical 1", fn: (a, b) => 15 },
    { label: "A OR B̅", fn: (a, b) => a | (~b & 15) },
    { label: "A OR B", fn: (a, b) => a | b },
    { label: "A", fn: (a, b) => a }
];

const arithHighOps = [
    { label: "A", fn: (a, b) => a },
    { label: "A+B", fn: (a, b) => a + b },
    { label: "A+B̅", fn: (a, b) => a + (~b & 15) },
    { label: "−B", fn: (a, b) => 0 - b },
    { label: "A+AB̅", fn: (a, b) => a + (a & (~b & 15)) },
    { label: "(A+B)+AB̅", fn: (a, b) => (a | b) + (a & (~b & 15)) },
    { label: "A−B−1", fn: (a, b) => a - b - 1 },
    { label: "AB−1", fn: (a, b) => (a & b) - 1 },
    { label: "A+AB", fn: (a, b) => a + (a & b) },
    { label: "A+B", fn: (a, b) => a + b },
    { label: "(A+B)+AB", fn: (a, b) => (a | b) + (a & b) },
    { label: "AB−1", fn: (a, b) => (a & b) - 1 },
    { label: "A+A", fn: (a, b) => a + a },
    { label: "(A+B)+A", fn: (a, b) => (a | b) + a },
    { label: "(A+B)+A", fn: (a, b) => (a | b) + a },
    { label: "A−1", fn: (a, b) => a - 1 }
];

const arithLowOps = [
    { label: "A+1", fn: (a, b) => a + 1 },
    { label: "(A+B)+1", fn: (a, b) => (a | b) + 1 },
    { label: "(A+B̅)+1", fn: (a, b) => (a | (~b & 15)) + 1 },
    { label: "0", fn: (a, b) => 0 },
    { label: "A+AB̅+1", fn: (a, b) => a + (a & (~b & 15)) + 1 },
    { label: "(A+B)+AB̅+1", fn: (a, b) => (a | b) + (a & (~b & 15)) + 1 },
    { label: "A−B", fn: (a, b) => a - b },
    { label: "AB", fn: (a, b) => (a & b) },
    { label: "A+AB+1", fn: (a, b) => a + (a & b) + 1 },
    { label: "A+B+1", fn: (a, b) => a + b + 1 },
    { label: "(A+B)+AB+1", fn: (a, b) => (a | b) + (a & b) + 1 },
    { label: "AB", fn: (a, b) => (a & b) },
    { label: "A+A+1", fn: (a, b) => a + a + 1 },
    { label: "(A+B)+A+1", fn: (a, b) => (a | b) + a + 1 },
    { label: "(A+B)+A+1", fn: (a, b) => (a | b) + a + 1 },
    { label: "A", fn: (a, b) => a }
];

// State collection helper
function getGroupVal(type) {
    let val = 0;
    let bin = "";
    for (let i = 3; i >= 0; i--) {
        const btn = document.querySelector(`.toggle-btn[data-type="${type}"][data-index="${i}"]`);
        const bit = btn.classList.contains('active') ? 1 : 0;
        bin += bit;
        val += bit * Math.pow(2, i);
    }
    return { val, bin };
}

// Calculation
function runSimulation() {
    const A = getGroupVal('A');
    const B = getGroupVal('B');
    const S = getGroupVal('S');
    const M = document.getElementById('t-m').classList.contains('active'); // 1 = Logic, 0 = Arith
    const Cin = document.getElementById('t-cin').classList.contains('active'); // 1 = High, 0 = Low

    let opDef;
    if (M) {
        opDef = logicOps[S.val];
    } else {
        opDef = Cin ? arithHighOps[S.val] : arithLowOps[S.val];
    }

    // Calculation
    let resultRaw = opDef.fn(A.val, B.val);
    let cout = 0;

    if (M) {
        resultRaw = resultRaw & 15;
        cout = 0;
    } else {
        if (resultRaw < 0) {
            resultRaw = (resultRaw + 16) % 16;
            cout = 0;
        } else {
            cout = Math.floor(resultRaw / 16) > 0 ? 1 : 0;
        }
        resultRaw = resultRaw & 15;
    }

    // Update F output nodes
    const resBin = resultRaw.toString(2).padStart(4, '0');
    for (let i = 0; i < 4; i++) {
        const fNode = document.getElementById(`f${3 - i}`);
        fNode.textContent = resBin[i];
        if (resBin[i] === '1') fNode.classList.add('active');
        else fNode.classList.remove('active');
    }

    // Update Cout node
    const coutNode = document.getElementById('cout');
    coutNode.textContent = cout;
    if (cout === 1) coutNode.classList.add('active');
    else coutNode.classList.remove('active');

    // Update Data HUD
    document.getElementById('val-a').textContent = `${A.bin} (${A.val})`;
    document.getElementById('val-b').textContent = `${B.bin} (${B.val})`;
    document.getElementById('val-s').textContent = `${S.bin} (${S.val})`;
    document.getElementById('val-res').textContent = `${resBin} (${resultRaw})`;
    document.getElementById('val-eq').textContent = `Operation = ${opDef.label}`;

    // Visual Pathway Highlighting
    const arithBlock = document.getElementById('arithmetic-block');
    const logicBlock = document.getElementById('logic-block');
    const arithOutLine = document.getElementById('arith-out-line');
    const logicOutLine = document.getElementById('logic-out-line');
    const muxOutLine = document.getElementById('mux-out-line');

    muxOutLine.classList.add('pulse');

    // Cin / Cout visibility based on mode
    const cinNode = document.querySelector('.in-cin');
    const coutNode2 = document.getElementById('node-cout');

    if (M) {
        // Logic Path
        logicBlock.style.borderColor = "#000";
        logicBlock.style.background = "var(--active-bg)";
        arithBlock.style.borderColor = "#888";
        arithBlock.style.background = "var(--box-bg)";
        logicBlock.style.opacity = "1";
        arithBlock.style.opacity = "0.5";
        logicOutLine.classList.add('pulse');
        arithOutLine.classList.remove('pulse');

        // Grey out Cin and Cout
        cinNode.style.opacity = "0.3";
        cinNode.style.pointerEvents = "none";
        if (coutNode2) { coutNode2.style.opacity = "0.3"; }
    } else {
        // Arith Path
        arithBlock.style.borderColor = "#000";
        arithBlock.style.background = "var(--active-bg)";
        logicBlock.style.borderColor = "#888";
        logicBlock.style.background = "var(--box-bg)";
        arithBlock.style.opacity = "1";
        logicBlock.style.opacity = "0.5";
        arithOutLine.classList.add('pulse');
        logicOutLine.classList.remove('pulse');

        // Restore Cin and Cout
        cinNode.style.opacity = "1";
        cinNode.style.pointerEvents = "auto";
        if (coutNode2) { coutNode2.style.opacity = "1"; }
    }
}

// Bind clicks
document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        this.classList.toggle('active');
        if (this.id === 't-m') {
            this.textContent = this.classList.contains('active') ? 'LOGICAL' : 'ARITHMETIC';
        } else {
            this.textContent = this.classList.contains('active') ? '1' : '0';
        }
        runSimulation();
    });
});

// Init
runSimulation();

// ==========================================
// RESPONSIVENESS & SCALING
// ==========================================
function adjustScale() {
    const container = document.querySelector('.container');
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // The entire layout is now 1450px wide and 950px high.
    // Let's add padding so it doesn't touch the edges completely.
    const targetWidth = 1450 + 40; 
    const targetHeight = 950 + 120; // 120px to account for header and footer spacing

    const scaleX = vw / targetWidth;
    const scaleY = vh / targetHeight;
    const scale = Math.min(scaleX, scaleY);
    
    // Apply center translation first, then scale
    container.style.transform = `translate(-50%, -50%) scale(${scale})`;
}

// Bind resize listener
window.addEventListener('resize', adjustScale);

// Initial call
adjustScale();
