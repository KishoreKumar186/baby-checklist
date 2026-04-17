import { useState, useEffect, useCallback, useRef } from 'react'
import { checklistData } from '../data/checklist'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const DATA_KEY = 'baby-checklist-data'
const CHECKED_KEY = 'baby-checklist-checked'
const SYNC_ID_KEY = 'baby-checklist-sync-id'

function readLocal() {
  try {
    const s = localStorage.getItem(DATA_KEY)
    const c = localStorage.getItem(CHECKED_KEY)
    return {
      sections: s ? JSON.parse(s) : checklistData,
      checkedItems: new Set(c ? JSON.parse(c) : []),
    }
  } catch {
    return { sections: checklistData, checkedItems: new Set() }
  }
}

async function upsertRemote(id, sections, checkedItems) {
  if (!isSupabaseConfigured || !supabase) return { error: null }
  const { error } = await supabase.from('checklists').upsert({
    id,
    sections,
    checked_items: [...checkedItems],
    updated_at: new Date().toISOString(),
  })
  return { error }
}

export function useSyncedChecklist() {
  const [sections, setSectionsRaw] = useState(() => readLocal().sections)
  const [checkedItems, setCheckedRaw] = useState(() => readLocal().checkedItems)
  const [syncId, setSyncId] = useState(() => localStorage.getItem(SYNC_ID_KEY))
  const [syncStatus, setSyncStatus] = useState('idle')

  // Keep refs up-to-date so debounced closure always reads latest state
  const sectionsRef = useRef(sections)
  const checkedRef = useRef(checkedItems)
  useEffect(() => { sectionsRef.current = sections }, [sections])
  useEffect(() => { checkedRef.current = checkedItems }, [checkedItems])

  // Debounced remote write — passes latest values directly into closure
  const debounceRef = useRef(null)
  const scheduleSync = useCallback((nextSections, nextChecked) => {
    if (!isSupabaseConfigured) return
    clearTimeout(debounceRef.current)
    setSyncStatus('syncing')
    debounceRef.current = setTimeout(async () => {
      const id = localStorage.getItem(SYNC_ID_KEY)
      if (!id) return
      const { error } = await upsertRemote(id, nextSections, nextChecked)
      setSyncStatus(error ? 'error' : 'synced')
    }, 1200)
  }, [])

  // Wrapped setters: persist locally + schedule remote sync
  const setSections = useCallback((updater) => {
    setSectionsRaw((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      try { localStorage.setItem(DATA_KEY, JSON.stringify(next)) } catch { /* */ }
      scheduleSync(next, checkedRef.current)
      return next
    })
  }, [scheduleSync])

  const setCheckedItems = useCallback((updater) => {
    setCheckedRaw((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      try { localStorage.setItem(CHECKED_KEY, JSON.stringify([...next])) } catch { /* */ }
      scheduleSync(sectionsRef.current, next)
      return next
    })
  }, [scheduleSync])

  // On mount: get/create sync ID, pull from remote
  useEffect(() => {
    if (!isSupabaseConfigured) return

    let id = localStorage.getItem(SYNC_ID_KEY)
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem(SYNC_ID_KEY, id)
      setSyncId(id)
      setSyncStatus('syncing')
      upsertRemote(id, sectionsRef.current, checkedRef.current)
        .then(({ error }) => setSyncStatus(error ? 'error' : 'synced'))
    } else {
      setSyncStatus('syncing')
      supabase
        .from('checklists')
        .select('sections, checked_items')
        .eq('id', id)
        .single()
        .then(({ data, error }) => {
          if (error || !data) {
            // Row missing — push local data up as first sync
            return upsertRemote(id, sectionsRef.current, checkedRef.current)
              .then(({ error: e }) => setSyncStatus(e ? 'error' : 'synced'))
          }
          const s = data.sections || checklistData
          const c = new Set(data.checked_items || [])
          setSectionsRaw(s)
          setCheckedRaw(c)
          try {
            localStorage.setItem(DATA_KEY, JSON.stringify(s))
            localStorage.setItem(CHECKED_KEY, JSON.stringify([...c]))
          } catch { /* */ }
          setSyncStatus('synced')
        })
        .catch(() => setSyncStatus('error'))
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Connect to another device's sync code
  const connectSyncId = useCallback(async (newId) => {
    const id = newId.trim()
    if (!id) return { success: false, error: 'Please enter a sync code.' }
    if (!isSupabaseConfigured) return { success: false, error: 'Sync is not configured.' }

    setSyncStatus('syncing')
    const { data, error } = await supabase
      .from('checklists')
      .select('sections, checked_items')
      .eq('id', id)
      .single()

    if (error || !data) {
      setSyncStatus('error')
      return { success: false, error: 'Code not found. Check it and try again.' }
    }

    const s = data.sections || checklistData
    const c = new Set(data.checked_items || [])
    localStorage.setItem(SYNC_ID_KEY, id)
    try {
      localStorage.setItem(DATA_KEY, JSON.stringify(s))
      localStorage.setItem(CHECKED_KEY, JSON.stringify([...c]))
    } catch { /* */ }
    setSyncId(id)
    setSectionsRaw(s)
    setCheckedRaw(c)
    setSyncStatus('synced')
    return { success: true }
  }, [])

  return {
    sections,
    setSections,
    checkedItems,
    setCheckedItems,
    syncId,
    syncStatus,
    connectSyncId,
    isSyncEnabled: isSupabaseConfigured,
  }
}
