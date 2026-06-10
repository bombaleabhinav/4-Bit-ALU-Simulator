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

function toBin(val, bits) {
    if (val < 0) val = val + (1 << bits);
    return (val >>> 0).toString(2).padStart(bits, '0').slice(-bits);
}

function to5BitSigned(val) {
    val = val & 0x1F;
    if (val & 0x10) return val - 32;
    return val;
}

function nonRestoringDivision(dividend, divisor) {
    const n = 4;
    let M = divisor;
    let A = 0;
    let Q = dividend;
    
    const mBin = toBin(M, 5);
    const steps = [];

    steps.push({
        N: n,
        M: mBin,
        A: toBin(A, 5),
        Q: toBin(Q, 4),
        comment: 'Initialize',
        type: 'init'
    });

    if (M === 0) {
        steps.push({
            N: n, M: mBin, A: toBin(A, 5), Q: toBin(Q, 4), comment: 'Divide by Zero Error', type: 'error'
        });
        return { steps, quotient: 0, remainder: 0 };
    }

    for (let count = n; count > 0; count--) {
        let signA = A < 0 ? 1 : 0;
        
        // Shift Left AQ
        let msbQ = (Q >> 3) & 1;
        A = to5BitSigned((A << 1) | msbQ);
        Q = (Q << 1) & 0xF;

        steps.push({
            N: count,
            M: mBin,
            A: toBin(A, 5),
            Q: toBin(Q, 4),
            comment: 'Shift Left AQ',
            type: 'shift'
        });

        if (signA === 0) {
            A = to5BitSigned(A - M);
            steps.push({
                N: count,
                M: mBin,
                A: toBin(A, 5),
                Q: toBin(Q, 4),
                comment: 'Sign A=0, A = A - M',
                type: 'sub'
            });
        } else {
            A = to5BitSigned(A + M);
            steps.push({
                N: count,
                M: mBin,
                A: toBin(A, 5),
                Q: toBin(Q, 4),
                comment: 'Sign A=1, A = A + M',
                type: 'add'
            });
        }

        if (A < 0) {
            Q = Q & 0xE; // Q0 = 0
            steps.push({
                N: count,
                M: mBin,
                A: toBin(A, 5),
                Q: toBin(Q, 4),
                comment: 'A < 0, Q₀ = 0',
                type: 'setq0'
            });
        } else {
            Q = Q | 1; // Q0 = 1
            steps.push({
                N: count,
                M: mBin,
                A: toBin(A, 5),
                Q: toBin(Q, 4),
                comment: 'A ≥ 0, Q₀ = 1',
                type: 'setq1'
            });
        }
    }

    if (A < 0) {
        A = to5BitSigned(A + M);
        steps.push({
            N: 0,
            M: mBin,
            A: toBin(A, 5),
            Q: toBin(Q, 4),
            comment: 'Final: A < 0, A = A + M',
            type: 'restore'
        });
    } else {
        steps.push({
            N: 0,
            M: mBin,
            A: toBin(A, 5),
            Q: toBin(Q, 4),
            comment: 'Final: A ≥ 0, No Action',
            type: 'final'
        });
    }

    return { steps, quotient: Q, remainder: A };
}

function updateCircuitDisplay(step) {
    document.getElementById('a-display').textContent = step.A;
    document.getElementById('q-display').textContent = step.Q;
    document.getElementById('m-display').textContent = step.M;

    const addSubBlock = document.getElementById('block-addsub');
    const shiftBlock = document.getElementById('block-shift');
    const aBlock = document.getElementById('block-a-reg');
    const qBlock = document.getElementById('block-q-reg');
    const opLabel = document.getElementById('addsub-op');

    [addSubBlock, shiftBlock, aBlock, qBlock].forEach(b => {
        if(b) b.classList.remove('highlight-add', 'highlight-sub', 'highlight-shift', 'active-pulse');
    });

    if (step.type === 'sub') {
        if(addSubBlock) addSubBlock.classList.add('highlight-sub', 'active-pulse');
        if(aBlock) aBlock.classList.add('highlight-sub');
        if(opLabel) {
            opLabel.textContent = 'A = A - M';
            opLabel.style.color = '#e74c3c';
        }
    } else if (step.type === 'add' || step.type === 'restore') {
        if(addSubBlock) addSubBlock.classList.add('highlight-add', 'active-pulse');
        if(aBlock) aBlock.classList.add('highlight-add');
        if(opLabel) {
            opLabel.textContent = 'A = A + M';
            opLabel.style.color = '#2ecc71';
        }
    } else if (step.type === 'shift') {
        if(shiftBlock) shiftBlock.classList.add('highlight-shift', 'active-pulse');
        if(aBlock) aBlock.classList.add('highlight-shift');
        if(qBlock) qBlock.classList.add('highlight-shift');
        if(opLabel) {
            opLabel.textContent = 'Shift Left';
            opLabel.style.color = '#f39c12';
        }
    } else if (step.type === 'setq1') {
        if(qBlock) qBlock.classList.add('highlight-add', 'active-pulse');
        if(opLabel) {
            opLabel.textContent = 'Q₀ = 1';
            opLabel.style.color = '#3498db';
        }
    } else if (step.type === 'setq0') {
        if(qBlock) qBlock.classList.add('highlight-sub', 'active-pulse');
        if(opLabel) {
            opLabel.textContent = 'Q₀ = 0';
            opLabel.style.color = '#e74c3c';
        }
    } else {
        if(opLabel) {
            opLabel.textContent = 'Idle';
            opLabel.style.color = '';
        }
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
            <td>${step.N}</td>
            <td>${step.M}</td>
            <td>${step.A}</td>
            <td>${step.Q}</td>
            <td>${step.comment}</td>
        `;
        tbody.appendChild(tr);
    });
}

function updateHUD(mVal, qVal, qRes, aRes) {
    document.getElementById('val-m').textContent = `${toBin(mVal, 4)} (${mVal})`;
    document.getElementById('val-q').textContent = `${toBin(qVal, 4)} (${qVal})`;
    document.getElementById('val-quotient').textContent = `${toBin(qRes, 4)} (${qRes})`;
    document.getElementById('val-remainder').textContent = `${toBin(aRes, 5)} (${aRes})`;
    
    if (mVal !== 0) {
        document.getElementById('val-eq').textContent = `${qVal} ÷ ${mVal} = ${qRes} R ${aRes}`;
    } else {
        document.getElementById('val-eq').textContent = `Divide by Zero`;
    }
}

function runDivision() {
    const M = getGroupVal('M');
    const Q = getGroupVal('Q');

    const result = nonRestoringDivision(Q.val, M.val);

    renderIterationTable(result.steps);

    const lastStep = result.steps[result.steps.length - 1];
    updateCircuitDisplay(lastStep);

    document.getElementById('product-binary').textContent = `Q: ${toBin(result.quotient, 4)}, A: ${toBin(result.remainder, 5)}`;

    updateHUD(M.val, Q.val, result.quotient, result.remainder);
    
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

        const rows = document.querySelectorAll('#iteration-tbody tr');
        rows.forEach((r, ri) => {
            r.style.background = ri === idx ? 'rgba(45, 108, 223, 0.1)' : '';
        });

        idx++;
        animationTimer = setTimeout(showStep, 800);
    }

    showStep();
}

document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        this.classList.toggle('active');
        this.textContent = this.classList.contains('active') ? '1' : '0';

        const M = getGroupVal('M');
        const Q = getGroupVal('Q');
        document.getElementById('m-display').textContent = "0" + M.bin;
        document.getElementById('q-display').textContent = Q.bin;
        document.getElementById('a-display').textContent = '00000';

        document.getElementById('val-m').textContent = `${M.bin} (${M.val})`;
        document.getElementById('val-q').textContent = `${Q.bin} (${Q.val})`;

        document.querySelectorAll('.block').forEach(b => {
            b.classList.remove('highlight-add', 'highlight-sub', 'highlight-shift', 'active-pulse');
        });
    });
});

document.getElementById('run-btn').addEventListener('click', runDivision);

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
setTimeout(adjustScale, 100);

// Info drawer removed (using tabs now)
// Theme handling is now done via shared.js
