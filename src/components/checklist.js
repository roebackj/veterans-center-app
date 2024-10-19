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
   
    //Benefits to required documents logic, need to figure out how to get this to work.

    //const benefits = [
        //'GI Bill', 'Chapter 30', 'Chapter 31', 'Chapter 33 Post 911', 'Chapter 35',
        //'Fed TA', 'State TA', 'Missouri Returning Heros'
      //];
    
      //const requiredDocsMapping = {
        //'GI Bill': ['COE', 'Enrollment Manager', 'Schedule'],
        //'Chapter 30': ['COE', 'Enrollment Manager', 'Schedule'],
        //'Chapter 31': ['Enrollment Manager', 'Schedule'],
        //'Chapter 33 Post 911': ['COE', 'Enrollment Manager', 'Schedule'],
        //'Chapter 35': ['COE', 'Enrollment Manager', 'Schedule'],
        //'Fed TA': ['TAR', 'Enrollment Manager', 'Schedule'],
        //'State TA': ['Award Letter', 'Enrollment Manager', 'Schedule'],
        //'Missouri Returning Heros': ['DD214', 'Enrollment Manager', 'Schedule']
      //};

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

    return (
        <div className="secure-page">
            <div className="content">
                <img src="https://i.imgur.com/SROEj2Q.jpeg" alt="Company Logo" className="company-logo" />
                {/* Search component */}
                <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

                {filteredData.length > 0 ? (
    <table className="data-table"> {/* Add className here */}
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

                return (
                    <tr key={index}>
                        <td>{displayName}</td>
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
        </div>
    );
};

export default SecurePage;