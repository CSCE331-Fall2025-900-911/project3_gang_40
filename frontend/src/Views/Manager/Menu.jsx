// src/pages/Menu.jsx
import React, { useEffect, useState } from "react";
import "./css/Inventory.css";

export default function Menu() {
  const [drinks, setDrinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDrinkId, setSelectedDrinkId] = useState(null);
  
  // Edit modal state
  const [editingDrink, setEditingDrink] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editDrinkType, setEditDrinkType] = useState("");
  const [editIngredients, setEditIngredients] = useState([]);

  useEffect(() => {
    fetchDrinks();
  }, []);

  async function fetchDrinks() {
    setLoading(true);
    try {
      const res = await fetch("https://project3-gang-40-sjzu.onrender.com/api/inventory/drinks");
      const data = await res.json();
      setDrinks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load drinks:", err);
    } finally {
      setLoading(false);
    }
  }

  const openEditModal = (drink) => {
    setEditingDrink(drink);
    setEditName(drink.drink_name);
    setEditPrice(drink.base_price);
    setEditDrinkType(drink.drink_type);
    setEditIngredients(
      drink.ingredients?.map((i) => ({
        ingredient_id: i.ingredient_id,
        name: i.name,
        quantity: i.quantity,
        unit: i.unit,
      })) || []
    );
  };

  const addEditIngredientRow = () =>
    setEditIngredients([...editIngredients, { name: "", quantity: "", unit: "" }]);

  const removeEditIngredientRow = (index) =>
    setEditIngredients(editIngredients.filter((_, i) => i !== index));

  const saveEdit = async () => {
    if (!editingDrink) return;
    try {
      const res = await fetch(
        `https://project3-gang-40-sjzu.onrender.com/api/inventory/drinks/${editingDrink.drink_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: editName,
            price: Number(editPrice),
            drink_type: editDrinkType,
            ingredients: editIngredients.map((i) => ({
              ingredient_id: i.ingredient_id || null,
              name: i.name,
              quantity: Number(i.quantity),
              unit: i.unit,
            })),
          }),
        }
      );
      if (!res.ok) {
        const err = await res.json();
        console.error("Edit failed:", err);
        alert("Failed to save edits");
        return;
      }
      setEditingDrink(null);
      fetchDrinks();
    } catch (err) {
      console.error("Edit request failed:", err);
    }
  };

  const handleDeleteDrink = async (drinkId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this drink?");
    if (!confirmDelete) return;
    try {
      const res = await fetch(
        `https://project3-gang-40-sjzu.onrender.com/api/inventory/drinks/${drinkId}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        const err = await res.json();
        console.error("Delete failed:", err);
        alert("Failed to delete drink");
        return;
      }
      fetchDrinks();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <section className="menu-view">
      <h2>Menu</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="inventory-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {drinks.map((drink) => (
              <tr
                key={drink.drink_id}
                onClick={() => setSelectedDrinkId(drink.drink_id)}
                className={selectedDrinkId === drink.drink_id ? "selected" : ""}
              >
                <td>{drink.drink_id}</td>
                <td>{drink.drink_name}</td>
                <td>${Number(drink.base_price).toFixed(2)}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(drink);
                      }}
                      className="inventory-edit-btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteDrink(drink.drink_id);
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
      {editingDrink && (
        <div className="modal-overlay" onClick={() => setEditingDrink(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Drink</h2>
            <input className="form-input" placeholder="Drink Name" value={editName} onChange={(e) => setEditName(e.target.value)} />
            <input className="form-input" type="number" placeholder="Price" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} />
            <select className="form-select" value={editDrinkType} onChange={(e) => setEditDrinkType(e.target.value)}>
              <option value="">Select Type</option>
              <option value="Classic">Classic</option>
              <option value="Milky">Milky</option>
              <option value="Fruity">Fruity</option>
              <option value="Blended">Blended</option>
              <option value="Special">Special</option>
            </select>

            <h4>Ingredients</h4>
            {editIngredients.map((ing, idx) => (
              <div key={idx} className="ingredient-row">
                <input className="form-input" placeholder="Name" value={ing.name} onChange={(e) => {
                  const copy = [...editIngredients]; 
                  copy[idx].name = e.target.value; 
                  setEditIngredients(copy);
                }} />
                <input className="form-input" type="number" placeholder="Qty" value={ing.quantity} onChange={(e) => {
                  const copy = [...editIngredients]; 
                  copy[idx].quantity = Number(e.target.value); 
                  setEditIngredients(copy);
                }} />
                <input className="form-input" placeholder="Unit" value={ing.unit} onChange={(e) => {
                  const copy = [...editIngredients]; 
                  copy[idx].unit = e.target.value; 
                  setEditIngredients(copy);
                }} />
                <button className="remove-btn" onClick={() => removeEditIngredientRow(idx)}>-</button>
              </div>
            ))}
            <button className="add-button" onClick={addEditIngredientRow}>+ Add Ingredient</button>

            <div className="modal-actions">
              <button className="save-btn" onClick={saveEdit}>Save</button>
              <button className="cancel-btn" onClick={() => setEditingDrink(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}