import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import useOnClickOutside from '../common/useOnClickOutside';
import TopLinks from './TopLinks';
import { useLocation } from 'react-router-dom';
import { Close } from '@material-ui/icons';

const Modal = ({
  display,
  toggleModal,
  children,
  title,
  subTitle,
  links,
  className,
  noFrame
}) => {
  const ref = useRef();
  useOnClickOutside(ref, display, () => toggleModal(false));

  // lock scroll only while modal is open
  useEffect(() => {
    if (!display) return;

    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyScroll = document.body.scroll;

    document.documentElement.style.overflow = 'hidden';
    document.body.scroll = 'no';

    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow || 'auto';
      document.body.scroll = prevBodyScroll || 'yes';
    };
  }, [display]);

  const escapeModal = (event) => {
    if (event.key === 'Escape') toggleModal(false);
  };

  const showOpacity = { opacity: 1, visibility: 'visible' };
  const hideOpacity = { opacity: 0, visibility: 'hidden' };

  const noFrameStyle = { paddingRight: 0, paddingLeft: 0 };

  // Close modal when url changes (but NOT on first mount)
  const location = useLocation();
  const prevPathRef = useRef(location.pathname + location.search + location.hash);

  useEffect(() => {
    const current = location.pathname + location.search + location.hash;
    if (prevPathRef.current === current) return;

    if (display) toggleModal(false);
    prevPathRef.current = current;
  }, [location.pathname, location.search, location.hash, display, toggleModal]);

  const selectLink = (loc) => {
    if (links && links.selectLink) links.selectLink(loc);
  };

  return (
    <div
      className={`gen-modal ${className ? className : ''}`}
      style={display ? showOpacity : hideOpacity}
      onKeyDown={escapeModal}
      tabIndex={-1}
    >
      <div className="modal-box" ref={ref}>
        <div className="modal-header">
          <span className="close-modal" onClick={() => toggleModal(false)}>
            <Close />
          </span>
          <p className="modal-titles">
            <span className="modal-title">{title}</span>
            <span className="modal-subtitle">{subTitle}</span>
          </p>
          {links?.linksList && (
            <TopLinks onChoose={selectLink} selected={links.selected}>
              {links.linksList.map((link) => (
                <div key={link.loc} id={link.loc}>
                  {link.name}
                </div>
              ))}
            </TopLinks>
          )}
        </div>

        <div style={noFrame ? noFrameStyle : {}} className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  display: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  children: PropTypes.node,
  title: PropTypes.string,
  subTitle: PropTypes.string
};

export default Modal;
