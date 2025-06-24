import React from 'react';
import './reports.css'; // Importing the CSS file

const Reports = () => {
    return (
        <div style={{ padding: '20px' }}>
            <h1>Reports</h1>
            <p>Select a report to view detailed information:</p>
            <ul>
                <li>
                    <a href="/reports/sales">Sales Report</a>
                </li>
                <li>
                    <a href="/reports/inventory">Inventory Report</a>
                </li>
                <li>
                    <a href="/reports/financial">Financial Report</a>
                </li>
                <li>
                    <a href="/reports/customer">Customer Report</a>
                </li>
            </ul>
        </div>
    );
};

export default Reports;