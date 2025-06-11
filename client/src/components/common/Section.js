import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

function Section({ className, children }) {
    const [titleClass, setTitleClass] = useState('')
    const [titleStyle, setTitleStyle] = useState('')
    const title = React.Children.map(children, child => 
        child.type.displayName === 'Title' ? child : null)

    const [headerClass, setHeaderClass] = useState('')
    const header = React.Children.map(children, child => 
        child.type.displayName === 'Header' ? child : null);

    const [bodyClass, setBodyClass] = useState('')
    const body = React.Children.map(children, child => 
        child.type.displayName === 'Body' ? child : null);

    useEffect(() => {
        if(title[0]?.props) {
            setTitleClass(title[0].props.className)
            setTitleStyle(title[0].props.style)
        }

        if(header[0]?.props) {
            setHeaderClass(header[0].props.className)
        }

        if(body[0]?.props) {
            setBodyClass(body[0].props.className)
        }
    }, [title, header, body]) 
        
    const [display, setDisplay] = useState(false);

    const toggleDisplay = () => {
        setDisplay(!display);
    }

    return (
        <div
        className={`${className
            ?   `section ${className}`
            :   "section"} no-select `}>
            <div 
            style={titleStyle || {}} 
            className="section-header"
            onClick={() => toggleDisplay()}>
                <span 
                className={titleClass
                ? `section-title ${titleClass}`
                : "section-title"}>{title}</span>
                <span
                className={headerClass
                    ? `section-header-rest ${headerClass}`
                    : "section-header-rest"}>{header}</span>
            </div>
            <div 
            className={`section-content 
                ${display ? 'open' : ''} scrollbar-main`}>
                <div className={`section-content__holder
                ${bodyClass ? bodyClass : ''}`}>
                    {body}
                </div>
            </div>
        </div>
    )
}

const Title = ({ className, style, children }) => children;
Title.displayName = 'Title';
Section.Title = Title;

const Header = ({ className, children }) => children;
Header.displayName = 'Header';
Section.Header = Header;

const Body = ({ className, children }) =>  children;
Body.displayName = 'Body';
Section.Body = Body;

Section.propTypes = {
    title: PropTypes.string.isRequired
}

export default Section


