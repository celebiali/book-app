// provide a simple localStorage polyfill in Node/Vitest environment
if (typeof localStorage === 'undefined') {
  const _g = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : null
  if (_g && !_g.localStorage) {
    let _store = {}
    _g.localStorage = {
      getItem(key) {
        return Object.prototype.hasOwnProperty.call(_store, key) ? _store[key] : null
      },
      setItem(key, value) {
        _store[key] = String(value)
      },
      removeItem(key) {
        delete _store[key]
      },
      clear() {
        _store = {}
      }
    }
  }
}

import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useBooksStore } from '../../src/stores/books'

describe('books store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('initializes with sample data when storage empty', () => {
    const store = useBooksStore()
    store.init()
    expect(store.raw.length).toBeGreaterThan(0)
    expect(Array.isArray(store.raw)).toBe(true)
  })

  it('adds a book successfully', () => {
    const store = useBooksStore()
    store.init()
    const ok = store.addBook({ title: 'Test Book', author: 'Me', pages: 123 })
    expect(ok).toBe(true)
    const found = store.raw.find((r) => r.title === 'Test Book')
    expect(found).toBeTruthy()
  })

  it('prevents adding duplicate book', () => {
    const store = useBooksStore()
    store.init()
    store.addBook({ title: 'X', author: 'Y', pages: 10 })
    const ok = store.addBook({ title: 'X', author: 'Y', pages: 10 })
    expect(ok).toBe(false)
  })

  it('updates a book', () => {
    const store = useBooksStore()
    store.init()
    const id = store.raw[0].id
    const ok = store.updateBook(id, { title: 'Updated' })
    expect(ok).toBe(true)
    const item = store.raw.find((r) => r.id === id)
    expect(item.title).toBe('Updated')
  })

  it('toggles favorite', () => {
    const store = useBooksStore()
    store.init()
    const id = store.raw[0].id
    store.toggleFavoriteById(id, true)
    const item = store.raw.find((r) => r.id === id)
    expect(item.favorite).toBe(true)
  })

  it('removes a book by id', () => {
    const store = useBooksStore()
    store.init()
    const id = store.raw[0].id
    const ok = store.removeBookById(id)
    expect(ok).toBe(true)
    const exists = store.raw.find((r) => r.id === id)
    expect(exists).toBeUndefined()
  })

  it('reloadFromStorage returns false when no storage', () => {
    const store = useBooksStore()
    const ok = store.reloadFromStorage()
    expect(ok).toBe(false)
  })
})
