import { useState, useEffect } from 'react'
import './Employee.css'

function Employee({ onBack }) {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      fetchEmployees();
    }, []);
  
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://project3-gang-40-sjzu.onrender.com/api/employees/getAllEmployees");
        if (!res.ok) throw new Error('Failed to fetch employees');
        const data = await res.json();
        setEmployees(data);
        setError(null);
      } catch (err) {
        console.error("Failed to load employees:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

  return (
    <>
      <div className="employee-page">
        <div className="employee-header">
          <h1>Employee Management</h1>
          <button onClick={onBack} className="exit-button">Exit</button>
        </div>

        <table className="employee-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Role</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.employee_id}>
                <td>{employee.employee_id}</td>
                <td>{employee.first_name}</td>
                <td>{employee.last_name}</td>
                <td>{employee.role}</td>
                <td>{employee.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default Employee;