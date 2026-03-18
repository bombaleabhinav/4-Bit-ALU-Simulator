const REG_A_START_Y = 100;
const REG_B_START_Y = 475;
const REG_BIT_SPACING = 75;
const OUT_BOX_TOP = 340;
const OUT_BOX_LEFT = 925;
const OUT_BIT_SPACING = 50;
function configureRegisters() {
    document.querySelector('.group-a').style.top = (REG_A_START_Y - 20) + 'px';
    document.querySelector('.group-a').style.height = (3 * REG_BIT_SPACING + 65) + 'px';
    document.querySelector('.group-b').style.top = (REG_B_START_Y - 20) + 'px';
    document.querySelector('.group-b').style.height = (3 * REG_BIT_SPACING + 65) + 'px';
    for (let i = 0; i < 4; i++) {
        let bit = 3 - i;
        let ay = REG_A_START_Y + (i * REG_BIT_SPACING);
        let by = REG_B_START_Y + (i * REG_BIT_SPACING);
        document.querySelector(`.in-a${bit}`).style.top = ay + 'px';
        document.querySelector(`.in-b${bit}`).style.top = by + 'px';
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
configureRegisters();
function configureOutputs() {
    const outBox = document.querySelector('.group-out');
    const totalNodes = 5;
    const boxWidth = (totalNodes - 1) * OUT_BIT_SPACING + 50;
    const boxHeight = 80;
    outBox.style.top = (OUT_BOX_TOP - 15) + 'px';
    outBox.style.left = (OUT_BOX_LEFT - 10) + 'px';
    outBox.style.width = boxWidth + 'px';
    outBox.style.height = boxHeight + 'px';
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
const MUX_BOX_TOP = 110;
const MUX_ARROWS_TOP = 150;
const MUX_ARROW_PADDING = 50;
function configureMultiplexer() {
    document.querySelector('.multiplexer').style.top = MUX_BOX_TOP + 'px';
    const muxSvgY = MUX_ARROWS_TOP + 10;
    const muxHeight = 400;
    const blockRightEdge = 625;
    const muxLeftEdge = 708;
    const arithY = muxSvgY + MUX_ARROW_PADDING;
    document.getElementById('arith-out-line').setAttribute('d', `M ${blockRightEdge} ${arithY} L ${muxLeftEdge} ${arithY}`);
    const logicY = muxSvgY + muxHeight - MUX_ARROW_PADDING;
    document.getElementById('logic-out-line').setAttribute('d', `M ${blockRightEdge} ${logicY} L ${muxLeftEdge} ${logicY}`);
    const modeLine = document.getElementById('mode-mux-line');
    if (modeLine) {
        const muxBottomY = muxSvgY + muxHeight;
        modeLine.setAttribute('d', `M 780 750 L 780 ${muxBottomY}`);
    }
    const muxRightEdge = 715;
    const muxCenterY = muxSvgY + (muxHeight / 2);
    document.getElementById('mux-out-line').setAttribute('d', `M ${muxRightEdge} ${muxCenterY} L ${OUT_BOX_LEFT - 10} ${muxCenterY}`);
    const coutNodeX = OUT_BOX_LEFT + 5 + 12;
    document.getElementById('cout-out-line').setAttribute('d', `M ${blockRightEdge} 100 L ${coutNodeX} 100 L ${coutNodeX} ${OUT_BOX_TOP - 15}`);
}
configureMultiplexer();
const S_ARROW_REACH_Y = 357;
document.getElementById('s3-arith').setAttribute('d', `M 300 650 L 300 ${S_ARROW_REACH_Y}`);
document.getElementById('s2-arith').setAttribute('d', `M 380 650 L 380 ${S_ARROW_REACH_Y}`);
document.getElementById('s1-arith').setAttribute('d', `M 460 650 L 460 ${S_ARROW_REACH_Y}`);
document.getElementById('s0-arith').setAttribute('d', `M 540 650 L 540 ${S_ARROW_REACH_Y}`);
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
function runSimulation() {
    const A = getGroupVal('A');
    const B = getGroupVal('B');
    const S = getGroupVal('S');
    const M = document.getElementById('t-m').classList.contains('active');
    const Cin = document.getElementById('t-cin').classList.contains('active');
    let opDef;
    if (M) {
        opDef = logicOps[S.val];
    } else {
        opDef = Cin ? arithHighOps[S.val] : arithLowOps[S.val];
    }
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
    const resBin = resultRaw.toString(2).padStart(4, '0');
    for (let i = 0; i < 4; i++) {
        const fNode = document.getElementById(`f${3 - i}`);
        fNode.textContent = resBin[i];
        if (resBin[i] === '1') fNode.classList.add('active');
        else fNode.classList.remove('active');
    }
    const coutNode = document.getElementById('cout');
    coutNode.textContent = cout;
    if (cout === 1) coutNode.classList.add('active');
    else coutNode.classList.remove('active');
    document.getElementById('val-a').textContent = `${A.bin} (${A.val})`;
    document.getElementById('val-b').textContent = `${B.bin} (${B.val})`;
    document.getElementById('val-s').textContent = `${S.bin} (${S.val})`;
    document.getElementById('val-res').textContent = `${resBin} (${resultRaw})`;
    document.getElementById('val-eq').textContent = `Operation = ${opDef.label}`;
    const arithBlock = document.getElementById('arithmetic-block');
    const logicBlock = document.getElementById('logic-block');
    const arithOutLine = document.getElementById('arith-out-line');
    const logicOutLine = document.getElementById('logic-out-line');
    const muxOutLine = document.getElementById('mux-out-line');
    muxOutLine.classList.add('pulse');
    const cinNode = document.querySelector('.in-cin');
    const coutNode2 = document.getElementById('node-cout');
    if (M) {
        logicBlock.style.borderColor = "#000";
        logicBlock.style.background = "var(--active-bg)";
        arithBlock.style.borderColor = "#888";
        arithBlock.style.background = "var(--box-bg)";
        logicBlock.style.opacity = "1";
        arithBlock.style.opacity = "0.5";
        logicOutLine.classList.add('pulse');
        arithOutLine.classList.remove('pulse');
        cinNode.style.opacity = "0.3";
        cinNode.style.pointerEvents = "none";
        if (coutNode2) { coutNode2.style.opacity = "0.3"; }
    } else {
        arithBlock.style.borderColor = "#000";
        arithBlock.style.background = "var(--active-bg)";
        logicBlock.style.borderColor = "#888";
        logicBlock.style.background = "var(--box-bg)";
        arithBlock.style.opacity = "1";
        logicBlock.style.opacity = "0.5";
        arithOutLine.classList.add('pulse');
        logicOutLine.classList.remove('pulse');
        cinNode.style.opacity = "1";
        cinNode.style.pointerEvents = "auto";
        if (coutNode2) { coutNode2.style.opacity = "1"; }
    }
    const logicTable = document.getElementById('logic-table-container');
    const arithTable = document.getElementById('arith-table-container');
    if (logicTable && arithTable) {
        if (M) {
            logicTable.style.display = 'block';
            arithTable.style.display = 'none';
        } else {
            logicTable.style.display = 'none';
            arithTable.style.display = 'block';
        }
    }
}
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
runSimulation();
function adjustScale() {
    const container = document.querySelector('.container');
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const targetWidth = 1450 + 40;
    const targetHeight = 950 + 120;
    const drawer = document.getElementById('truth-table-drawer');
    const isDrawerOpen = drawer && drawer.classList.contains('open');
    const drawerSpace = 450;
    let availableWidth = vw;
    let containerCenter = vw / 2;
    if (isDrawerOpen && vw > 950) {
        availableWidth = vw - drawerSpace;
        containerCenter = availableWidth / 2;
    }
    const scaleX = availableWidth / targetWidth;
    const scaleY = vh / targetHeight;
    const scale = Math.min(scaleX, scaleY);
    container.style.left = containerCenter + 'px';
    container.style.transform = `translate(-50%, -50%) scale(${scale})`;
}
window.addEventListener('resize', adjustScale);
adjustScale();
const toggleBtn = document.getElementById('toggle-tables-btn');
const drawer = document.getElementById('truth-table-drawer');
const closeDrawerBtn = document.getElementById('close-drawer');
if (toggleBtn && drawer && closeDrawerBtn) {
    toggleBtn.addEventListener('click', () => {
        drawer.classList.add('open');
        adjustScale();
    });
    closeDrawerBtn.addEventListener('click', () => {
        drawer.classList.remove('open');
        adjustScale();
    });
}
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const moonPath = "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z";
const sunPath = "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z";
if (themeToggleBtn && themeIcon) {
    const applyTheme = (isDark) => {
        if (isDark) {
            document.body.classList.add('dark-mode');
            themeIcon.innerHTML = `<path d="${sunPath}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
        } else {
            document.body.classList.remove('dark-mode');
            themeIcon.innerHTML = `<path d="${moonPath}"/>`;
        }
    };
    applyTheme(false);
    themeToggleBtn.addEventListener('click', () => {
        const isDark = document.body.classList.contains('dark-mode');
        applyTheme(!isDark);
        localStorage.setItem('alu-simulator-theme', !isDark ? 'dark' : 'light');
    });
}