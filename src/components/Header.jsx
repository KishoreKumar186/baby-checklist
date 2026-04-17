function Header({ progress, totalChecked, totalItems }) {
  return (
    <div className="hero">
      <div className="hero-tag">Your Readiness Guide</div>
      <h1>
        Baby &amp; Mom
        <br />
        Delivery Checklist
      </h1>
      <p>Curated for Indian families · Budget-conscious · Skin-safe</p>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="progress-label">
        {totalChecked} of {totalItems} items checked
      </div>
    </div>
  )
}

export default Header
