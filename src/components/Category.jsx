import ChecklistItem from './ChecklistItem'

function Category({ category, checkedItems, onToggle }) {
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
        />
      ))}
    </div>
  )
}

export default Category
