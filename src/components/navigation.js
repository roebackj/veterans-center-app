import React from 'react';

const Navigation = ({ openModal, fetchData }) => {
    return (
        <div className="navbar">
            <div className="container">
                <div onClick={() => { fetchData(); openModal('scan'); }} className="box box-scan">Scan</div>
                <div onClick={() => openModal('coe')} className="box">COE</div>
                <div onClick={() => openModal('enrollment')} className="box">Enrollment MG</div>
                <div onClick={() => openModal('schedule')} className="box">Schedule</div>
                <div onClick={() => openModal('dd214')} className="box">DD214</div>
                <div onClick={() => openModal('tar')} className="box">TAR</div>
                <div onClick={() => openModal('awardLetter')} className="box">Award Letter</div>
            </div>
        </div>
    );
};

export default Navigation;