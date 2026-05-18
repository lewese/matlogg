async function saveMeal() {
  const meal = {
    name: document.getElementById("name").value,
    protein: Number(document.getElementById("protein").value),
    carbs: Number(document.getElementById("carbs").value),
    fat: Number(document.getElementById("fat").value),
  };

  await fetch("/meal", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(meal),
  });

  document.getElementById("name").value = "";
  document.getElementById("protein").value = "";
  document.getElementById("carbs").value = "";
  document.getElementById("fat").value = "";

  loadMeals();
}

async function deleteMeal(id) {
  if (confirm("Är du säker på att du vill radera denna måltid?")) {
    await fetch(`/meal/${id}`, { method: "DELETE" });
    loadMeals();
  }
}

async function loadMeals() {
  const response = await fetch("/meals");
  const meals = await response.json();

  const mealList = document.getElementById("mealList");
  mealList.innerHTML = "";

  let totalKcal = 0;
  let totalProtein = 0;

  meals.forEach((meal) => {
    totalKcal += meal.kcal;
    totalProtein += meal.protein;

    const li = document.createElement("li");

    const mealText = document.createElement("span");
    const date = new Date(meal.created_at);
    mealText.textContent = `${meal.name} - ${meal.kcal} kcal - ${meal.protein}g protein - ${date.toLocaleString()}`;
    li.appendChild(mealText);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Radera";
    deleteBtn.onclick = () => deleteMeal(meal.id);
    li.appendChild(deleteBtn);

    mealList.appendChild(li);
  });

  document.getElementById("totals").textContent =
    `Totalt: ${totalKcal} kcal | ${totalProtein}g protein`;
}

loadMeals();
