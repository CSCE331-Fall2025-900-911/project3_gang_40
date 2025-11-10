function EmployeeModal({ employees, selectEmployee, closeModal }) {
  return (
    <div className='modal-backdrop' onClick={closeModal}>
      <div className='modal-employees' onClick={e => e.stopPropagation()}>
        <h3>Select Employee</h3><br/>
        {employees.length > 0 ? (
          <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
            {employees.map(emp => (
              <li key={emp.employee_id} style={{ marginBottom: '8px' }}>
                <button
                  onClick={() => selectEmployee(emp)}
                  style={{ width: '80%', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                >
                  {emp.first_name} {emp.last_name} - {emp.role}
                </button>
              </li>
            ))}
          </ul>
        ) : <p>Loading employees...</p>}
        <button onClick={closeModal} style={{ width: '100px', height: '30px', cursor: 'pointer', marginTop: '30px' }}>Cancel</button>
      </div>
    </div>
  );
}

export default EmployeeModal;
