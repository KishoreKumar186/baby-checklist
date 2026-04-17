import { useState } from 'react'

function ChecklistItem({ item, checked, onToggle, editMode, onEdit, onDelete }) {
  const [tipOpen, setTipOpen] = useState(false)

  const handleTipToggle = (e) => {
    e.stopPropagation()
    setTipOpen((prev) => !prev)
  }

  return (
    <div
      className={`item${checked ? ' checked' : ''}${editMode ? ' edit-mode' : ''}`}
      onClick={editMode ? undefined : onToggle}
      role={editMode ? undefined : 'checkbox'}
      aria-checked={editMode ? undefined : checked}
      tabIndex={editMode ? undefined : 0}
      onKeyDown={editMode ? undefined : (e) => e.key === 'Enter' && onToggle()}
    >
      <div className="item-top">
        {!editMode && (
          <div className="checkbox" aria-hidden="true">
            <span className="checkmark">✓</span>
          </div>
        )}
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

          {item.expandedTip && !editMode && (
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

        {editMode ? (
          <div className="item-actions">
            <button
              className="btn-edit"
              onClick={(e) => { e.stopPropagation(); onEdit() }}
              aria-label="Edit item"
            >
              ✏️
            </button>
            <button
              className="btn-delete"
              onClick={(e) => { e.stopPropagation(); onDelete() }}
              aria-label="Delete item"
            >
              🗑️
            </button>
          </div>
        ) : (
          <div className={`priority-badge priority-${item.priority}`}>
            {item.priority === 'must' ? 'Must' : 'Good'}
          </div>
        )}
      </div>
    </div>
  )
}

export default ChecklistItem
