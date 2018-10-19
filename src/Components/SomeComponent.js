import React from 'react';
import withContext from '../ContextAPI/Context_HOC'

function SomeComponent (props) {
    console.log('CONTEXT', props.context)
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