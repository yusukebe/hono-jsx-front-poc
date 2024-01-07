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
        <p>Counter: {this.count}</p>
        <button onClick={() => this.increment()}>Increment</button>
      </div>
    )
  }
}
