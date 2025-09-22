import React from 'react';
import classes from './GreenBtn.module.css';

const GreenBtn = ({children, ...props}) => {
    return (
        <button className={classes.greenBtn} {...props}>
            {children}
        </button>
    );
};

export default GreenBtn;