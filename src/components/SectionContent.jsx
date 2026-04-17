import Category from './Category'

function SectionContent({ section, checkedItems, onToggle }) {
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
        />
      ))}
    </>
  )
}

export default SectionContent
