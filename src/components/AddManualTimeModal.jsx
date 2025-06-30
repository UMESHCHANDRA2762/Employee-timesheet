import React, { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/AddManualTime.css";

const AddManualTimeModal = ({ show, handleClose, members, projects, tasks }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedMember, setSelectedMember] = useState(members[0]?.id || "");
    const [selectedProject, setSelectedProject] = useState("");
    const [selectedTask, setSelectedTask] = useState("");
    const [reason, setReason] = useState("");
    const [hours, setHours] = useState(1);
    const [minutes, setMinutes] = useState(0);

    const initialFocusRef = useRef(null);

    useEffect(() => {
        if (show && initialFocusRef.current) {
            initialFocusRef.current.focus();
        }
    }, [show]);

    if (!show) {
        return null;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const manualTimeEntry = {
            memberId: selectedMember,
            projectId: selectedProject,
            taskId: selectedTask,
            date: selectedDate.toISOString().split("T")[0],
            reason: reason,
            hours: hours,
            minutes: minutes,
        };
        console.log("Manual Time Entry:", manualTimeEntry);
        handleClose();
    };

    return (
        <>
            <div className="modal fade show" tabIndex="-1" style={{ display: "block" }}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content add-time-modal">
                        <div className="modal-header">
                            <h5 className="modal-title fw-semibold">Add Manual Time</h5>
                            <button type="button" className="btn-close" onClick={handleClose} aria-label="Close"></button>
                        </div>

                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label form-label-custom" htmlFor="formPeople">
                                        People <span className="required-star">*</span>
                                    </label>
                                    <select
                                        id="formPeople"
                                        className="form-select"
                                        value={selectedMember}
                                        onChange={(e) => setSelectedMember(e.target.value)}
                                        ref={initialFocusRef}
                                    >
                                        {members.map((member) => (
                                            <option key={member.id} value={member.id}>
                                                {member.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label form-label-custom" htmlFor="formProject">
                                        Project <span className="required-star">*</span>
                                    </label>
                                    <select
                                        id="formProject"
                                        className="form-select"
                                        value={selectedProject}
                                        onChange={(e) => setSelectedProject(e.target.value)}
                                    >
                                        <option value="" disabled>
                                            Select Project
                                        </option>
                                        {projects.map((project) => (
                                            <option key={project.id} value={project.id}>
                                                {project.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label form-label-custom" htmlFor="formTask">
                                        Task
                                    </label>
                                    <select
                                        id="formTask"
                                        className="form-select"
                                        value={selectedTask}
                                        onChange={(e) => setSelectedTask(e.target.value)}
                                    >
                                        <option value="" disabled>
                                            Select Task
                                        </option>
                                        {tasks.map((task) => (
                                            <option key={task.id} value={task.id}>
                                                {task.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label form-label-custom" htmlFor="formReason">
                                        Why do you want to? <span className="required-star">*</span>
                                    </label>
                                    <textarea
                                        id="formReason"
                                        className="form-control"
                                        rows="3"
                                        placeholder="Enter a reason"
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                    ></textarea>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label form-label-custom" htmlFor="formDate">
                                            Select Date <span className="required-star">*</span>
                                        </label>
                                        <div className="form-control d-flex align-items-center date-picker-container">
                                            <DatePicker
                                                id="formDate"
                                                selected={selectedDate}
                                                onChange={(date) => setSelectedDate(date)}
                                                className="date-picker-input"
                                                dateFormat="MM/dd/yyyy"
                                            />
                                            <i className="bi bi-calendar-event date-picker-icon"></i>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label form-label-custom">
                                            Time Range <span className="required-star">*</span>
                                        </label>
                                        <div className="d-flex align-items-center time-range-group"> {/* Added time-range-group for flex control */}
                                            <input
                                                type="number"
                                                className="form-control time-range-input"
                                                value={hours}
                                                onChange={(e) => setHours(Math.max(0, parseInt(e.target.value) || 0))}
                                                min="0"
                                            />
                                            <span className="text-muted time-unit-label">hours</span>
                                            <input
                                                type="number"
                                                className="form-control time-range-input"
                                                value={minutes}
                                                onChange={(e) => setMinutes(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                                                min="0"
                                                max="59"
                                            />
                                            <span className="text-muted time-unit-label">minutes</span>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-secondary" onClick={handleClose}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary btn-custom-save" onClick={handleSubmit}>
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show"></div>
        </>
    );
};

export default AddManualTimeModal;