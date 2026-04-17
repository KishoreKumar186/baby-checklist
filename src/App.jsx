import { useState, useEffect, useCallback } from 'react'
import { checklistData } from './data/checklist'
import Header from './components/Header'
import Tabs from './components/Tabs'
import SectionContent from './components/SectionContent'
import './App.css'

const STORAGE_KEY = 'baby-checklist-checked'

function App() {
  const [activeTab, setActiveTab] = useState('hospital')
  const [checkedItems, setCheckedItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? new Set(JSON.parse(saved)) : new Set()
    } catch {
      return new Set()
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...checkedItems]))
    } catch {
      // localStorage unavailable — silently continue
    }
  }, [checkedItems])

  const toggleItem = useCallback((id) => {
    setCheckedItems((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const allItems = checklistData.flatMap((s) => s.categories.flatMap((c) => c.items))
  const totalChecked = allItems.filter((item) => checkedItems.has(item.id)).length
  const totalItems = allItems.length
  const progress = totalItems > 0 ? (totalChecked / totalItems) * 100 : 0

  const activeSection = checklistData.find((s) => s.id === activeTab)

  return (
    <div>
      <Header progress={progress} totalChecked={totalChecked} totalItems={totalItems} />
      <Tabs sections={checklistData} activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="content" role="tabpanel">
        {activeSection && (
          <SectionContent
            section={activeSection}
            checkedItems={checkedItems}
            onToggle={toggleItem}
          />
        )}
      </div>
    </div>
  )
}

export default App
