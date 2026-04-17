function Tabs({ sections, activeTab, onTabChange }) {
  return (
    <div className="tabs" role="tablist">
      {sections.map((section) => (
        <div
          key={section.id}
          role="tab"
          aria-selected={activeTab === section.id}
          className={`tab${activeTab === section.id ? ' active' : ''}`}
          onClick={() => onTabChange(section.id)}
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onTabChange(section.id)}
        >
          <span className="tab-icon" aria-hidden="true">
            {section.icon}
          </span>
          {section.label}
        </div>
      ))}
    </div>
  )
}

export default Tabs
