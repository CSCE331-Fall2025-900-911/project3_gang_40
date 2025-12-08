import { useEffect, useState } from "react";

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
    await fetch(`http://localhost:5001/api/inventory/drinks/${editingDrink.drink_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editName,
        price: editPrice,
        ingredients: editIngredients
      }),
    });

    setEditingDrink(null);
    fetchDrinks(); // reload table
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Inventory</h1>
      <button onClick={onBack}>Exit</button>
      <div style={{ marginTop: "25px" }}>
        <h3>Add New Drink</h3>
        <input
          type="text"
          placeholder="Drink Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={{ marginLeft: "10px" }}
        />
        <div style={{ marginTop: "15px" }}>
          <h4>Ingredients</h4>
          {ingredients.map((ing, index) => (
            <div key={index} style={{ marginBottom: "8px" }}>
              <input
                placeholder="Ingredient Name"
                value={ing.name}
                onChange={(e) =>
                  handleIngredientChange(index, "name", e.target.value)
                }
              />
              <input
                type="number"
                placeholder="Qty"
                value={ing.quantity}
                onChange={(e) =>
                  handleIngredientChange(index, "quantity", e.target.value)
                }
                style={{ marginLeft: "6px", width: "80px" }}
              />
              <input
                placeholder="Unit"
                value={ing.unit}
                onChange={(e) =>
                  handleIngredientChange(index, "unit", e.target.value)
                }
                style={{ marginLeft: "6px", width: "80px" }}
              />
              <button
                onClick={() => removeIngredientRow(index)}
                style={{ marginLeft: "6px" }}
              >
                - Remove Ingredient
              </button>
            </div>
          ))}
          <button onClick={addIngredientRow}>+ Add Ingredient</button>
        </div>
        <button onClick={handleAddDrink} style={{ marginTop: "10px" }}>
          Save Drink
        </button>
      </div>

      <table
        border="1"
        width="100%"
        style={{ marginTop: "30px", borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Drink</th>
            <th>Price</th>
            <th>Ingredients</th>
          </tr>
        </thead>
        <tbody>
          {drinks.map((drink) => (
            <tr key={drink.drink_id} onDoubleClick={() => openEditModal(drink)}>
              <td>{drink.drink_id}</td>
              <td>{drink.drink_name}</td>
              <td>${Number(drink.base_price).toFixed(2)}</td>
              <td>
                {drink.ingredients?.map((ing, i) => (
                  <div key={i}>
                    {ing.name} — {ing.quantity} {ing.unit}
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editingDrink && (
        <div className="modal-overlay" onClick={() => setEditingDrink(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Drink</h2>
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Drink Name"
            />
            <input
              type="number"
              value={editPrice}
              onChange={(e) => setEditPrice(e.target.value)}
              placeholder="Price"
            />
            <h3>Ingredients</h3>
            {editIngredients.map((ing, idx) => (
              <div key={idx} className="ingredient-row">
                <input
                  value={ing.name}
                  onChange={(e) => {
                    const copy = [...editIngredients];
                    copy[idx].name = e.target.value;
                    setEditIngredients(copy);
                  }}
                />
                <input
                  type="number"
                  value={ing.quantity}
                  onChange={(e) => {
                    const copy = [...editIngredients];
                    copy[idx].quantity = e.target.value;
                    setEditIngredients(copy);
                  }}
                />
                <input
                  value={ing.unit}
                  onChange={(e) => {
                    const copy = [...editIngredients];
                    copy[idx].unit = e.target.value;
                    setEditIngredients(copy);
                  }}
                />
              </div>
            ))}
            <button onClick={saveEdit}>Save</button>
            <button onClick={() => setEditingDrink(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
export default Inventory;
