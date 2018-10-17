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
                contextKey1: {props.context.contextKey1}
            </div>

            <div>
                contextKey2: {props.context.contextKey2}
            </div>
            
            <div>
                <button onClick={props.context.methods.updateKey1}>
                    Update Context
                </button>
            </div>
        </div>
    );
}

export default withContext(SomeComponent)