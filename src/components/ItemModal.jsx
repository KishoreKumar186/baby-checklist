import { useState } from 'react'

function ItemModal({ mode, item, onSave, onClose }) {
  const [form, setForm] = useState({
    name: item?.name ?? '',
    tip: item?.tip ?? '',
    brands: item?.brands?.join(', ') ?? '',
    priority: item?.priority ?? 'must',
    expandedTip: item?.expandedTip ?? '',
  })

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const name = form.name.trim()
    if (!name) return
    onSave({
      name,
      tip: form.tip.trim(),
      brands: form.brands.split(',').map((b) => b.trim()).filter(Boolean),
      priority: form.priority,
      expandedTip: form.expandedTip.trim() || undefined,
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal-header">
          <h2 className="modal-title">{mode === 'add' ? 'Add Item' : 'Edit Item'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <label className="form-label">
            Item Name *
            <input
              className="form-input"
              value={form.name}
              onChange={set('name')}
              placeholder="e.g. Cotton onesies"
              required
              autoFocus
            />
          </label>

          <label className="form-label">
            Tip
            <textarea
              className="form-input"
              value={form.tip}
              onChange={set('tip')}
              placeholder="Short tip shown below the item name"
              rows={2}
            />
          </label>

          <label className="form-label">
            Brands <span className="form-hint">(comma-separated)</span>
            <input
              className="form-input"
              value={form.brands}
              onChange={set('brands')}
              placeholder="e.g. Brand A, Brand B"
            />
          </label>

          <label className="form-label">
            Priority
            <select className="form-input" value={form.priority} onChange={set('priority')}>
              <option value="must">Must-Have</option>
              <option value="good">Good to Have</option>
            </select>
          </label>

          <label className="form-label">
            Expanded Tip <span className="form-hint">(optional &ldquo;💡 What to look for&rdquo;)</span>
            <textarea
              className="form-input"
              value={form.expandedTip}
              onChange={set('expandedTip')}
              placeholder="Detailed buying guide shown on tap"
              rows={3}
            />
          </label>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">
              {mode === 'add' ? 'Add Item' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ItemModal
