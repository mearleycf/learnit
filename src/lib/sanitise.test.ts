import { renderAuthored, renderUserInput } from '@utils/markdown'
import { describe, expect, it } from 'vitest'

const HOSTILE = 'Hi <img src=x onerror="alert(1)"> <script>alert(2)</script>\n\n<div onclick="steal()">c</div>'

describe('renderUserInput', () => {
  it('strips script tags', async () => {
    expect(await renderUserInput(HOSTILE)).not.toContain('<script')
  })

  it('strips inline event handlers', async () => {
    const html = await renderUserInput(HOSTILE)
    expect(html).not.toContain('onerror')
    expect(html).not.toContain('onclick')
  })

  it('keeps ordinary markdown intact', async () => {
    const html = await renderUserInput('Use `const` here.\n\n- one\n- two')
    expect(html).toContain('<code>const</code>')
    expect(html).toContain('<li>one</li>')
  })

  it('keeps fenced code blocks', async () => {
    const html = await renderUserInput('```js\nconst a = 1\n```')
    expect(html).toContain('<pre')
    expect(html).toContain('const')
  })
})

describe('renderAuthored', () => {
  it('lets raw HTML through, because the source is this repo', async () => {
    // Documents the boundary rather than endorsing it: never pass form input here.
    expect(await renderAuthored('<div class="callout">note</div>')).toContain('<div class="callout">')
  })

  it('renders markdown the same way', async () => {
    expect(await renderAuthored('## Heading')).toContain('<h2')
  })
})
