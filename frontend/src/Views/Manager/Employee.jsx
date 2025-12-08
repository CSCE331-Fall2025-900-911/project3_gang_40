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
    
    // Edit employee state
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [editFirstName, setEditFirstName] = useState('');
    const [editLastName, setEditLastName] = useState('');
    const [editRole, setEditRole] = useState('');
    const [editEmail, setEditEmail] = useState('');

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


  //ADD EMPLOYEE
  const handleAddEmployee = async () => {
    console.log("🔵 Add Employee button clicked!");
    console.log("📋 Form data:", {
      firstName,
      lastName,
      role,
      email,
      password: password ? "***" : "(empty)"
    });
    
    if (!firstName || !lastName || !email || !password) {
      console.log("❌ Validation failed - missing fields");
      alert('All fields are required');
      return;
    }
    
    console.log("✅ Validation passed, sending POST request...");
    
    try {
      const payload = {
        first_name: firstName,
        last_name: lastName,
        role: role,
        email: email,
        password: password
      };
      
      console.log("📤 Payload being sent:", payload);
      
      const res = await fetch("https://project3-gang-40-sjzu.onrender.com/api/employees/employeeManagement", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      console.log("📥 Response status:", res.status);
      console.log("📥 Response ok:", res.ok);
      
      if (!res.ok) {
        const errorData = await res.json();
        console.log("❌ Error response:", errorData);
        throw new Error('Failed to add employee');
      }
      
      const responseData = await res.json();
      console.log("✅ Employee added successfully:", responseData);
      
      // Clear form
      setFirstName('');
      setLastName('');
      setRole('Cashier');
      setEmail('');
      setPassword('');
      
      console.log("🔄 Reloading employees...");
      // Reload employees
      fetchEmployees();
    } catch (err) {
      console.error('❌ Error adding employee:', err);
      alert('Failed to add employee');
    }
  };

  // edit employee modal
  const openEditModal = (employee) => {
    console.log('📝 Opening edit modal for employee:', employee);
    setEditingEmployee(employee);
    setEditFirstName(employee.first_name);
    setEditLastName(employee.last_name);
    setEditRole(employee.role);
    setEditEmail(employee.email);
  };

  //EDIT EMPLOYEE - update and save
  const saveEdit = async () => {
    console.log('💾 Saving employee edit...');
    console.log('Employee ID:', editingEmployee.employee_id);
    console.log('Updated data:', {
      first_name: editFirstName,
      last_name: editLastName,
      role: editRole,
      email: editEmail
    });
    
    try {
      const res = await fetch(`https://project3-gang-40-sjzu.onrender.com/api/employees/employeeManagement/${editingEmployee.employee_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: editFirstName,
          last_name: editLastName,
          role: editRole,
          email: editEmail
        })
      });
      
      console.log('📥 Edit response status:', res.status);
      
      if (!res.ok) {
        const errorData = await res.json();
        console.log('❌ Error response:', errorData);
        throw new Error('Failed to update employee');
      }
      
      const responseData = await res.json();
      console.log('✅ Employee updated successfully:', responseData);
      
      setEditingEmployee(null);
      setSelectedEmployeeId(null);
      fetchEmployees();
    } catch (err) {
      console.error('❌ Error updating employee:', err);
      alert('Failed to update employee');
    }
  };




  
  return (
    <>
      <div className="employee-page">
        <div className="employee-header">
          <h1>Employee Management</h1>
          <button onClick={onBack} className="exit-button">Exit</button>
        </div>

        {/* Add Employee inputs */}
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
            {/* Add Employee Button action */}
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              // employee row selection: stores selected employee ID
              <tr 
                key={employee.employee_id}
                onClick={() => setSelectedEmployeeId(employee.employee_id)}
                style={{
                  backgroundColor: selectedEmployeeId === employee.employee_id ? '#d6ebff' : 'white',
                  cursor: 'pointer'
                }}
              >
                <td>{employee.employee_id}</td>
                <td>{employee.first_name}</td>
                <td>{employee.last_name}</td>
                <td>{employee.role}</td>
                <td>{employee.email}</td>
                <td>
                  {/* Edit button action: opens edit modal */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(employee);
                    }}
                    className="edit-btn"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Edit Employee Modal */}
        {editingEmployee && (
          <div className="modal-overlay" onClick={() => setEditingEmployee(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>Edit Employee</h2>
              <div className="modal-form">
                <input
                  type="text"
                  placeholder="First Name"
                  value={editFirstName}
                  onChange={(e) => setEditFirstName(e.target.value)}
                  className="form-input"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={editLastName}
                  onChange={(e) => setEditLastName(e.target.value)}
                  className="form-input"
                />
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="form-select"
                >
                  <option value="Manager">Manager</option>
                  <option value="Cashier">Cashier</option>
                  <option value="Barista">Barista</option>
                </select>
                <input
                  type="email"
                  placeholder="Email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="modal-actions">
                <button onClick={saveEdit} className="save-btn">Save</button>
                <button onClick={() => setEditingEmployee(null)} className="cancel-btn">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Employee;