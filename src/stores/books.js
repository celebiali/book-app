import { defineStore } from 'pinia'
import { ref } from 'vue'
import sampleBooks from '../data/books_full.json'

const STORAGE_KEY = 'bookapp.books.v1'

export const useBooksStore = defineStore('books', () => {
  const raw = ref([])
  const books = ref([])
  let _syncRegistered = false

  function _applyRemotePayload(parsed) {
      if (!Array.isArray(parsed)) return
      const deduped = dedupeRawArray(parsed)
      raw.value = deduped
      books.value = raw.value.map(normalizeItem)
  }

  function handleStorageEvent(e) {
    if (!e) return
    if (e.key !== STORAGE_KEY) return
    if (e.newValue == null) return
      const parsed = JSON.parse(e.newValue)
      _applyRemotePayload(parsed)
    
  }

  function enableCrossTabSync() {
    if (typeof window === 'undefined') return
    if (_syncRegistered) return
    window.addEventListener('storage', handleStorageEvent)
    _syncRegistered = true
  }

  function disableCrossTabSync() {
    if (typeof window === 'undefined') return
    if (!_syncRegistered) return
    window.removeEventListener('storage', handleStorageEvent)
    _syncRegistered = false
  }

  function normalizeItem(rawItem) {
    return {
      id: rawItem.id,
      coverSrc: rawItem.image || null,
      title: rawItem.title,
      author: rawItem.author,
      pages: rawItem.total_pages || rawItem.pages || 0,
      status:
        rawItem.reading_status === 'In Progress'
          ? 'reading'
          : rawItem.reading_status === 'Completed'
          ? 'completed'
          : 'to_read',
      favorite: !!rawItem.favorite,
    }
  }

  function uiStatusToRaw(status) {
    if (!status) return 'Not Started'
    const m = String(status)
      .toLowerCase()
      .trim()
    if (m === 'reading') return 'In Progress'
    if (m === 'completed') return 'Completed'
    return 'Not Started'
  }

  function dedupeRawArray(arr) {
    const map = new Map()
    for (const item of arr) {
      const key = item && (item.id != null ? `id:${item.id}` : `t:${item.title}|a:${item.author}`)
      if (!map.has(key)) map.set(key, item)
    }
    return Array.from(map.values())
  }

  function init() {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        let parsed = JSON.parse(saved)
        if (!Array.isArray(parsed) || parsed.length < sampleBooks.length) {
          parsed = sampleBooks
          localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleBooks))
        }
        parsed = dedupeRawArray(parsed)
        raw.value = parsed
      } catch (e) {
        raw.value = dedupeRawArray(sampleBooks.slice())
      }
    } else {
      raw.value = dedupeRawArray(sampleBooks.slice())
      localStorage.setItem(STORAGE_KEY, JSON.stringify(raw.value))
    }
    books.value = raw.value.map(normalizeItem)
      enableCrossTabSync()
  }

  function reloadFromStorage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (!saved) return false
      const parsed = JSON.parse(saved)
      if (!Array.isArray(parsed)) return false
      raw.value = dedupeRawArray(parsed)
      books.value = raw.value.map(normalizeItem)
      return true
    } catch (e) {
      console.warn('reloadFromStorage failed', e)
      return false
    }
  }

  function persist() {
    raw.value = dedupeRawArray(raw.value)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(raw.value))
      books.value = raw.value.map(normalizeItem)
   
  }

  function toggleFavoriteById(id, val) {
    if (id == null) return
    const targetId = typeof id === 'string' && !isNaN(Number(id)) ? Number(id) : id
    for (let i = 0; i < raw.value.length; i++) {
      const item = raw.value[i]
      if (item && (item.id === targetId || String(item.id) === String(targetId))) {
        const newVal = !!val
        if (item.favorite !== newVal) {
          item.favorite = newVal
        }
      }
    }
      persist()
  }

  function addBook(newRaw) {
    const numericIds = raw.value.map((r) => Number(r.id) || 0)
    const nextId = numericIds.length ? Math.max(...numericIds) + 1 : 1
    const item = {
      id: nextId,
      title: newRaw.title || `Book Title ${nextId}`,
      author: newRaw.author || 'Unknown',
      total_pages: Number(newRaw.pages) || 0,
      reading_status: uiStatusToRaw(newRaw.status),
      pages_read: Number(newRaw.readPages) || 0,
      favorite: false,
      image: newRaw.image || `https://via.placeholder.com/200x280?text=Book+${nextId}`,
    }
    const exists = raw.value.find(
      (p) => p.title === item.title && p.author === item.author && Number(p.total_pages) === Number(item.total_pages)
    )
    if (exists) {
      return false
    }
    raw.value.push(item)
    persist()
    return true
  }

  function updateBook(id, changes = {}) {
    if (id == null) return false
    const targetId = typeof id === 'string' && !isNaN(Number(id)) ? Number(id) : id
    let changed = false
    for (let i = 0; i < raw.value.length; i++) {
      const item = raw.value[i]
      if (item && (item.id === targetId || String(item.id) === String(targetId))) {
        if (changes.title != null && item.title !== changes.title) {
          item.title = changes.title
          changed = true
        }
        if (changes.author != null && item.author !== changes.author) {
          item.author = changes.author
          changed = true
        }
        if (changes.total_pages != null && Number(item.total_pages) !== Number(changes.total_pages)) {
          item.total_pages = Number(changes.total_pages)
          changed = true
        }
        if (changes.reading_status != null) {
          const rawVal = uiStatusToRaw(changes.reading_status) || changes.reading_status
          if (item.reading_status !== rawVal) {
            item.reading_status = rawVal
            changed = true
          }
        }
        if (changes.pages_read != null && Number(item.pages_read) !== Number(changes.pages_read)) {
          item.pages_read = Number(changes.pages_read)
          changed = true
        }
        if (changes.image != null && item.image !== changes.image) {
          item.image = changes.image
          changed = true
        }
        if (changes.favorite != null && item.favorite !== changes.favorite) {
          item.favorite = !!changes.favorite
          changed = true
        }
      }
    }
    if (changed) {
      persist()
      return true
    }
    return false
  }

  function removeBookById(id) {
    if (id == null) return false
    const targetId = typeof id === 'string' && !isNaN(Number(id)) ? Number(id) : id
    const idx = raw.value.findIndex((it) => it && (it.id === targetId || String(it.id) === String(targetId)))
    if (idx === -1) return false
    raw.value.splice(idx, 1)
    persist()
    return true
  }

  return {
    raw,
    books,
    init,
    persist,
    enableCrossTabSync,
    disableCrossTabSync,
    reloadFromStorage,
    toggleFavoriteById,
    addBook,
    updateBook,
    removeBookById,
  }
})
