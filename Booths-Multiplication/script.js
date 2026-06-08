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

function toSigned4(val) {
    val = val & 0xF;
    return (val & 8) ? val - 16 : val;
}

function toSigned8(val) {
    val = val & 0xFF;
    return (val & 0x80) ? val - 256 : val;
}

function toBin(val, bits) {
    if (val < 0) val = val + (1 << bits);
    return (val >>> 0).toString(2).padStart(bits, '0').slice(-bits);
}

function boothMultiply(multiplicand, multiplier) {
    const n = 4;
    let M = toSigned4(multiplicand);
    let A = 0;
    let Q = multiplier & 0xF;
    let Q_1 = 0;
    let count = n;

    const mBin = toBin(M, n);
    const steps = [];

    steps.push({
        A: toBin(A, n),
        Q: toBin(Q, n),
        Q_1: Q_1,
        M: mBin,
        comment: 'Initialize',
        type: 'init'
    });

    while (count > 0) {
        const Q0 = Q & 1;

        if (Q0 === 1 && Q_1 === 0) {
            A = A - M;
            steps.push({
                A: toBin(A, n),
                Q: toBin(Q, n),
                Q_1: Q_1,
                M: mBin,
                comment: 'A = A − M',
                type: 'sub'
            });
        } else if (Q0 === 0 && Q_1 === 1) {
            A = A + M;
            steps.push({
                A: toBin(A, n),
                Q: toBin(Q, n),
                Q_1: Q_1,
                M: mBin,
                comment: 'A = A + M',
                type: 'add'
            });
        }

        Q_1 = Q & 1;
        Q = ((A & 1) << 3) | (Q >> 1);
        const signBit = A & (1 << (n - 1));
        A = (A >> 1);
        if (signBit) {
            A = A | ((-1) << (n - 1));
        }
        A = A & 0xF;
        if (A & 8) A = A - 16;

        steps.push({
            A: toBin(A, n),
            Q: toBin(Q, n),
            Q_1: Q_1,
            M: mBin,
            comment: 'Shift',
            type: 'shift'
        });

        count--;
    }

    const productBin = toBin(A, n) + toBin(Q, n);
    const productVal = toSigned8(parseInt(productBin, 2));

    return { steps, productBin, productVal, mSigned: M, qSigned: toSigned4(multiplier) };
}

function updateCircuitDisplay(step) {
    document.getElementById('a-display').textContent = step.A;
    document.getElementById('q-display').textContent = step.Q;
    document.getElementById('q1-display').textContent = step.Q_1;
    document.getElementById('m-display').textContent = step.M;

    const addSubBlock = document.getElementById('block-addsub');
    const shiftBlock = document.getElementById('block-shift');
    const aBlock = document.getElementById('block-a-reg');
    const qBlock = document.getElementById('block-q-reg');
    const q1Block = document.getElementById('block-q1');
    const opLabel = document.getElementById('addsub-op');

    [addSubBlock, shiftBlock, aBlock, qBlock, q1Block].forEach(b => {
        b.classList.remove('highlight-add', 'highlight-sub', 'highlight-shift', 'active-pulse');
    });

    if (step.type === 'add') {
        addSubBlock.classList.add('highlight-add', 'active-pulse');
        aBlock.classList.add('highlight-add');
        opLabel.textContent = 'A = A + M';
        opLabel.style.color = 'var(--add-color)';
    } else if (step.type === 'sub') {
        addSubBlock.classList.add('highlight-sub', 'active-pulse');
        aBlock.classList.add('highlight-sub');
        opLabel.textContent = 'A = A − M';
        opLabel.style.color = 'var(--subtract-color)';
    } else if (step.type === 'shift') {
        shiftBlock.classList.add('highlight-shift', 'active-pulse');
        aBlock.classList.add('highlight-shift');
        qBlock.classList.add('highlight-shift');
        q1Block.classList.add('highlight-shift');
        opLabel.textContent = 'ASR';
        opLabel.style.color = 'var(--shift-color)';
    } else {
        opLabel.textContent = 'Idle';
        opLabel.style.color = '';
    }
}

function renderIterationTable(steps) {
    const tbody = document.getElementById('iteration-tbody');
    tbody.innerHTML = '';

    steps.forEach((step, i) => {
        const tr = document.createElement('tr');
        tr.className = `row-${step.type} animate-in`;
        tr.style.animationDelay = `${i * 80}ms`;
        tr.innerHTML = `
            <td>${step.A}</td>
            <td>${step.Q}</td>
            <td>${step.Q_1}</td>
            <td>${step.M}</td>
            <td>${step.comment}</td>
        `;
        tbody.appendChild(tr);
    });
}

function updateHUD(mVal, qVal, productBin, productVal) {
    const mSigned = toSigned4(mVal);
    const qSigned = toSigned4(qVal);
    document.getElementById('val-m').textContent = `${toBin(mVal, 4)} (${mSigned})`;
    document.getElementById('val-q').textContent = `${toBin(qVal, 4)} (${qSigned})`;
    document.getElementById('val-product').textContent = `${productBin} (${productVal})`;
    document.getElementById('val-eq').textContent = `${mSigned} × ${qSigned} = ${productVal}`;
}

function runBooth() {
    const M = getGroupVal('M');
    const Q = getGroupVal('Q');

    const result = boothMultiply(M.val, Q.val);

    renderIterationTable(result.steps);

    const lastStep = result.steps[result.steps.length - 1];
    updateCircuitDisplay(lastStep);

    document.getElementById('counter-display').textContent = 'n = 0';
    document.getElementById('count-val').textContent = '0';

    document.getElementById('product-binary').textContent = result.productBin;
    document.getElementById('product-decimal').textContent = `(${result.productVal})`;

    for (let i = 0; i < 8; i++) {
        const pin = document.getElementById(`out-p${7 - i}`);
        if (pin) {
            pin.textContent = result.productBin[i];
            if (result.productBin[i] === '1') {
                pin.classList.add('active');
            } else {
                pin.classList.remove('active');
            }
        }
    }

    updateHUD(M.val, Q.val, result.productBin, result.productVal);

    animateSteps(result.steps);
}

let animationTimer = null;

function animateSteps(steps) {
    if (animationTimer) clearTimeout(animationTimer);

    let idx = 0;

    function showStep() {
        if (idx >= steps.length) return;

        const step = steps[idx];
        updateCircuitDisplay(step);

        const stepsPerIteration = 2;
        let iterationsDone = 0;
        for (let i = 0; i <= idx; i++) {
            if (steps[i].type === 'shift') iterationsDone++;
        }
        const remaining = 4 - iterationsDone;
        document.getElementById('counter-display').textContent = `n = ${remaining}`;
        document.getElementById('count-val').textContent = remaining.toString();

        const rows = document.querySelectorAll('#iteration-tbody tr');
        rows.forEach((r, ri) => {
            r.style.background = ri === idx ? 'rgba(45, 108, 223, 0.1)' : '';
        });

        idx++;
        animationTimer = setTimeout(showStep, 700);
    }

    showStep();
}

function configureSVGPaths() {
}

document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        this.classList.toggle('active');
        this.textContent = this.classList.contains('active') ? '1' : '0';

        const M = getGroupVal('M');
        const Q = getGroupVal('Q');
        document.getElementById('m-display').textContent = M.bin;
        document.getElementById('q-display').textContent = Q.bin;

        document.getElementById('a-display').textContent = '0000';
        document.getElementById('q-display').textContent = Q.bin;
        document.getElementById('q1-display').textContent = '0';
        document.getElementById('counter-display').textContent = 'n = 4';
        document.getElementById('count-val').textContent = '4';
        document.getElementById('addsub-op').textContent = 'Idle';
        document.getElementById('addsub-op').style.color = '';

        const mSigned = toSigned4(M.val);
        const qSigned = toSigned4(Q.val);
        document.getElementById('val-m').textContent = `${M.bin} (${mSigned})`;
        document.getElementById('val-q').textContent = `${Q.bin} (${qSigned})`;

        for (let i = 0; i < 8; i++) {
            const pin = document.getElementById(`out-p${i}`);
            if (pin) {
                pin.textContent = '0';
                pin.classList.remove('active');
            }
        }

        document.querySelectorAll('.block').forEach(b => {
            b.classList.remove('highlight-add', 'highlight-sub', 'highlight-shift', 'active-pulse');
        });
    });
});

document.getElementById('run-btn').addEventListener('click', runBooth);

function adjustScale() {
    const container = document.querySelector('.container');
    const viewport = document.querySelector('.sim-viewport');
    if (!viewport) return;

    const vw = viewport.clientWidth;
    const vh = viewport.clientHeight;
    
    const targetWidth = 1500;
    const targetHeight = 950;
    
    const scaleX = vw / targetWidth;
    const scaleY = vh / targetHeight;
    const scale = Math.min(scaleX, scaleY);
    
    if(container) {
        container.style.left = (vw / 2) + 'px';
        container.style.transform = `translate(-50%, -50%) scale(${scale})`;
    }
}

window.addEventListener('resize', adjustScale);
adjustScale();

// Theme handling is now done via shared.js

configureSVGPaths();
