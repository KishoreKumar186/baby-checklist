import { useState } from 'react'

function ChecklistItem({ item, checked, onToggle }) {
  const [tipOpen, setTipOpen] = useState(false)

  const handleTipToggle = (e) => {
    e.stopPropagation()
    setTipOpen((prev) => !prev)
  }

  return (
    <div
      className={`item${checked ? ' checked' : ''}`}
      onClick={onToggle}
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onToggle()}
    >
      <div className="item-top">
        <div className="checkbox" aria-hidden="true">
          <span className="checkmark">✓</span>
        </div>
        <div className="item-text">
          <div className="item-name">{item.name}</div>

          {item.brands && item.brands.length > 0 && (
            <div className="item-brand">
              {item.brands.map((brand) => (
                <span key={brand}>{brand}</span>
              ))}
            </div>
          )}

          {item.tip && <div className="item-tip">{item.tip}</div>}

          {item.expandedTip && (
            <>
              <span className="tip-toggle" onClick={handleTipToggle}>
                💡 What to look for {tipOpen ? '▴' : '▾'}
              </span>
              <div className={`tip-content${tipOpen ? ' open' : ''}`}>
                {item.expandedTip}
              </div>
            </>
          )}
        </div>

        <div className={`priority-badge priority-${item.priority}`}>
          {item.priority === 'must' ? 'Must' : 'Good'}
        </div>
      </div>
    </div>
  )
}

export default ChecklistItem
