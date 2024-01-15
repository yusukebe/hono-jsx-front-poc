import { useState, use } from 'hono/jsx/hooks'

export default function Counter() {
  const promise = new Promise((resolve) => setTimeout(resolve, 2000))
  use(promise)
  const [count, setCount] = useState(0)
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
}
