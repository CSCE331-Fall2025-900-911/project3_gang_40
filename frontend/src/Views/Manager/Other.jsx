import React, { useEffect, useState } from "react";
import "./css/Inventory.css";

export default function Other() {
  const [supplies, setSupplies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSupplyId, setSelectedSupplyId] = useState(null);
  
  // Edit modal state
  const [editingSupply, setEditingSupply] = useState(null);
  const [editName, setEditName] = useState("");
  const [editStock, setEditStock] = useState("");

  useEffect(() => {
    fetchSupplies();
  }, []);

  async function fetchSupplies() {
    setLoading(true);
    try {
      const res = await fetch("https://project3-gang-40-sjzu.onrender.com/api/inventory/supplies");
      const data = await res.json();
      setSupplies(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load supplies:", err);
      setSupplies([]);
    } finally {
      setLoading(false);
    }
  }

  const openEditModal = (supply) => {
    setEditingSupply(supply);
    setEditName(supply.supply_name);
    setEditStock(supply.stock);
  };

  const saveEdit = async () => {
    if (!editingSupply) return;
    try {
      const res = await fetch(
        `https://project3-gang-40-sjzu.onrender.com/api/inventory/supplies/${editingSupply.supply_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: editName,
            stock: Number(editStock),
          }),
        }
      );
      if (!res.ok) {
        const err = await res.json();
        console.error("Edit failed:", err);
        alert("Failed to save edits");
        return;
      }
      setEditingSupply(null);
      fetchSupplies();
    } catch (err) {
      console.error("Edit request failed:", err);
    }
  };

  const handleDeleteSupply = async (supplyId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this supply?");
    if (!confirmDelete) return;
    try {
      const res = await fetch(
        `https://project3-gang-40-sjzu.onrender.com/api/inventory/supplies/${supplyId}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        const err = await res.json();
        console.error("Delete failed:", err);
        alert(err.error || "Failed to delete supply");
        return;
      }
      fetchSupplies();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <section className="other-view">
      <h2>Miscellaneous Supplies</h2>
      {loading ? (
        <p>Loading...</p>
      ) : supplies.length === 0 ? (
        <p>No supplies yet...</p>
      ) : (
        <table className="inventory-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Supply Name</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {supplies.map((supply) => (
              <tr
                key={supply.supply_id}
                onClick={() => setSelectedSupplyId(supply.supply_id)}
                className={selectedSupplyId === supply.supply_id ? "selected" : ""}
              >
                <td>{supply.supply_id}</td>
                <td>{supply.supply_name}</td>
                <td>{Number(supply.stock).toFixed(2)}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(supply);
                      }}
                      className="inventory-edit-btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSupply(supply.supply_id);
                      }}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Edit modal */}
      {editingSupply && (
        <div className="modal-overlay" onClick={() => setEditingSupply(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Supply</h2>
            <input 
              className="form-input" 
              placeholder="Supply Name" 
              value={editName} 
              onChange={(e) => setEditName(e.target.value)} 
            />
            <input 
              className="form-input" 
              type="number" 
              placeholder="Stock" 
              value={editStock} 
              onChange={(e) => setEditStock(e.target.value)} 
            />

            <div className="modal-actions">
              <button className="save-btn" onClick={saveEdit}>Save</button>
              <button className="cancel-btn" onClick={() => setEditingSupply(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}