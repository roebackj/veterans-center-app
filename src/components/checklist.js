import React, { useState, useEffect } from 'react';
import Search from './searchfunction';
import './checklist.css';

const SecurePage = () => {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Function to fetch data from the server
    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/data/scan');
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Benefits to required documents logic
    const requiredDocsMapping = {
        'Chapter 30': ['COE', 'Enrollment Manager', 'Schedule'],
        'Chapter 31': ['Enrollment Manager', 'Schedule'],
        'Chapter 33 Post 9/11': ['COE', 'Enrollment Manager', 'Schedule'],
        'Chapter 35': ['COE', 'Enrollment Manager', 'Schedule'],
        'Fed TA': ['TAR', 'Enrollment Manager', 'Schedule'],
        'State TA': ['Award Letter', 'Enrollment Manager', 'Schedule'],
        'Missouri Returning Heroes': ['DD214', 'Enrollment Manager', 'Schedule'],
    };

    // Load data on component mount
    useEffect(() => {
        fetchData();
    }, []);

    // Filter data based on search term
    const filteredData = data.filter((item) => {
        const fullName = item["Last Name, First Name (Legal Name)"];
        if (!fullName) return false;

        const [lastName, firstName] = fullName.split(',').map(name => name.trim());
        const displayName = `${firstName} ${lastName}`;

        return displayName.toLowerCase().startsWith(searchTerm.toLowerCase());
    });

    // Clean benefit function (maps benefit name to key in requiredDocsMapping)
    const cleanBenefit = (benefit) => {
        if (benefit.includes("Missouri Returning Heroes")) {
            return "Missouri Returning Heroes";
        } else if (benefit.includes("Chapter 33 Post 9/11")) {
            return "Chapter 33 Post 9/11";
        } else if (benefit.includes("Chapter 31 VocRehab")) {
            return "Chapter 31";
        } else if (benefit.includes("State Tuition Assistance Deadline")) {
            return "State TA";
        } else if (benefit.includes("Chapter 35")) {
            return "Chapter 35";
        } else if (benefit.includes("Chapter 30 MGIB")) {
            return "Chapter 30";
        } else if (benefit.includes("Federal Tuition Assistance Deadline")) {
            return "Fed TA";
        } else {
            return benefit;  // Fallback if benefit is not mapped
        }
    };

    // Function to filter, clean, and join benefits
    const getCleanedBenefits = (benefits) => {
        if (typeof benefits !== 'string') return '';
        return benefits.split(';')
            .map(benefit => benefit.trim())  // Clean individual benefit
            .map(cleanBenefit)  // Apply the cleanBenefit function
            .filter(Boolean)  // Remove any empty strings
            .join('; ');  // Join the cleaned benefits with a semicolon and space
    };

    // Function to get required documents based on cleaned benefits
    const getRequiredDocs = (benefitString) => {
        if (typeof benefitString !== 'string') {
            return [];  // Return empty array if benefitString is invalid
        }

        const benefits = benefitString.split(';').map(benefit => benefit.trim());
        const requiredDocsSet = new Set();  // Use a Set to avoid duplicates

        benefits.forEach(benefit => {
            const cleanedBenefit = cleanBenefit(benefit);
            const docs = requiredDocsMapping[cleanedBenefit];
            if (docs) {
                docs.forEach(doc => requiredDocsSet.add(doc));  // Add docs to the set
            }
        });

        return Array.from(requiredDocsSet);  // Convert the set back to an array
    };

    // Function to toggle the checkbox and update benefit box style
    const handleCheckboxChange = (checkboxId, benefitId) => {
        const checkbox = document.getElementById(checkboxId);
        const benefitBox = document.getElementById(benefitId);
        if (checkbox.checked) {
            benefitBox.classList.add('active');
        } else {
            benefitBox.classList.remove('active');
        }
    };

    // Function to update the date when the checkbox is checked
    const updateDate = (studentID) => {
        const dateBox = document.getElementById(`date-checked-${studentID}`);
        const checkbox = document.getElementById(`date-${studentID}`);
        const currentDate = new Date().toLocaleString('default', { month: '2-digit', day: '2-digit' });

        if (checkbox.checked) {
            dateBox.textContent = currentDate;
        } else {
            dateBox.textContent = '';
        }
    };

    return (
        <div className="secure-page">
            <div className="content">
                <img src="https://i.imgur.com/SROEj2Q.jpeg" alt="Company Logo" className="company-logo" />
                {/* Search component */}
                <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

                {filteredData.length > 0 ? (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th className="red-header">Name</th>
                                <th className="red-header">Student ID</th>
                                <th className="red-header">Benefit</th>
                                <th className="red-header">Required Documents</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((item, index) => {
                                const fullName = item["Last Name, First Name (Legal Name)"] || 'Unknown';
                                const [lastName, firstName] = fullName.split(',').map(name => name.trim());
                                const displayName = `${firstName} ${lastName}`;
                                const studentID = item["Student ID # (This is NOT your Social Security Number or SSO ID)"] || 'N/A';
                                const benefits = item["Benefit you plan to utilize this term (check all that apply):"];
                                const requiredDocs = getRequiredDocs(benefits);

                                return (
                                    <tr key={index}>
                                        <td>{displayName}</td>
                                        <td>{studentID}</td>
                                        <td>{getCleanedBenefits(benefits)}</td>
                                        <td>
                                            {requiredDocs.length > 0 ? (
                                                requiredDocs.map((doc, docIndex) => (
                                                    <div key={docIndex} className="checkbox-container">
                                                        <input
                                                            type="checkbox"
                                                            id={`${doc}-${studentID}`}
                                                            onChange={() => handleCheckboxChange(`${doc}-${studentID}`, `box-${doc}-${studentID}`)}
                                                        />
                                                        <label htmlFor={`${doc}-${studentID}`}>Added</label>
                                                        <div className="benefit-box" id={`box-${doc}-${studentID}`}>
                                                            <span>{doc}</span>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div>No documents required</div>
                                            )}

                                            <div className="date-container">
                                                <input
                                                    type="checkbox"
                                                    id={`date-${studentID}`}
                                                    onChange={() => updateDate(studentID)}
                                                />
                                                <label htmlFor={`date-${studentID}`}>Date Added</label>
                                                <div className="date-box" id={`date-box-${studentID}`}>
                                                    <span className="date-checked" id={`date-checked-${studentID}`}></span>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                ) : (
                    <p>No veterans matching search</p>
                )}
            </div>
        </div>
    );
};

export default SecurePage;