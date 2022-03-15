import React from "react";
import Alert from 'react-bootstrap/Alert';

const AlertBox = (props) => {
    
    return (
            <Alert variant={props.variant} onClose={props.onHide} dismissible show={props.show}>
                    <Alert.Heading>{props.heading}</Alert.Heading>
                    <p>
                    {props.message}
                    </p>
            </Alert>
    )
}

export default AlertBox;