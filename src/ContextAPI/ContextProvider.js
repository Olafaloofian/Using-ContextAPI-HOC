import React from 'react'

export const AppContext = React.createContext()

export default class ContextProvider extends React.Component {
	// Did you know you can shortcut the constructor and super by declaring state like this? Try it out if you haven’t!
    state = {
        contextKey1 : 'contextValue1',
        contextKey2: 'contextValue2',
        methods: {
            updateKey1: () => {
                this.setState({ contextKey1: 'newValue' })
            }
        }
    }

    render() {
        return (
            <AppContext.Provider value={this.state}>
                {this.props.children}
            </AppContext.Provider>
        )
    }
}