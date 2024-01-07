import { Counter } from './counter'
import { hydrate } from '../src/front'

document.addEventListener('DOMContentLoaded', function () {
  hydrate(<Counter />)
})
