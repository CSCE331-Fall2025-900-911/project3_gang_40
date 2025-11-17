function Sidebar({ buttons = [], currentEmployee }) {
  return (
    <nav className='sidebar'>
      <div>
        <h2>Menu</h2>
        <ul>
          {buttons.map((btn, i) => (
            <li key={i}>
              <button onClick={btn.onClick}>{btn.label}</button>
            </li>
          ))}
        </ul>
      </div>
      {currentEmployee ? (
        <div>
          Signed in as: <br />
          <strong>{currentEmployee.firstName} {currentEmployee.lastName}</strong>
          <br />({currentEmployee.role})
        </div>
      ) : <div>No employee signed in</div>}
    </nav>
  );
}

export default Sidebar;
