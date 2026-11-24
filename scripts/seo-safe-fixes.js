// Conservative, deterministic repairs for generated static HTML only.
// Never change song data, page titles, written content, or valid canonical targets.
export function repairSeoHtml(html, pagePath, site = 'https://kimikey-app.vercel.app') {
  if (typeof html !== 'string' || !pagePath.startsWith('/') || !pagePath.endsWith('/')) {
    return { html, fixes: [], warnings: ['Invalid page path or HTML'] }
  }
  const close = html.search(/<\/head\s*>/i)
  if (close < 0) return { html, fixes: [], warnings: ['Missing HTML head'] }
  let head = html.slice(0, close)
  const tail = html.slice(close)
  const fixes = []
  const warnings = []
  function attr(tag, name) {
    const rx = new RegExp('\\b' + name + '\\s*=\\s*["\\x27]([^"\\x27]*)["\\x27]', 'i')
    return tag.match(rx)?.[1] ?? ''
  }
  function tags(pattern) { return head.match(pattern) || [] }
  function deduplicate(pattern, kind, name) {
    const found = tags(pattern)
    if (found.length <= 1) return found
    const values = found.map(tag => attr(tag, name))
    if (!values[0] || !values.every(value => value === values[0])) {
      warnings.push('Conflicting ' + kind + ' tags: manual review')
      return found
    }
    // Each iteration removes one occurrence while keeping one original tag.
    for (let i = 1; i < found.length; i++) {
      const at = head.lastIndexOf(found[i])
      if (at >= 0) head = head.slice(0, at) + head.slice(at + found[i].length)
    }
    fixes.push('Removed identical duplicate ' + kind + ' tag(s)')
    return tags(pattern)
  }
  const descPattern = /<meta\b[^>]*\bname\s*=\s*["']description["'][^>]*>/gi
  const canonicalPattern = /<link\b[^>]*\brel\s*=\s*["']canonical["'][^>]*>/gi
  let descriptions = deduplicate(descPattern, 'description', 'content')
  let canonicals = deduplicate(canonicalPattern, 'canonical', 'href')
  const title = head.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? ''
  const noindex = tags(/<meta\b[^>]*\bname\s*=\s*["']robots["'][^>]*>/gi)
    .some(tag => /\bnoindex\b/i.test(attr(tag, 'content')))
  if (!descriptions.length) {
    const ogDescription = tags(/<meta\b[^>]*\bproperty\s*=\s*["']og:description["'][^>]*>/gi)
      .map(tag => attr(tag, 'content')).filter(Boolean)
    if (ogDescription.length === 1 && ogDescription[0].trim()) {
      head += '\n<meta name="description" content="' + ogDescription[0] + '">'
      fixes.push('Added description from existing OG description')
      descriptions = tags(descPattern)
    }
  }
  if (!canonicals.length && !noindex && title && descriptions.length === 1 &&
      !/[\s?#]/.test(pagePath) && !pagePath.includes('..')) {
    const canonical = site.replace(/\/$/, '') + pagePath
    head += '\n<link rel="canonical" href="' + canonical + '">'
    fixes.push('Added self-canonical to indexable page')
    canonicals = tags(canonicalPattern)
  }
  return { html: head + tail, fixes, warnings }
}
