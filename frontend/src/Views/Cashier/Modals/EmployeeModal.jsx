// Modal component for selecting an employee
function EmployeeModal({ employees, selectEmployee, closeModal }) {
  return (
    <div className='modal-backdrop' onClick={closeModal}>
      <div className='modal-employees' onClick={e => e.stopPropagation()}>
        <h3>Select Employee</h3><br/>
        {/* If employees are loaded, display list; otherwise show loading message */}
        {employees.length > 0 ? (
          <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
            {employees.map(emp => (
              <li key={emp.employeeId} style={{ marginBottom: '8px' }}>
                {/* Button to select an employee */}
                <button
                  onClick={() => selectEmployee(emp)}
                  style={{ width: '80%', padding: '4px', borderRadius: '8px', cursor: 'pointer' }}
                >
                  {/* Display employee name and role */}
                  {emp.firstName} {emp.lastName} - {emp.role}
                </button>
              </li>
            ))}
          </ul>
        ) : <p>Loading employees...</p>}
        {/* Cancel button to close modal */}
        <button onClick={closeModal} style={{ width: '100px', height: '30px', cursor: 'pointer', marginTop: '10px' }}>Cancel</button>
      </div>
    </div>
  );
}

export default EmployeeModal;
