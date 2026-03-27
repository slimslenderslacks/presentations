import { Marp } from '@marp-team/marp-core'

const MERMAID_SCRIPT = `<script type="module">
  import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs'
  mermaid.initialize({ startOnLoad: true, theme: 'default' })
</script>`

export default class MarpWithMermaid extends Marp {
  constructor(opts) {
    super({ html: true, ...opts })

    // Transform ```mermaid fences into <pre class="mermaid"> HTML blocks
    this.markdown.core.ruler.push('mermaid_fence', (state) => {
      let hasMermaid = false

      for (const token of state.tokens) {
        if (token.type === 'fence' && token.info.trim() === 'mermaid') {
          hasMermaid = true
          token.type = 'html_block'
          token.content = `<pre class="mermaid">\n${token.content}</pre>\n`
        }
      }

      // Inject mermaid script once if any mermaid blocks are present
      if (hasMermaid) {
        const scriptToken = new state.Token('html_block', '', 0)
        scriptToken.content = MERMAID_SCRIPT
        state.tokens.push(scriptToken)
      }
    })
  }
}
