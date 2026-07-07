/**
 * Client-side export helpers shared across every page.
 * No backend — everything is generated in the browser.
 */

function triggerDownload(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

function slug(s: string): string {
  return (s || 'maii-export').replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'maii-export'
}

/**
 * Export the current page as a PDF via the browser print dialog
 * (every browser offers "Save as PDF"). We stamp the document title so the
 * suggested filename is meaningful, and mark the body so print CSS can hide
 * the app chrome (sidebar / topbar / footer).
 */
export function exportPagePdf(title?: string) {
  const prevTitle = document.title
  if (title) document.title = `${title} — MAII`
  document.body.classList.add('printing')
  const cleanup = () => {
    document.body.classList.remove('printing')
    document.title = prevTitle
    window.removeEventListener('afterprint', cleanup)
  }
  window.addEventListener('afterprint', cleanup)
  window.print()
  // Fallback in case afterprint doesn't fire (some browsers)
  window.setTimeout(cleanup, 1000)
}

/** Escape a single CSV field. */
function csvField(v: string): string {
  const s = (v ?? '').replace(/\s+/g, ' ').trim()
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

/** Scrape every <table> currently rendered on the page into CSV text. */
export function scrapeTablesToCsv(): string {
  const tables = Array.from(document.querySelectorAll('main table')) as HTMLTableElement[]
  const blocks: string[] = []
  tables.forEach((table) => {
    const rows = Array.from(table.querySelectorAll('tr'))
    const lines = rows
      .map((tr) =>
        Array.from(tr.querySelectorAll('th,td'))
          .map((cell) => csvField((cell as HTMLElement).innerText))
          .join(','),
      )
      .filter((l) => l.replace(/,/g, '').trim() !== '')
    if (lines.length) blocks.push(lines.join('\n'))
  })
  return blocks.join('\n\n')
}

/**
 * Export the page's data tables to a spreadsheet. If the page has tables we
 * emit their contents as CSV (opens directly in Excel / LibreOffice); if it
 * has none we fall back to a one-row snapshot so the button still delivers a
 * file rather than silently doing nothing.
 */
export function exportPageExcel(title?: string) {
  let csv = scrapeTablesToCsv()
  if (!csv) {
    csv = `Report,${csvField(title || document.title)}\nGenerated,${new Date().toISOString()}\nNote,No tabular data on this page — see the PDF export for the full view.`
  }
  triggerDownload(`${slug(title || document.title)}.csv`, new Blob(['﻿', csv], { type: 'text/csv;charset=utf-8' }))
}

/** Download arbitrary text/HTML as a Word-openable .doc file. */
export function exportDoc(filename: string, bodyHtml: string) {
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:'Nirmala UI','Mangal',serif;font-size:12pt;line-height:1.6;">${bodyHtml}</body></html>`
  triggerDownload(`${slug(filename)}.doc`, new Blob(['﻿', html], { type: 'application/msword' }))
}

/** Copy the current page URL to the clipboard; resolves to true on success. */
export async function copyPageLink(): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(window.location.href)
    return true
  } catch {
    return false
  }
}
