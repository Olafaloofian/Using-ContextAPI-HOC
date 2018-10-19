# Accessing React's Context API through a Higher Order Component

*A step-by-step process of how to set up global state with Context API, and how to use it with a higher order component.* 

### Table of contents

[Introduction to Context API](https://github.com/Olafaloofian/Using-ContextAPI-HOC#introduction-to-context-api)

[Step 1: Set up Context API folder](https://github.com/Olafaloofian/Using-ContextAPI-HOC#step-1-set-up-context-api-folder)

[Step 2: Make the context provider](https://github.com/Olafaloofian/Using-ContextAPI-HOC#step-2-make-the-context-provider)

[Step 3: Create the higher order consumer component](https://github.com/Olafaloofian/Using-ContextAPI-HOC#step-3-create-the-higher-order-consumer-component)

[Step 4: Wrap App with ContextProvider](https://github.com/Olafaloofian/Using-ContextAPI-HOC#step-4-wrap-app-with-contextprovider)

[Step 5: Testing our work](https://github.com/Olafaloofian/Using-ContextAPI-HOC#step-5-testing-our-work)

[Conclusion](https://github.com/Olafaloofian/Using-ContextAPI-HOC#conclusion)

---

## Introduction to Context API
Global state management is an important tool for any React project larger than a few components or routes. While Redux works well and remains the most common solution, React recently introduced a built-in alternative called Context API. Using Context API doesn’t add any dependencies, doesn’t require middleware or packages for HTTP requests, and is usually quicker to set up. If this sounds awesome to you, keep reading to learn how to apply it in your projects!

Looking through the official documentation on Context API is helpful, and you may want to refer to them alongside this article when working with it for the first time or two ([click for React's docs](https://reactjs.org/docs/context.html)). That being said, the instructions and examples React provides can be confusing to some people. This article is meant to provide an alternative, detailed guide on how to enable Context API through the use of a higher order component.

It's important to note that Context API allows you to build multiple contexts and apply them to specific component trees. However, this tutorial will not cover creating various specialized contexts. Instead we shall make a singular global data sharing system, much like how Redux functions. If you have experience with Redux, a lot of the concepts shown here will be familiar. The main differences will be infrastructural - Context API doesn't use action handlers, payloads, or a reducer state. You may find that you prefer Context API for this very reason!

---

## Step 1: Set up Context API folder
Choose where your Context API files should live in your project’s directory. If you’re using create-react-app, the best place for it is inside the pre-built `src` folder. Navigate to the desired location and create a new folder with an obvious name (example: ‘ContextAPI’ ).

---

## Step 2: Make the context provider
Create a file called ContextProvider.js inside of your Context API folder. This is, in essence, a regular stateful React component - so it should look pretty familiar as we build it out. Let’s start coding!

```javascript
import React from 'react'

export const AppContext = React.createContext()

export default class ContextProvider extends React.Component {
  constructor() {
    super()
    this.state = {
      counter: 0,
      message: 'Hello, world!',
    }
  }

  incrementCounter = () => {
    this.setState(prevState => { return {counter: prevState.counter + 1} })
  }

  render() {
    return (
      <AppContext.Provider value={ {...this.state, incrementCounter: this.incrementCounter} }>
        {this.props.children}
      </AppContext.Provider>
    )
  }
}
```

A few things here warrant discussion before moving on. The `createContext()` statement at the top of the file is what initializes Context API for us. In the return of ContextProvider, we pass the object we want global access to inside the `value` prop of the provider. Said a different way, **this object becomes our global context**. To provide context data, state is spread into the object with `...this.state`. The global functions are then inserted as additional key/value pairs.

Other functions and lifecycle methods (for example, componentDidMount) may be used in ContextProvider class as normal, but they will not be accessible through Context API **unless they are added to the object being passed into** `value`. Lastly, we enable the ability to use the context in any component by wrapping `{this.props.children}` with `AppContext.Provider`.

---

## Step 3: Create the higher order consumer component
Next, let’s make a higher order component that will append our global state to a wrapped component’s props. In the same ContextAPI folder you created previously, make a new file called `Context_HOC.js`. This one is a lot less typing but a bit more complex:

```javascript
import React from 'react'
import { AppContext } from './ContextProvider'

export default function withContext(Component) {
  return function contextComponent(props) {
    return (
      <AppContext.Consumer>
        {context => <Component {...props} context={context} />}
      </AppContext.Consumer>
    )
  }
}
```

In the previous step, global state was configured by containing all children components inside `AppContext.Provider`. We import the same context in this step so we can set up the consumers. The `withContext` function takes a **whole component as its parameter** (there’s the higher order part of this ordeal) and returns another function that takes the **component’s props as a parameter**. This inner function is where the magic happens. 

`contextComponent` returns our `AppContext`, but this time we use `AppContext.Consumer`. This tells Context API the wrapped component is a consumer (meaning it has access to global state). Thus, we make the passed-in `Component` parameter a child of `AppContext.Consumer`, as well as passing it our global context through an arrow function. This context is assigned to a new prop on the component `context={context}`. To make sure the component retains its other props, we give them back with `{...props}`.

---

## Step 4: Wrap App with ContextProvider
Phew. Still reading? You’re a champion! There’s only one more setup step required - the whole rendered app needs to be wrapped with `<ContextProvider>`. If you're using create-react-app, head into your `index.js` file and modify it like this:

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import ContextProvider from './ContextAPI/ContextProvider'

ReactDOM.render(
  <ContextProvider>
    <App />
  </ContextProvider>,
document.getElementById('root'));
```

This grants the created context to `<App />` and all of its children.

---

## Step 5: Testing our work
Context API is now completely set up and ready to use in any component that you wish. Here’s an example of a stateless component using context to display dynamic data: 

```javascript
import React from 'react';
import withContext from 'path/to/Context_HOC'

function SomeComponent (props) {
  console.log('CONTEXT', props.context)
  // This should log the object you passed from ContextProvider.js:
  // {
  //   counter: 0,
  //   incrementCounter: function(),
  //   message: "Hello, world!"
  // }
  return (
    <div>
        <div>
          SomeComponent
        </div>
        <br/>

        <div>
          Counter: {props.context.counter}
        </div>

        <div>
          Message: {props.context.message}
        </div>

        <div>
          <button onClick={props.context.incrementCounter}>
              Count!
          </button>
        </div>
    </div>
  );
} 

export default withContext(SomeComponent)
```

Keep in mind - you need to wrap each component that uses context with your higher order component: `withContext()`. As we discussed before, this is how context is added to `props`.

If you haven't been typing your own example along the way and want to see this in action for yourself, head to [www.github.com/Olafaloofian/Using-ContextAPI-HOC](https://github.com/Olafaloofian/Using-ContextAPI-HOC). This is a repo with a working example of all the code above. You can fork, clone, then run it by typing `npm start` in the terminal once inside the project.

---

## Conclusion
There are tons of different ways to set Context API up. Most other tutorials have you use the consumer to wrap in the return of a component. This works, but what if you need to call a context method earlier (such as in a `componentDidUpdate`)? Setting up a higher order component allows you to access context anywhere in the component, not just in the return. In addition, this configuration creates an easily understood singular global context.

Context API is an amazing tool for global state management, and is worth considering adding to any project that needs a centralized pool of manipulatable data. The sky’s the limit as to what you can use it for - get creative and see what you can make!