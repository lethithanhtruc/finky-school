import React, {useEffect, useRef} from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import './CustomScrollbars.scss';

const CustomScrollbars = ({style, children, toggleScrollToTop, ...rest}) => {
    const scrollbar = useRef();

    useEffect(() => {
        scrollbar.current.scrollToTop();
    }, [toggleScrollToTop])

    return (
        <Scrollbars
            {...rest}
            style={style}
            className="scrollbars-custom"
            // renderTrackHorizontal={props => <div {...props} className="track-horizontal"/>}
            renderTrackVertical={props => <div {...props} className="track-vertical"/>}
            // renderThumbHorizontal={props => <div {...props} className="thumb-horizontal"/>}
            renderThumbVertical={props => <div {...props} className="thumb-vertical"/>}
            renderView={props => <div {...props} className="view"/>}
            ref={scrollbar}
        >
            {children}
        </Scrollbars>
    );
}

export default CustomScrollbars;
