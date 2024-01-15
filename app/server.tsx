import { Hono } from 'hono'
import { jsxRenderer } from 'hono/jsx-renderer'
import Counter from './counter'

const app = new Hono()

app.get(
  '*',
  jsxRenderer(
    ({ children }) => {
      return (
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            {import.meta.env.PROD ? (
              <script type="module" src="/static/client.js"></script>
            ) : (
              <script type="module" src="/app/client.tsx"></script>
            )}
          </head>
          <body>
            <h1>Hi</h1>
            <main>{children}</main>
          </body>
        </html>
      )
    },
    {
      stream: true
    }
  )
)

app.get('/', (c) => {
  return c.render(
    <div id="target">
      <Counter />
    </div>
  )
})

export default app
