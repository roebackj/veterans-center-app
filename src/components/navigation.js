import React, { useState } from 'react';

const Navigation = () => {
    const [modal, setModal] = useState('');

    const openModal = (modalName) => setModal(modalName);
    const closeModal = () => setModal('');

    // Define instructions for each modal
    const instructions = {
        scan: "Instructions for Scan",
        coe: "Instructions for COE",
        enrollment: "Instructions for Enrollment MG",
        schedule: "Instructions for Schedule",
        dd214: "Instructions for DD214",
        tar: "Instructions for TAR",
        awardLetter: "Instructions for Award Letter",
    };

    return (
        <div className="navbar">
            <div className="container">
                <div onClick={() => {/* Scan button does nothing for now */}} className="box box-scan">Scan</div>
                <div onClick={() => openModal('coe')} className="box">COE</div>
                <div onClick={() => openModal('enrollment')} className="box">Enrollment MG</div>
                <div onClick={() => openModal('schedule')} className="box">Schedule</div>
                <div onClick={() => openModal('dd214')} className="box">DD214</div>
                <div onClick={() => openModal('tar')} className="box">TAR</div>
                <div onClick={() => openModal('awardLetter')} className="box">Award Letter</div>
            </div>

            {/* Modals for each button */}
            {modal && (
                <div className="modal" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close" onClick={closeModal}>&times;</span>
                        <h2>{modal} Instructions</h2>
                        <p>{instructions[modal]}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Navigation;