import React, { useState, useEffect } from "react";
import { fetchData, logUserData } from "../services/DataService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Nutrition = () => {
  const [mealTypes, setMealTypes] = useState([]); // Meal types from the database
  const [nutritionItems, setNutritionItems] = useState([]); // Nutrition items for the selected meal type
  const [mealLog, setMealLog] = useState({
    mealType: "",
    items: [{ item: "", amount: "" }], // Initialize with one item
  });
  const [calculatedNutrition, setCalculatedNutrition] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadMealTypes = async () => {
      try {
        const data = await fetchData();
        setMealTypes(data?.mealTypes || []); // Ensure mealTypes is always an array
      } catch (error) {
        toast.error("Failed to load meal types. Please try again.");
        console.error("Error loading meal types:", error);
      }
    };
    loadMealTypes();
  }, []);

  useEffect(() => {
    const loadItems = async () => {
      if (mealLog.mealType) {
        setLoading(true);
        try {
          const data = await fetchData();
          setNutritionItems(data.nutritionItems[mealLog.mealType] || []);
        } catch (error) {
          toast.error("Failed to load nutrition items. Please try again.");
          console.error("Error loading nutrition items:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadItems();
  }, [mealLog.mealType]);

  const addNewItem = () => {
    setMealLog((prev) => ({
      ...prev,
      items: [...prev.items, { item: "", amount: "" }],
    }));
  };

  const updateItem = (index, key, value) => {
    const updatedItems = [...mealLog.items];
    updatedItems[index][key] = value;
    setMealLog({ ...mealLog, items: updatedItems });
  };

  const validateFields = () => {
    if (!mealLog.mealType) {
      toast.error("Please select a meal type.");
      return false;
    }

    for (const { item, amount } of mealLog.items) {
      if (!item || !amount || parseFloat(amount) <= 0) {
        toast.error("Please ensure all items and amounts are valid.");
        return false;
      }
    }

    return true;
  };

  const calculateNutrition = () => {
    if (!validateFields()) {
      return; // Exit early if validation fails
    }

    const nutrition = { kcals: 0, protein: 0, carbs: 0, fat: 0 };

    mealLog.items.forEach(({ item, amount }) => {
      const selectedItem = nutritionItems.find((i) => i.item === item);
      const qty = parseFloat(amount);
      if (selectedItem && qty > 0) {
        nutrition.kcals += selectedItem.kcals * qty;
        nutrition.protein += selectedItem.protein * qty;
        nutrition.carbs += selectedItem.carbs * qty;
        nutrition.fat += selectedItem.fat * qty;
      }
    });

    setCalculatedNutrition({
      kcals: nutrition.kcals.toFixed(2),
      protein: nutrition.protein.toFixed(2),
      carbs: nutrition.carbs.toFixed(2),
      fat: nutrition.fat.toFixed(2),
    });

    const email = localStorage.getItem("authToken"); // Simulate user token
    const mealEntry = { ...mealLog, nutrition, date: new Date().toLocaleDateString() };
    logUserData(email, "nutrition", mealEntry);
    toast.success("Meal logged successfully!");
  };

  return (
    <div className="p-6 bg-background text-textPrimary">
      <h2 className="text-3xl font-bold mb-6">Log a Meal</h2>
      <div className="space-y-4">
        <select
          className="w-full p-3 bg-card text-textPrimary rounded"
          value={mealLog.mealType}
          onChange={(e) =>
            setMealLog({ ...mealLog, mealType: e.target.value, items: [{ item: "", amount: "" }] })
          }
        >
          <option value="">Select a Meal Type</option>
          {mealTypes.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </select>

        {mealLog.items.map((entry, index) => (
          <div
            key={index}
            className="space-y-2 p-4 border rounded bg-black hover:shadow-lg transition-all"
          >
            <select
              className="w-full p-3 bg-card text-textPrimary rounded"
              value={entry.item}
              onChange={(e) => updateItem(index, "item", e.target.value)}
              disabled={!mealLog.mealType}
            >
              <option value="">Select an Item</option>
              {nutritionItems.map((item, i) => (
                <option key={i} value={item.item}>
                  {item.item}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Amount (e.g., 2)"
              className="w-full p-3 bg-card text-textPrimary rounded"
              value={entry.amount}
              onChange={(e) => updateItem(index, "amount", e.target.value)}
            />
          </div>
        ))}

        <button
          type="button"
          onClick={addNewItem}
          className="flex items-center justify-center w-full p-3 bg-primary text-white rounded hover:bg-primary-dark transition"
        >
          + Add Another Item
        </button>

        <button
          onClick={calculateNutrition}
          className="bg-secondary text-white p-3 rounded w-full mt-4 hover:bg-secondary-dark"
        >
          Calculate and Log Meal
        </button>
      </div>

      {calculatedNutrition && (
        <div className="mt-4 bg-card p-4 rounded shadow-md animate-fadeIn">
          <h3 className="text-lg font-bold mb-2">Nutrition Summary</h3>
          <p>Kcals: {calculatedNutrition.kcals}</p>
          <p>Protein: {calculatedNutrition.protein}g</p>
          <p>Carbs: {calculatedNutrition.carbs}g</p>
          <p>Fat: {calculatedNutrition.fat}g</p>
        </div>
      )}

      {loading && <div className="text-center mt-4 text-white">Loading...</div>}
    </div>
  );
};

export default Nutrition;
