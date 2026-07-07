/**
 * DOM-level translation engine.
 *
 * Rather than threading t() through 80+ files, we translate the rendered DOM:
 * every text node and user-visible attribute is looked up in the active
 * dictionary (English → Hindi/Marathi) and swapped in place. A MutationObserver
 * keeps route changes, re-renders and dynamically created nodes (e.g. Recharts
 * tooltips) translated. Originals are kept in WeakMaps so switching back to
 * English (or between languages) is lossless.
 *
 * Opt-out: add `data-no-i18n` to any element to leave its subtree untouched.
 */
export type Lang = 'en' | 'hi' | 'mr'

// Dictionaries are heavy (~4k entries each) — loaded on demand so the default
// English experience ships without them.
const DICTS: Record<string, Record<string, string>> = {}

async function loadDict(lang: Lang): Promise<Record<string, string> | null> {
  if (lang === 'en') return null
  if (!DICTS[lang]) {
    DICTS[lang] = lang === 'hi' ? (await import('./hi')).hi : (await import('./mr')).mr
  }
  return DICTS[lang]
}

const TRANSLATED_ATTRS = ['placeholder', 'title', 'aria-label', 'alt'] as const

const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'CODE', 'PRE'])

const origText = new WeakMap<Text, string>()
const origAttrs = new WeakMap<Element, Record<string, string>>()

let currentLang: Lang = 'en'
let observer: MutationObserver | null = null

function normalize(s: string): string {
  return s.replace(/\s+/g, ' ').trim()
}

/** Exact lookup, then a digit-templated fallback ("82 / 100" → "# / #"). */
function lookup(dict: Record<string, string>, raw: string): string | null {
  const key = normalize(raw)
  if (!key || !/[A-Za-z]/.test(key)) return null
  const direct = dict[key]
  if (direct != null) return direct
  if (/\d/.test(key)) {
    const tpl = key.replace(/\d[\d,.:%]*/g, '#')
    const hit = dict[tpl]
    if (hit != null) {
      const nums = key.match(/\d[\d,.:%]*/g) ?? []
      let i = 0
      return hit.replace(/#/g, () => nums[i++] ?? '#')
    }
  }
  return null
}

function translateTextNode(node: Text, dict: Record<string, string> | null) {
  const stored = origText.get(node)
  const source = stored ?? node.nodeValue ?? ''
  if (!normalize(source)) return

  if (!dict) {
    // Back to English
    if (stored != null && node.nodeValue !== stored) node.nodeValue = stored
    return
  }
  const translated = lookup(dict, source)
  if (translated == null) {
    if (stored != null && node.nodeValue !== stored) node.nodeValue = stored
    return
  }
  if (stored == null) origText.set(node, source)
  // Preserve surrounding whitespace so inline layouts don't collapse
  const m = source.match(/^(\s*)[\s\S]*?(\s*)$/)
  const next = (m?.[1] ?? '') + translated + (m?.[2] ?? '')
  if (node.nodeValue !== next) node.nodeValue = next
}

function translateElementAttrs(el: Element, dict: Record<string, string> | null) {
  let stored = origAttrs.get(el)
  for (const attr of TRANSLATED_ATTRS) {
    const current = el.getAttribute(attr)
    const source = stored?.[attr] ?? current
    if (source == null || !normalize(source)) continue
    if (!dict) {
      if (stored?.[attr] != null && current !== stored[attr]) el.setAttribute(attr, stored[attr])
      continue
    }
    const translated = lookup(dict, source)
    if (translated == null) {
      if (stored?.[attr] != null && current !== stored[attr]) el.setAttribute(attr, stored[attr])
      continue
    }
    if (stored?.[attr] == null) {
      stored = stored ?? {}
      stored[attr] = source
      origAttrs.set(el, stored)
    }
    if (current !== translated) el.setAttribute(attr, translated)
  }
}

function walk(root: Node, dict: Record<string, string> | null) {
  if (root.nodeType === Node.TEXT_NODE) {
    const parent = (root as Text).parentElement
    if (parent && (SKIP_TAGS.has(parent.tagName) || parent.closest('[data-no-i18n]'))) return
    translateTextNode(root as Text, dict)
    return
  }
  if (root.nodeType !== Node.ELEMENT_NODE) return
  const el = root as Element
  if (SKIP_TAGS.has(el.tagName) || el.hasAttribute('data-no-i18n')) return
  translateElementAttrs(el, dict)
  for (let child = el.firstChild; child; child = child.nextSibling) {
    walk(child, dict)
  }
}

function applyAll() {
  const dict = currentLang === 'en' ? null : DICTS[currentLang] ?? null
  // Pause the observer while we mutate, so our own writes don't re-trigger it
  observer?.disconnect()
  walk(document.body, dict)
  document.title = dict
    ? lookup(dict, document.title) ?? document.title
    : origDocTitle
  startObserver()
}

const origDocTitle = typeof document !== 'undefined' ? document.title : ''

function startObserver() {
  if (!observer) {
    observer = new MutationObserver((records) => {
      const dict = currentLang === 'en' ? null : DICTS[currentLang] ?? null
      if (!dict) return
      observer?.disconnect()
      for (const rec of records) {
        if (rec.type === 'characterData' && rec.target.nodeType === Node.TEXT_NODE) {
          // React re-set this node's text — forget the stale original
          origText.delete(rec.target as Text)
          walk(rec.target, dict)
        } else if (rec.type === 'attributes' && rec.target.nodeType === Node.ELEMENT_NODE) {
          const el = rec.target as Element
          const stored = origAttrs.get(el)
          if (stored && rec.attributeName && rec.attributeName in stored) {
            delete stored[rec.attributeName]
          }
          walk(el, dict)
        } else {
          rec.addedNodes.forEach((n) => walk(n, dict))
        }
      }
      startObserver()
    })
  }
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: [...TRANSLATED_ATTRS],
  })
}

export function setLanguage(lang: Lang): Promise<void> {
  currentLang = lang
  return loadDict(lang).then(() => {
    // A newer setLanguage call may have superseded this one while loading
    if (currentLang === lang) applyAll()
  })
}

export function getLanguage(): Lang {
  return currentLang
}
