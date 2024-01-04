import './style.css'
import { Counter } from './counter'
import { render } from '../src/front'

render(<Counter />, document.querySelector<HTMLElement>('#app')!)
