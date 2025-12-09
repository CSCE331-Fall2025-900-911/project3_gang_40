import { useEffect, useState } from "react";
import "./Inventory.css";

function Inventory({ onBack }) {
  const [drinks, setDrinks] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [ingredients, setIngredients] = useState([
    { name: "", quantity: "", unit: "" },
  ]);
  const [editingDrink, setEditingDrink] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editIngredients, setEditIngredients] = useState([]);
  const [selectedDrinkId, setSelectedDrinkId] = useState(null);
  const [drinkType, setDrinkType] = useState("");
  const [editDrinkType, setEditDrinkType] = useState("");

  useEffect(() => {
    fetchDrinks();
  }, []);

  const fetchDrinks = async () => {
    try {
      const res = await fetch("https://project3-gang-40-sjzu.onrender.com/api/inventory/drinks");
      const data = await res.json();
      setDrinks(data);
    } catch (err) {
      console.error("Failed to load drinks:", err);
    }
  };

  const handleIngredientChange = (index, field, value) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  const addIngredientRow = () => {
    setIngredients([...ingredients, { name: "", quantity: "", unit: "" }]);
  };

  const removeIngredientRow = (index) => {
    const updated = ingredients.filter((_, i) => i !== index);
    setIngredients(updated);
  };

  const addEditIngredientRow = () => {
    setEditIngredients([
      ...editIngredients,
      { name: "", quantity: "", unit: "" }
    ]);
  };

  const removeEditIngredientRow = (index) => {
    const updated = editIngredients.filter((_, i) => i !== index);
    setEditIngredients(updated);
  };

  const handleAddDrink = async () => {
    if (!name || price === "") {
      alert("Drink name and price are required.");
      return;
    }
    for (const ing of ingredients) {
      if (!ing.name || ing.quantity === "" || !ing.unit) {
        alert("All ingredient fields must be filled.");
        return;
      }
    }
    const payload = {
      name,
      price: Number(price),
      drink_type: drinkType,
      ingredients: ingredients.map((i) => ({
        name: i.name,
        quantity: Number(i.quantity),
        unit: i.unit,
      })),
    };
    try {
      await fetch("https://project3-gang-40-sjzu.onrender.com/api/inventory/drinks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      // Reset form
      setName("");
      setPrice("");
      setDrinkType("");
      setIngredients([{ name: "", quantity: "", unit: "" }]);
      // Reload drinks
      fetchDrinks();
    } catch (err) {
      console.error("Failed to add drink:", err);
    }
  };

  const openEditModal = (drink) => {
    setEditingDrink(drink);
    setEditName(drink.drink_name);
    setEditPrice(drink.base_price);
    setEditDrinkType(drink.drink_type);
    setEditIngredients(
      drink.ingredients.map(i => ({
        ingredient_id: i.ingredient_id,
        name: i.name,
        quantity: i.quantity,
        unit: i.unit
      })) 
    );
  };

  const saveEdit = async () => {
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
        {
          method: "DELETE",
        }
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
    <div className="inventory-page">
      <div className="inventory-header">
        <h1>Inventory Management</h1>
        <button onClick={onBack} className="exit-button">Exit</button>
      </div>
      <div className="add-drink-section">
        <h3>Add New Drink</h3>
        <div className="add-drink-form">
          <input className="form-input" placeholder="Drink Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="form-input" type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
          <select className="form-select" value={drinkType} onChange={(e) => setDrinkType(e.target.value)}>
            <option value="">Select Type</option>
            <option value="Classic">Classic</option>
            <option value="Milky">Milky</option>
            <option value="Fruity">Fruity</option>
            <option value="Blended">Blended</option>
            <option value="Special">Special</option>
          </select>
          <button className="add-button" onClick={handleAddDrink}>Save Drink</button>
        </div>
        <h4>Ingredients</h4>
        {ingredients.map((ing, idx) => (
          <div key={idx} className="ingredient-row">
            <input className="form-input" placeholder="Name" value={ing.name} onChange={(e) => handleIngredientChange(idx, "name", e.target.value)} />
            <input className="form-input" type="number" placeholder="Qty" value={ing.quantity} onChange={(e) => handleIngredientChange(idx, "quantity", e.target.value)} />
            <input className="form-input" placeholder="Unit" value={ing.unit} onChange={(e) => handleIngredientChange(idx, "unit", e.target.value)} />
            <button className="remove-btn" onClick={() => removeIngredientRow(idx)}>-</button>
          </div>
        ))}
        <button className="add-button" onClick={addIngredientRow}>+ Add Ingredient</button>
      </div>
      <table className="inventory-table">
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Price</th><th>Type</th><th>Ingredients</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {drinks.map((drink) => (
            <tr key={drink.drink_id} onClick={() => setSelectedDrinkId(drink.drink_id)} style={{ backgroundColor: selectedDrinkId === drink.drink_id ? "#d6ebff" : "white" }}>
              <td>{drink.drink_id}</td>
              <td>{drink.drink_name}</td>
              <td>${Number(drink.base_price).toFixed(2)}</td>
              <td>{drink.drink_type}</td>
              <td>{drink.ingredients?.map((i, idx) => <div key={idx}>{i.name} — {i.quantity} {i.unit}</div>)}</td>
              <td>
                <div className="action-buttons">
                  <button className="inventory-edit-btn" onClick={(e) => { e.stopPropagation(); openEditModal(drink); }}>Edit</button>
                  <button className="delete-btn" onClick={(e) => { e.stopPropagation(); handleDeleteDrink(drink.drink_id); }}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editingDrink && (
        <div className="modal-overlay" onClick={() => setEditingDrink(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Drink</h2>

            <input className="form-input" value={editName} onChange={(e) => setEditName(e.target.value)} />
            <input className="form-input" type="number" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} />

            {editIngredients.map((ing, idx) => (
              <div key={idx} className="ingredient-row">
                <input className="form-input" value={ing.name} onChange={(e) => {
                  const copy = [...editIngredients];
                  copy[idx].name = e.target.value;
                  setEditIngredients(copy);
                }} />
                <input className="form-input" type="number" value={ing.quantity} onChange={(e) => {
                  const copy = [...editIngredients];
                  copy[idx].quantity = Number(e.target.value);
                  setEditIngredients(copy);
                }} />
                <input className="form-input" value={ing.unit} onChange={(e) => {
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
    </div>
  );
}
export default Inventory;
