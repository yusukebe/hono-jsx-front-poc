import { Hono } from 'hono'
import { jsxRenderer } from 'hono/jsx-renderer'
import { Counter } from './counter'
import { renderComponent } from '../src/hydration'

const app = new Hono()

app.get(
  '*',
  jsxRenderer(({ children }) => {
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
          <div id="app">{children}</div>
        </body>
      </html>
    )
  })
)

app.get('/', (c) => {
  return c.render(renderComponent(<Counter />))
})

export default app
