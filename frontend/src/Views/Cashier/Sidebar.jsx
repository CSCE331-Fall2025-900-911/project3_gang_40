function Sidebar({ buttons = [], currentEmployee }) {
  return (
    <nav className='sidebar'>
      <div>
        <h2>Menu</h2>
        <ul>
          {/* takes in buttons as paramater and adds them to side bar */}
          {buttons.map((btn, i) => (
            <li key={i}>
              <button onClick={btn.onClick}>{btn.label}</button>
            </li>
          ))}
        </ul>
      </div>
      {/* shows current employee if one is signed in */}
      {currentEmployee ? (
        <div>
          Signed in as: <br />
          <strong>{currentEmployee.first_name} {currentEmployee.last_name}</strong>
          <br />({currentEmployee.role})
        </div>
      ) : <div></div>}
    </nav>
  );
}

export default Sidebar;
