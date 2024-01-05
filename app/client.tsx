import { Counter } from './counter'
import { hydrate } from '../src/hydration'

document.addEventListener('DOMContentLoaded', function () {
  hydrate(<Counter />)
})
