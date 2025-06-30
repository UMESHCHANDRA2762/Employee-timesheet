import React from 'react';
import "../styles/idleTime.css"
import 'bootstrap-icons/font/bootstrap-icons.css';

const IdleTimePopover = ({ info, onClose }) => {
    if (!info) return null;

    const { idle, entry, position } = info;
    
    const borderColorClass = entry.colorClass ? `${entry.colorClass}-border` : '';

    const popoverStyle = {
        position: 'absolute',
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 1080, 
    };

    return (
        <div className={`idle-popover-horizontal ${borderColorClass}`} style={popoverStyle}>
            
            <div className="popover-details-grid">
                
                <div className="popover-grid-item">
                    <span className="popover-value large">{idle.total}</span>
                    <span className="popover-label">Total Idle Time</span>
                </div>

                <div className="grid-separator"></div>

                <div className="popover-grid-item">
                    <span className="popover-value project-name">{entry.project}</span>
                    <span className="popover-label">{entry.task}</span>
                </div>

                <div className="grid-separator"></div>
                
                <div className="popover-grid-item nested-grid">
                     <div className="nested-item">
                         <span className="popover-value">{idle.startTime}</span>
                         <span className="popover-label">Start Time</span>
                     </div>
                     <div className="nested-item">
                         <span className="popover-value">{idle.endTime}</span>
                         <span className="popover-label">End Time</span>
                     </div>
                     <div className="nested-item">
                         <span className="popover-value">{idle.total}</span>
                         <span className="popover-label">Total Idle Time</span>
                     </div>
                </div>

                <div className="grid-separator"></div>

                <div className="popover-grid-item action-item">
                    <button className="delete-action-button">
                        <i className="bi bi-trash"></i>
                    </button>
                </div>

            </div>
        </div>
    );
};

export default IdleTimePopover;