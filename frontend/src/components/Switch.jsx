/**
 * Switch Component — Radio-style ON/OFF button
 * Displays a circular button that shows ON (filled) or OFF (outlined).
 * Clicking toggles between 0 and 1.
 */
function Switch({ label, value, onChange }) {
  const isOn = value === 1;

  return (
    <div className="radio-switch" onClick={() => onChange(isOn ? 0 : 1)}>
      <span className="radio-value">{value}</span>
      <button
        className={`radio-btn ${isOn ? 'on' : 'off'}`}
        type="button"
        aria-label={`${label} ${isOn ? 'ON' : 'OFF'}`}
      >
        {isOn ? 'ON' : 'OFF'}
      </button>
      <span className="radio-label">{label}</span>
    </div>
  );
}

export default Switch;
