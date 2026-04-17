import ChecklistItem from './ChecklistItem'

function Category({ category, checkedItems, onToggle, editMode, onOpenAdd, onOpenEdit, onDelete }) {
  const total = category.items.length
  const done = category.items.filter((item) => checkedItems.has(item.id)).length
  const allDone = done === total && total > 0

  return (
    <div className="category">
      <div className="category-header">
        <div className="category-title">{category.title}</div>
        <div className={`category-count${allDone ? ' done' : ''}`}>
          {done}/{total}
        </div>
      </div>

      {category.items.map((item) => (
        <ChecklistItem
          key={item.id}
          item={item}
          checked={checkedItems.has(item.id)}
          onToggle={() => onToggle(item.id)}
          editMode={editMode}
          onEdit={() => onOpenEdit(item)}
          onDelete={() => onDelete(item.id, item.name)}
        />
      ))}

      {editMode && (
        <button className="add-item-btn" onClick={onOpenAdd}>
          + Add Item
        </button>
      )}
    </div>
  )
}

export default Category
