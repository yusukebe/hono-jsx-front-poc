import { Component } from '../src/front'

export class Counter extends Component {
  count = 0

  increment() {
    this.count++
    this.update()
  }

  render() {
    return (
      <div>
        <div>Counter: {this.count}</div>
        <button onClick={() => this.increment()}>Increment</button>
      </div>
    )
  }
}
