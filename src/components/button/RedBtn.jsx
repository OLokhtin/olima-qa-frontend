import React from 'react';
import classes from './RedBtn.module.css';

const RedBtn = ({children, ...props}) => {
    return (
        <button className={classes.redBtn} {...props}>
            {children}
        </button>
    );
};

export default RedBtn;