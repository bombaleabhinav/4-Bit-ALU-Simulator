/**
 * LED Component
 * Displays a single-bit output as a filled (ON) or hollow (OFF) circle.
 */
function Led({ label, value }) {
    return (
        <div className="led-container">
            <span className="led-label">{label}</span>
            <div className={`led-circle ${value ? 'on' : 'off'}`} />
            <span className="led-value">{value}</span>
        </div>
    );
}

export default Led;
