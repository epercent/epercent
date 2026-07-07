function extractMeta(html, name) {
  const patterns = [
    new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']+)["']`, 'i'),
    new RegExp(`<meta[^>]+property=["']${name}["'][^>]+content=["']([^"']+)["']`, 'i')
  ]

  for (const pattern of patterns) {
    const match = html.match(pattern)
    if (match?.[1]) return match[1].trim()
  }

  return ''
}

function extractTitle(html) {
  return html.match(/<title[^>]*>(.*?)<\/title>/is)?.[1]?.replace(/\s+/g, ' ').trim() ?? ''
}

function extractHeadings(html) {
  return [...html.matchAll(/<h[1-3][^>]*>(.*?)<\/h[1-3]>/gis)]
    .map((m) => m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .slice(0, 12)
}

function extractLinks(html, baseUrl) {
  return [...html.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gis)]
    .map((m) => {
      try {
        return {
          href: new URL(m[1], baseUrl).href,
          label: m[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
        }
      } catch {
        return null
      }
    })
    .filter(Boolean)
}

export async function discoverWebsite(source) {
  if (!source || !String(source).startsWith('http')) {
    return {
      source,
      sourceType: 'Website',
      status: 'Skipped',
      warnings: ['Source is not a valid website URL']
    }
  }

  try {
    const response = await fetch(source, {
      headers: {
        'User-Agent': 'EOS Enterprise Discovery Engine/1.0'
      }
    })

    if (!response.ok) {
      return {
        source,
        sourceType: 'Website',
        status: 'Failed',
        confidenceScore: 15,
        warnings: [`Website returned HTTP ${response.status}`]
      }
    }

    const html = await response.text()
    const links = extractLinks(html, source)
    const internalLinks = links.filter((link) => new URL(link.href).hostname === new URL(source).hostname)
    const socialLinks = links.filter((link) =>
      /linkedin\.com|twitter\.com|x\.com|facebook\.com|instagram\.com|youtube\.com/i.test(link.href)
    )
    const contactSignals = links.filter((link) =>
      /contact|about|team|leadership|support|mailto:/i.test(`${link.href} ${link.label}`)
    )

    const emailSignals = [...html.matchAll(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi)]
      .map((m) => m[0])
      .filter((value, index, array) => array.indexOf(value) === index)
      .slice(0, 10)

    const technologySignals = [
      html.includes('wp-content') ? 'WordPress' : null,
      html.includes('Shopify') ? 'Shopify' : null,
      html.includes('gtag') || html.includes('Google Analytics') ? 'Google Analytics' : null,
      html.includes('react') || html.includes('__REACT') ? 'React signal' : null
    ].filter(Boolean)

    const title = extractTitle(html)
    const description = extractMeta(html, 'description')
    const headings = extractHeadings(html)

    return {
      source,
      sourceType: 'Website',
      status: 'Discovered',
      title,
      description,
      headings,
      navigationLinks: links.slice(0, 20),
      internalLinks: internalLinks.slice(0, 20),
      contactSignals: contactSignals.slice(0, 12),
      emailSignals,
      socialLinks: socialLinks.slice(0, 12),
      technologySignals,
      industryKeywords: headings
        .join(' ')
        .split(/\s+/)
        .filter((word) => word.length > 6)
        .slice(0, 12),
      confidenceScore: title || description ? 72 : 45,
      warnings: []
    }
  } catch (error) {
    return {
      source,
      sourceType: 'Website',
      status: 'Failed',
      confidenceScore: 10,
      warnings: [error.message]
    }
  }
}
