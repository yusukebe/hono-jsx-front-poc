import Counter from './counter'
import { render } from 'hono/jsx/dom'

document.addEventListener('DOMContentLoaded', function () {
  const target = document.getElementById('target')
  render(<Counter />, target)
})
