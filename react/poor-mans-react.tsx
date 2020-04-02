function createElement(tag, props, ...children) {
  if (typeof tag === 'function') {
    try {
      return tag(props)
    } catch (err) {
      err.promise.then(data => {
        promiseCache.set(err.key, data)
        rerender()
      })
      return {
        tag: 'div',
        props: {
          children: ['Loading...']
        }
      }
    }
  }
  const element = {
    tag,
    props: {
      ...props,
      children
    }
  }
  return element
}

const React = {
  createElement
}

const states = []
let stateCursor = 0

function useState(initialState) {
  const stateIndex = stateCursor
  states[stateIndex] = states[stateIndex] || initialState
  function setState(newState) {
    states[stateIndex] = newState
    rerender()
  }
  stateCursor++
  return [states[stateIndex], setState]
}

const promiseCache = new Map()
function createResource(promise, key) {
  if (promiseCache.has(key)) {
    return promiseCache.get(key)
  }
  throw {promise, key}
}

function App() {
  const [name, setName] = useState('John')
  const [count, setCount] = useState(0)
  const photoUrl = createResource(
                     fetch('https://dog.ceo/api/breeds/image/random')
                       .then(response => response.json())
                       .then(json => json.message),
                     'dogPhoto'
                   )
  return (
    <div foo="bar">
      <input type="text" placeholder="Name" onchange={event => setName(event.target.value)} />
      <h1>Hello, {name}</h1>
      <p>Count: {count}</p>
      <button onclick={() => setCount(count + 1)}>+</button>
      <button onclick={() => setCount(count - 1)}>-</button>
      <br />
      <img src={photoUrl} />
    </div>
  )
}

function render(reactElement, container) {
  if (['string', 'number'].includes(typeof reactElement)) {
    const textNode = document.createTextNode(String(reactElement))
    container.appendChild(textNode)
    return
  }
  const domElement = document.createElement(reactElement.tag)
  if (reactElement.props) {
    Object.keys(reactElement.props)
          .filter(prop => prop !== 'children')
          .forEach(prop => domElement[prop] = reactElement.props[prop])
  }
  if (reactElement.props.children) {
    reactElement.props.children.forEach(child => render(child, domElement))
  }
  container.appendChild(domElement)
}

function rerender() {
  stateCursor = 0
  const root = document.querySelector('#app')
  root.firstChild.remove()
  render(<App />, root)
}

render(<App />, document.querySelector('#app'))