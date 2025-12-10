// src/pages/Ingredients.jsx
import React, { useEffect, useState } from "react";
import "./css/Inventory.css";

export default function Ingredients() {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIngredientId, setSelectedIngredientId] = useState(null);
  
  // Edit modal state
  const [editingIngredient, setEditingIngredient] = useState(null);
  const [editName, setEditName] = useState("");
  const [editStockQuantity, setEditStockQuantity] = useState("");
  const [editUnit, setEditUnit] = useState("");

  useEffect(() => {
    fetchIngredients();
  }, []);

  async function fetchIngredients() {
    setLoading(true);
    try {
      const res = await fetch("https://project3-gang-40-sjzu.onrender.com/api/inventory/ingredients");
      const data = await res.json();
      setIngredients(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load ingredients:", err);
      setIngredients([]);
    } finally {
      setLoading(false);
    }
  }

  const openEditModal = (ingredient) => {
    setEditingIngredient(ingredient);
    setEditName(ingredient.ingredient_name);
    setEditStockQuantity(ingredient.stock_quantity);
    setEditUnit(ingredient.unit);
  };

  const saveEdit = async () => {
    if (!editingIngredient) return;
    try {
      const res = await fetch(
        `https://project3-gang-40-sjzu.onrender.com/api/inventory/ingredients/${editingIngredient.ingredient_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: editName,
            stock_quantity: Number(editStockQuantity),
            unit: editUnit,
          }),
        }
      );
      if (!res.ok) {
        const err = await res.json();
        console.error("Edit failed:", err);
        alert("Failed to save edits");
        return;
      }
      setEditingIngredient(null);
      fetchIngredients();
    } catch (err) {
      console.error("Edit request failed:", err);
    }
  };

  const handleDeleteIngredient = async (ingredientId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this ingredient?");
    if (!confirmDelete) return;
    try {
      const res = await fetch(
        `https://project3-gang-40-sjzu.onrender.com/api/inventory/ingredients/${ingredientId}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        const err = await res.json();
        console.error("Delete failed:", err);
        alert(err.error || "Failed to delete ingredient");
        return;
      }
      fetchIngredients();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <section className="ingredients-view">
      <h2>Ingredients</h2>
      {loading ? (
        <p>Loading...</p>
      ) : ingredients.length === 0 ? (
        <p>No ingredients yet — add some from the All page.</p>
      ) : (
        <table className="inventory-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Stock Quantity</th>
              <th>Unit</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {ingredients.map((ingredient) => (
              <tr
                key={ingredient.ingredient_id}
                onClick={() => setSelectedIngredientId(ingredient.ingredient_id)}
                className={selectedIngredientId === ingredient.ingredient_id ? "selected" : ""}
              >
                <td>{ingredient.ingredient_id}</td>
                <td>{ingredient.ingredient_name}</td>
                <td>{Number(ingredient.stock_quantity).toFixed(2)}</td>
                <td>{ingredient.unit}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(ingredient);
                      }}
                      className="inventory-edit-btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteIngredient(ingredient.ingredient_id);
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
      {editingIngredient && (
        <div className="modal-overlay" onClick={() => setEditingIngredient(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Ingredient</h2>
            <input 
              className="form-input" 
              placeholder="Ingredient Name" 
              value={editName} 
              onChange={(e) => setEditName(e.target.value)} 
            />
            <input 
              className="form-input" 
              type="number" 
              placeholder="Stock Quantity" 
              value={editStockQuantity} 
              onChange={(e) => setEditStockQuantity(e.target.value)} 
            />
            <input 
              className="form-input" 
              placeholder="Unit (e.g., oz, ml, g)" 
              value={editUnit} 
              onChange={(e) => setEditUnit(e.target.value)} 
            />

            <div className="modal-actions">
              <button className="save-btn" onClick={saveEdit}>Save</button>
              <button className="cancel-btn" onClick={() => setEditingIngredient(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}