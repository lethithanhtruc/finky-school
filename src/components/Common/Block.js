import React from 'react';
import './Block.scss';

const Block = ({className, title, children, active=false}) => {
    return (
        <div className={"block " + (className ? className : '') + " " + (active ? 'active' : '')}>
            {
                title
                    ?
                    (
                        <div className="block-title">{title}</div>
                    )
                    :
                    null
            }
            <div className="block-content">
                {children}
            </div>
        </div>
    );
}

export default Block;
