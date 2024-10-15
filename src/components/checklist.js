import React, { useState, useEffect } from 'react';
import Navigation from './navigation';
import Search from './searchfunction';
import './checklist.css';

const SecurePage = () => {
    const [modal, setModal] = useState('');
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const openModal = (modalName) => setModal(modalName);
    const closeModal = () => setModal('');

    // Function to fetch data from the server
    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:3000/scan');
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Load data on component mount
    useEffect(() => {
        fetchData();
    }, []);

    // Filter data based on search term
    const filteredData = data.filter((item) => {
        const fullName = item["Last Name, First Name (Legal Name)"];
        if (!fullName) return false;

        // Split and trim the names
        const [lastName, firstName] = fullName.split(',').map(name => name.trim());
        const displayName = `${firstName} ${lastName}`; // Format: First Name Last Name

        // Check if displayName starts with searchTerm
        return displayName.toLowerCase().startsWith(searchTerm.toLowerCase());
    });

    return (
        <div>
            <Navigation openModal={openModal} fetchData={fetchData} />
            <div className="content">
                <img src="https://i.imgur.com/YIChrEK.png" alt="Company Logo" />
                <h1>Welcome to the Secure Page</h1>
                <p>Click the "Scan" button to display data.</p>

                {/* Search component */}
                <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

                {filteredData.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th className="red-header">Name</th>
                                <th className="red-header">Student ID</th>
                                <th className="red-header">Benefit</th>
                                <th className="red-header">Required Docs</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((item, index) => {
                                // Split the name and reformat it
                                const fullName = item["Last Name, First Name (Legal Name)"] || 'Unknown';
                                const [lastName, firstName] = fullName.split(',').map(name => name.trim());
                                const displayName = `${firstName} ${lastName}`; // Format: First Name Last Name

                                return (
                                    <tr key={index}>
                                        <td>{displayName}</td> {/* Displaying the formatted name */}
                                        <td>{item["Student ID # (This is NOT your Social Security Number or SSO ID)"] || 'N/A'}</td>
                                        <td>{item["Benefit you plan to utilize this term (check all that apply):"]}</td>
                                        <td>Required Docs</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                ) : (
                    <p>No veterans matching search</p>
                )}
            </div>

            {/* Modals for each button */}
            {modal && (
                <div className="modal" onClick={closeModal}>
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <h2>{modal} Instructions</h2>
                        <embed src={`/path-to-your-pdfs/${modal}.pdf`} className="pdf-viewer" type="application/pdf" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default SecurePage;