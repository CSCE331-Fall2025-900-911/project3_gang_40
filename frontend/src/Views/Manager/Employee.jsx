import { useState, useEffect } from 'react'
import './Employee.css'

function Employee({ onBack }) {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Add employee form state
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [role, setRole] = useState('Cashier');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
      fetchEmployees();
    }, []);
  
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://project3-gang-40-sjzu.onrender.com/api/employees/employeeManagement");
        if (!res.ok) throw new Error('Failed to fetch employees');
        const data = await res.json();
        console.log("Employees data:", data); // Debug log
        console.log("First employee:", data[0]); // Check structure
        setEmployees(data);
        setError(null);
      } catch (err) {
        console.error("Failed to load employees:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

  const handleAddEmployee = async () => {
    if (!firstName || !lastName || !email || !password) {
      alert('All fields are required');
      return;
    }
    
    try {
      const res = await fetch("https://project3-gang-40-sjzu.onrender.com/api/employees/employeeManagement", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          role: role,
          email: email,
          password: password
        })
      });
      
      if (!res.ok) throw new Error('Failed to add employee');
      
      // Clear form
      setFirstName('');
      setLastName('');
      setRole('Cashier');
      setEmail('');
      setPassword('');
      
      // Reload employees
      fetchEmployees();
    } catch (err) {
      console.error('Error adding employee:', err);
      alert('Failed to add employee');
    }
  };

  return (
    <>
      <div className="employee-page">
        <div className="employee-header">
          <h1>Employee Management</h1>
          <button onClick={onBack} className="exit-button">Exit</button>
        </div>

        {/* Add Employee Form */}
        <div className="add-employee-section">
          <h3>Add Employee</h3>
          <div className="add-employee-form">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="form-input"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="form-input"
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="form-select"
            >
              <option value="Manager">Manager</option>
              <option value="Cashier">Cashier</option>
              <option value="Barista">Barista</option>
            </select>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
            />
            <button onClick={handleAddEmployee} className="add-button">
              Add Employee
            </button>
          </div>
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