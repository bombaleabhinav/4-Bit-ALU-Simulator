import Led from './Led';

/**
 * Output Panel Component
 * Displays ALU output: Carry out + Y[3:0] LEDs + decimal/binary.
 */
function OutputPanel({ Y, carry }) {
    const yBits = [
        (Y >> 3) & 1,
        (Y >> 2) & 1,
        (Y >> 1) & 1,
        Y & 1,
    ];

    return (
        <div className="output-panel">
            <div className="output-section">
                <span className="output-title">Output</span>
                <div className="output-leds">
                    <Led label="Cout" value={carry} />
                    <div className="output-separator" />
                    <Led label="Y3" value={yBits[0]} />
                    <Led label="Y2" value={yBits[1]} />
                    <Led label="Y1" value={yBits[2]} />
                    <Led label="Y0" value={yBits[3]} />
                </div>
                <div className="output-values">
                    <span>Cout = {carry}</span>
                    <span>Y = {Y} ({Y.toString(2).padStart(4, '0')})</span>
                </div>
            </div>
        </div>
    );
}

export default OutputPanel;
