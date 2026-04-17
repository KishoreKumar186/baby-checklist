import Category from './Category'

function SectionContent({ section, checkedItems, onToggle, editMode, onOpenAdd, onOpenEdit, onDelete }) {
  const sectionItems = section.categories.flatMap((c) => c.items)
  const sectionChecked = sectionItems.filter((item) => checkedItems.has(item.id)).length
  const sectionMust = sectionItems.filter((item) => item.priority === 'must').length

  return (
    <>
      <div
        className="section-intro"
        dangerouslySetInnerHTML={{ __html: section.intro }}
      />

      {section.hasSummary && (
        <div className="summary-strip">
          <div>
            <div className="summary-num">{sectionChecked}</div>
            <div className="summary-label">Checked</div>
          </div>
          <div>
            <div className="summary-num">{sectionItems.length}</div>
            <div className="summary-label">Total Items</div>
          </div>
          <div>
            <div className="summary-num">{sectionMust}</div>
            <div className="summary-label">Must-Haves</div>
          </div>
        </div>
      )}

      {section.categories.map((category) => (
        <Category
          key={category.id}
          category={category}
          checkedItems={checkedItems}
          onToggle={onToggle}
          editMode={editMode}
          onOpenAdd={() => onOpenAdd(section.id, category.id)}
          onOpenEdit={(item) => onOpenEdit(section.id, category.id, item)}
          onDelete={(itemId, itemName) => onDelete(section.id, category.id, itemId, itemName)}
        />
      ))}

      {section.hasNote && (
        <div className="note-card">
          <h3>🧡 A note for you, Kishore</h3>
          <p>
            You&apos;re doing a great job preparing. The most important thing in those first 4
            weeks isn&apos;t any product — it&apos;s rest, patience, and making sure your wife
            feels supported. Take shifts at night when possible. One fed, rested, emotionally
            supported mom is worth more than any gadget on this list.
          </p>
        </div>
      )}
    </>
  )
}

export default SectionContent
