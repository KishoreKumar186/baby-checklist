import { useState, useCallback } from 'react'
import { useSyncedChecklist } from './hooks/useSyncedChecklist'
import Header from './components/Header'
import Tabs from './components/Tabs'
import SectionContent from './components/SectionContent'
import ItemModal from './components/ItemModal'
import SyncPanel from './components/SyncPanel'
import './App.css'

function App() {
  const {
    sections,
    setSections,
    checkedItems,
    setCheckedItems,
    syncId,
    syncStatus,
    connectSyncId,
    isSyncEnabled,
  } = useSyncedChecklist()

  const [activeTab, setActiveTab] = useState('hospital')
  const [editMode, setEditMode] = useState(false)
  const [modal, setModal] = useState(null) // { mode, sectionId, categoryId, item }
  const [showSync, setShowSync] = useState(false)

  const toggleItem = useCallback((id) => {
    setCheckedItems((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [setCheckedItems])

  // ── CRUD ────────────────────────────────────────────────────────────

  const addItem = useCallback((sectionId, categoryId, itemData) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id !== sectionId ? s : {
          ...s,
          categories: s.categories.map((c) =>
            c.id !== categoryId ? c : {
              ...c,
              items: [...c.items, { ...itemData, id: `${sectionId}-${categoryId}-${Date.now()}` }],
            }
          ),
        }
      )
    )
  }, [setSections])

  const updateItem = useCallback((sectionId, categoryId, itemId, itemData) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id !== sectionId ? s : {
          ...s,
          categories: s.categories.map((c) =>
            c.id !== categoryId ? c : {
              ...c,
              items: c.items.map((i) => (i.id !== itemId ? i : { ...i, ...itemData })),
            }
          ),
        }
      )
    )
  }, [setSections])

  const deleteItem = useCallback((sectionId, categoryId, itemId) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id !== sectionId ? s : {
          ...s,
          categories: s.categories.map((c) =>
            c.id !== categoryId ? c : {
              ...c,
              items: c.items.filter((i) => i.id !== itemId),
            }
          ),
        }
      )
    )
    setCheckedItems((prev) => {
      const next = new Set(prev)
      next.delete(itemId)
      return next
    })
  }, [setSections, setCheckedItems])

  // ── Modal handlers ───────────────────────────────────────────────────

  const openAddModal = useCallback((sectionId, categoryId) => {
    setModal({ mode: 'add', sectionId, categoryId, item: null })
  }, [])

  const openEditModal = useCallback((sectionId, categoryId, item) => {
    setModal({ mode: 'edit', sectionId, categoryId, item })
  }, [])

  const handleModalSave = (formData) => {
    if (modal.mode === 'add') {
      addItem(modal.sectionId, modal.categoryId, formData)
    } else {
      updateItem(modal.sectionId, modal.categoryId, modal.item.id, formData)
    }
    setModal(null)
  }

  const handleDelete = useCallback((sectionId, categoryId, itemId, itemName) => {
    if (window.confirm(`Delete "${itemName}"?`)) {
      deleteItem(sectionId, categoryId, itemId)
    }
  }, [deleteItem])

  // ── Derived values ───────────────────────────────────────────────────

  const allItems = sections.flatMap((s) => s.categories.flatMap((c) => c.items))
  const totalChecked = allItems.filter((item) => checkedItems.has(item.id)).length
  const totalItems = allItems.length
  const progress = totalItems > 0 ? (totalChecked / totalItems) * 100 : 0

  const activeSection = sections.find((s) => s.id === activeTab)

  return (
    <div>
      <Header progress={progress} totalChecked={totalChecked} totalItems={totalItems} />
      <Tabs sections={sections} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="edit-bar">
        {isSyncEnabled && (
          <button className="sync-btn" onClick={() => setShowSync(true)}>
            <span className={`sync-dot sync-dot-${syncStatus}`} />
            Sync
          </button>
        )}
        <button
          className={`edit-toggle${editMode ? ' active' : ''}`}
          onClick={() => setEditMode((v) => !v)}
        >
          {editMode ? '✓ Done Editing' : '✏️ Edit Checklist'}
        </button>
      </div>

      <div className="content" role="tabpanel">
        {activeSection && (
          <SectionContent
            section={activeSection}
            checkedItems={checkedItems}
            onToggle={toggleItem}
            editMode={editMode}
            onOpenAdd={openAddModal}
            onOpenEdit={openEditModal}
            onDelete={handleDelete}
          />
        )}
      </div>

      {modal && (
        <ItemModal
          mode={modal.mode}
          item={modal.item}
          onSave={handleModalSave}
          onClose={() => setModal(null)}
        />
      )}

      {showSync && (
        <SyncPanel
          syncId={syncId}
          syncStatus={syncStatus}
          connectSyncId={connectSyncId}
          onClose={() => setShowSync(false)}
        />
      )}
    </div>
  )
}

export default App
