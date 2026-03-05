/**
 * ALU Diagram Component
 * Renders the full ALU schematic matching the reference image:
 *   - Arithmetic Unit and Logic Unit side by side inside a main ALU box
 *   - Multiplexer on the right
 *   - Arrow connections from A/B inputs and S inputs
 *   - Mode (M) controlling the MUX from the top
 */
function ALUDiagram({ mode, operation }) {
    const isLogic = mode === 1;

    return (
        <div className="alu-schematic">
            {/* Main ALU enclosure */}
            <div className="alu-enclosure">
                {/* Input arrows entering the ALU from the left */}
                <div className="alu-input-arrows">
                    <div className="arrow-group arrow-group-a">
                        {['A3', 'A2', 'A1', 'A0'].map((label) => (
                            <div className="arrow-line" key={label}>
                                <span className="arrow-tip">→</span>
                            </div>
                        ))}
                    </div>
                    <div className="arrow-group arrow-group-b">
                        {['B3', 'B2', 'B1', 'B0'].map((label) => (
                            <div className="arrow-line" key={label}>
                                <span className="arrow-tip">→</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* The two units */}
                <div className="alu-units">
                    <div className={`alu-unit-box ${!isLogic ? 'active' : ''}`}>
                        <span className="unit-label">Arithmetic Unit</span>
                    </div>
                    <div className={`alu-unit-box ${isLogic ? 'active' : ''}`}>
                        <span className="unit-label">Logic Unit</span>
                    </div>

                    {/* S-input arrows from bottom into units */}
                    <div className="s-input-arrows">
                        {['S3', 'S2', 'S1', 'S0'].map((s) => (
                            <div className="s-arrow-line" key={s}>
                                <span className="arrow-tip-up">↑</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Output arrows from units to MUX */}
                <div className="unit-to-mux">
                    <div className={`unit-output-line ${!isLogic ? 'active' : ''}`}>
                        <span className="arrow-tip">→</span>
                    </div>
                    <div className={`unit-output-line ${isLogic ? 'active' : ''}`}>
                        <span className="arrow-tip">→</span>
                    </div>
                </div>

                {/* Multiplexer */}
                <div className="mux-section">
                    <div className="mode-arrow">
                        <span className="arrow-tip-down">↓</span>
                        <span className="mode-label-inline">M</span>
                    </div>
                    <div className="mux-box">
                        <span className="mux-label">MUX</span>
                    </div>
                    <div className="mux-output-arrow">
                        <span className="arrow-tip">→</span>
                    </div>
                </div>
            </div>

            {/* Operation display below the diagram */}
            <div className="operation-badge">
                <span className="op-label">Operation:</span>
                <span className="op-text">{operation || '—'}</span>
            </div>
        </div>
    );
}

export default ALUDiagram;
