import Switch from './Switch';

/**
 * Control Panel Component
 * S3-S0 selection switches displayed in a row at the bottom,
 * with arrows going upward into the ALU.
 */
function ControlPanel({ S, onSChange }) {
    const sBits = [
        (S >> 3) & 1,
        (S >> 2) & 1,
        (S >> 1) & 1,
        S & 1,
    ];

    const handleSBit = (index, val) => {
        const newBits = [...sBits];
        newBits[index] = val;
        const newS = (newBits[0] << 3) | (newBits[1] << 2) | (newBits[2] << 1) | newBits[3];
        onSChange(newS);
    };

    return (
        <div className="control-panel">
            <div className="control-switches">
                <Switch label="S3" value={sBits[0]} onChange={(v) => handleSBit(0, v)} />
                <Switch label="S2" value={sBits[1]} onChange={(v) => handleSBit(1, v)} />
                <Switch label="S1" value={sBits[2]} onChange={(v) => handleSBit(2, v)} />
                <Switch label="S0" value={sBits[3]} onChange={(v) => handleSBit(3, v)} />
            </div>
            <div className="control-value">S = {S}</div>
        </div>
    );
}

export default ControlPanel;
