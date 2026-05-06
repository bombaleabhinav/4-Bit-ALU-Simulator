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

function restoringDivision(dividend, divisor) {
    const n = 4;
    let M = divisor;
    let A = 0;
    let Q = dividend;
    
    const mBin = toBin(M, 5); // 5 bits for M to match A's length
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
        // Shift Left AQ
        A = (A << 1) | ((Q >> 3) & 1);
        Q = (Q << 1) & 0xF;
        A = A & 0x1F; // 5 bits

        steps.push({
            N: count,
            M: mBin,
            A: toBin(A, 5),
            Q: toBin(Q, 4),
            comment: 'Shift Left AQ',
            type: 'shift'
        });

        // A = A - M
        let tempA = A - M;
        // Convert to 5-bit two's complement for display
        let displayA = tempA;
        if (displayA < 0) displayA = displayA + 32;
        
        steps.push({
            N: count,
            M: mBin,
            A: toBin(displayA, 5),
            Q: toBin(Q, 4),
            comment: 'A = A - M',
            type: 'sub'
        });

        if (tempA < 0) {
            // Restore A, Q0 = 0
            // Q0 is already 0 from the shift
            steps.push({
                N: count,
                M: mBin,
                A: toBin(A, 5),
                Q: toBin(Q, 4),
                comment: 'A < 0, Q₀=0, Restore A',
                type: 'restore'
            });
        } else {
            // A >= 0, Q0 = 1
            A = tempA;
            Q = Q | 1;
            steps.push({
                N: count,
                M: mBin,
                A: toBin(A, 5),
                Q: toBin(Q, 4),
                comment: 'A ≥ 0, Q₀=1',
                type: 'setq'
            });
        }
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
    } else if (step.type === 'restore') {
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
            opLabel.textContent = 'Shift';
            opLabel.style.color = '#f39c12';
        }
    } else if (step.type === 'setq') {
        if(qBlock) qBlock.classList.add('highlight-add', 'active-pulse');
        if(opLabel) {
            opLabel.textContent = 'Q₀ = 1';
            opLabel.style.color = '#3498db';
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

    const result = restoringDivision(Q.val, M.val);

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
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const targetWidth = 1500;
    const targetHeight = 950;

    const drawer = document.getElementById('info-drawer');
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
    if(container) {
        container.style.left = containerCenter + 'px';
        container.style.transform = `translate(-50%, -50%) scale(${scale})`;
    }
}

window.addEventListener('resize', adjustScale);
setTimeout(adjustScale, 100);

const toggleInfoBtn = document.getElementById('toggle-info-btn');
const infoDrawer = document.getElementById('info-drawer');
const closeDrawerBtn = document.getElementById('close-drawer');

if (toggleInfoBtn && infoDrawer && closeDrawerBtn) {
    toggleInfoBtn.addEventListener('click', () => {
        infoDrawer.classList.add('open');
        adjustScale();
    });
    closeDrawerBtn.addEventListener('click', () => {
        infoDrawer.classList.remove('open');
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
    if (localStorage.getItem('theme') === 'dark') {
        applyTheme(true);
    } else {
        applyTheme(false);
    }
    themeToggleBtn.addEventListener('click', () => {
        const isDark = document.body.classList.contains('dark-mode');
        applyTheme(!isDark);
        localStorage.setItem('theme', !isDark ? 'dark' : 'light');
    });
}
