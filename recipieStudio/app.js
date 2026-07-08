// --- Application State (LocalStorage) ---
const state = {
    favorites: JSON.parse(localStorage.getItem('favorites')) || [],
    mealPlan: JSON.parse(localStorage.getItem('mealPlan')) || { Monday:[], Tuesday:[], Wednesday:[], Thursday:[], Friday:[], Saturday:[], Sunday:[] },
    shoppingList: JSON.parse(localStorage.getItem('shoppingList')) || [],
    recentlyViewed: JSON.parse(localStorage.getItem('recentlyViewed')) || [],
    theme: localStorage.getItem('theme') || 'light',
    currentMeals: [] // Holds currently fetched search results
};

// --- DOM Elements ---
const views = document.querySelectorAll('.view-section');
const recipeContainer = document.getElementById('recipe-container');
const loadingSpinner = document.getElementById('loading-spinner');
const categoryFilter = document.getElementById('category-filter');
const modal = document.getElementById('recipe-modal');

// Timer variables
let timerInterval;
let timeRemaining = 0;

// --- Initialization ---
function init() {
    document.documentElement.setAttribute('data-theme', state.theme);
    renderPlanner();
    renderShoppingList();
    loadRecipeOfTheDay();
    renderRecentlyViewed();
    
    // Default fetch on load to show something (Beef as example)
    handleSearch(null, "beef"); 
}

// --- View Router ---
function switchView(viewId) {
    views.forEach(view => view.classList.add('hidden'));
    
    if(viewId === 'home') document.getElementById('home-view').classList.remove('hidden');
    if(viewId === 'favorites') {
        document.getElementById('home-view').classList.remove('hidden');
        displayRecipes(state.favorites);
    }
    if(viewId === 'planner') document.getElementById('planner-view').classList.remove('hidden');
    if(viewId === 'shopping') document.getElementById('shopping-view').classList.remove('hidden');
}

// --- 1. Fetching & Searching (Promises, Async/Await) ---
document.getElementById('search-form').addEventListener('submit', (e) => handleSearch(e));

async function handleSearch(e, defaultQuery = null) {
    if(e) e.preventDefault();
    const query = defaultQuery || document.getElementById('search-input').value.trim();
    if (!query) return;

    try {
        loadingSpinner.classList.remove('hidden');
        recipeContainer.innerHTML = ''; 
        
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        if (!response.ok) throw new Error("API failed");
        
        const data = await response.json();
        state.currentMeals = data.meals || [];
        applyFilters(); 
    } catch (error) {
        console.error(error);
        recipeContainer.innerHTML = `<p>Error fetching recipes. Please try again.</p>`;
    } finally {
        loadingSpinner.classList.add('hidden');
    }
}

// --- 2. Filtering (Array Methods) ---
categoryFilter.addEventListener('change', applyFilters);

function applyFilters() {
    const category = categoryFilter.value;
    let mealsToDisplay = state.currentMeals;

    if (category !== "All") {
        mealsToDisplay = state.currentMeals.filter(meal => meal.strCategory === category);
    }
    displayRecipes(mealsToDisplay);
}

// --- 3. Rendering Recipes (DOM Manipulation) ---
function displayRecipes(meals) {
    recipeContainer.innerHTML = '';
    if (meals.length === 0) {
        recipeContainer.innerHTML = '<p>No recipes found matching your criteria.</p>';
        return;
    }

    meals.forEach(meal => {
        const isFav = state.favorites.some(f => f.idMeal === meal.idMeal);
        const card = document.createElement('div');
        card.classList.add('recipe-card');
        
        // Escape single quotes in names so it doesn't break HTML onclick events
        const safeName = meal.strMeal.replace(/'/g, "\\'");

        card.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <div class="card-content">
                <h3>${meal.strMeal}</h3>
                <p><strong>Category:</strong> ${meal.strCategory || 'N/A'}</p>
                <div class="card-actions">
                    <div class="btn-group">
                        <button onclick="viewDetails('${meal.idMeal}')">View 📖</button>
                        <button onclick="toggleFavorite('${meal.idMeal}', '${safeName}', '${meal.strMealThumb}')">
                            ${isFav ? '❤️ Unfav' : '🤍 Fav'}
                        </button>
                    </div>
                    <select class="planner-select" onchange="addToPlanner(this.value, '${meal.idMeal}', '${safeName}')">
                        <option value="">+ Add to Meal Plan</option>
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                        <option value="Sunday">Sunday</option>
                    </select>
                </div>
            </div>
        `;
        recipeContainer.appendChild(card);
    });
}

// --- 4. Recipe Details & Modals ---
async function viewDetails(id) {
    try {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        const data = await res.json();
        const meal = data.meals[0];
        
        updateRecentlyViewed(meal);

        let ingredientsHTML = '';
        for(let i = 1; i <= 20; i++) {
            if(meal[`strIngredient${i}`] && meal[`strIngredient${i}`].trim() !== "") {
                ingredientsHTML += `<li>${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`;
            }
        }

        document.getElementById('modal-body').innerHTML = `
            <h2>${meal.strMeal} <button onclick="shareRecipe('${meal.idMeal}')" style="font-size:0.8rem; padding: 2px 5px; float:right;">🔗 Share</button></h2>
            <img src="${meal.strMealThumb}" style="width:100%; max-height:300px; object-fit:cover; border-radius:10px; margin: 15px 0;">
            <h3>Ingredients:</h3>
            <ul style="margin-left: 20px; margin-bottom: 15px;">${ingredientsHTML}</ul>
            <h3>Instructions:</h3>
            <p style="line-height: 1.6; margin-top: 10px;">${meal.strInstructions}</p>
        `;
        modal.classList.remove('hidden');
    } catch (err) {
        console.error(err);
    }
}

// Modal Close logic
document.querySelector('.close-btn').addEventListener('click', () => modal.classList.add('hidden'));
window.addEventListener('click', (e) => { if(e.target === modal) modal.classList.add('hidden') });

// --- 5. Favorites ---
function toggleFavorite(id, name, img) {
    const index = state.favorites.findIndex(f => f.idMeal === id);
    if (index >= 0) state.favorites.splice(index, 1);
    else state.favorites.push({ idMeal: id, strMeal: name, strMealThumb: img });
    
    localStorage.setItem('favorites', JSON.stringify(state.favorites));
    applyFilters(); 
}

// --- 6. Weekly Meal Planner ---
function addToPlanner(day, id, name) {
    if(!day) return;
    state.mealPlan[day].push({ id, name });
    localStorage.setItem('mealPlan', JSON.stringify(state.mealPlan));
    renderPlanner();
    
    // Reset the dropdown
    const dropdowns = document.querySelectorAll('.planner-select');
    dropdowns.forEach(d => d.value = "");
    
    alert(`Added ${name} to ${day}!`);
}

function removeFromPlanner(day, index) {
    state.mealPlan[day].splice(index, 1);
    localStorage.setItem('mealPlan', JSON.stringify(state.mealPlan));
    renderPlanner();
}

function renderPlanner() {
    const grid = document.getElementById('planner-grid');
    grid.innerHTML = '';
    
    Object.keys(state.mealPlan).forEach(day => {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('planner-day');
        
        let mealsHtml = state.mealPlan[day].map((meal, index) => 
            `<div class="planned-meal">
                <span onclick="viewDetails('${meal.id}')" style="cursor:pointer; color:var(--primary-color); font-weight:bold;">${meal.name}</span>
                <span style="cursor:pointer" onclick="removeFromPlanner('${day}', ${index})">❌</span>
            </div>`
        ).join('');

        dayDiv.innerHTML = `<h3>${day}</h3>${mealsHtml || '<p style="font-size:0.8em; color:gray; text-align:center;">No meals planned.</p>'}`;
        grid.appendChild(dayDiv);
    });
}

// --- 7. Auto-Generate Shopping List ---
document.getElementById('generate-shopping-btn').addEventListener('click', generateShoppingList);

async function generateShoppingList() {
    const btn = document.getElementById('generate-shopping-btn');
    btn.innerText = "Generating... ⏳";
    let allIngredients = [];

    // Flatten planned recipe IDs and remove duplicates
    const plannedIds = Object.values(state.mealPlan).flat().map(m => m.id);
    const uniqueIds = [...new Set(plannedIds)]; 

    for (let id of uniqueIds) {
        try {
            const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
            const data = await res.json();
            const meal = data.meals[0];
            
            for(let i = 1; i <= 20; i++) {
                if(meal[`strIngredient${i}`] && meal[`strIngredient${i}`].trim() !== "") {
                    allIngredients.push(`${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}`);
                }
            }
        } catch (e) { console.error("Error fetching for list"); }
    }

    state.shoppingList = allIngredients;
    localStorage.setItem('shoppingList', JSON.stringify(state.shoppingList));
    renderShoppingList();
    btn.innerText = "Generate Shopping List from Plan 🛒";
    switchView('shopping');
}

function renderShoppingList() {
    const listContainer = document.getElementById('shopping-list-container');
    listContainer.innerHTML = '';
    
    if(state.shoppingList.length === 0) {
        listContainer.innerHTML = '<p>Your list is empty. Add meals to your planner first!</p>';
        return;
    }

    state.shoppingList.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `<input type="checkbox" id="item-${index}" onchange="toggleStrike(this)"> <label for="item-${index}">${item}</label>`;
        listContainer.appendChild(li);
    });
}

function toggleStrike(checkbox) {
    checkbox.parentElement.classList.toggle('checked');
}

function clearShoppingList() {
    state.shoppingList = [];
    localStorage.removeItem('shoppingList');
    renderShoppingList();
}

// --- 8. Cooking Timer (setInterval) ---
document.getElementById('start-timer').addEventListener('click', () => {
    if(timerInterval) return; // Prevent multiple intervals
    const minutes = parseInt(document.getElementById('timer-minutes').value);
    if (!minutes || minutes <= 0) return alert("Enter valid minutes!");
    
    if(timeRemaining === 0) timeRemaining = minutes * 60;
    
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            alert("🔔 Time's up! Check your food!");
        }
    }, 1000);
});

document.getElementById('pause-timer').addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
});

document.getElementById('reset-timer').addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
    timeRemaining = 0;
    document.getElementById('timer-minutes').value = '';
    updateTimerDisplay();
});

function updateTimerDisplay() {
    const m = Math.floor(timeRemaining / 60).toString().padStart(2, '0');
    const s = (timeRemaining % 60).toString().padStart(2, '0');
    document.getElementById('timer-display').innerText = `${m}:${s}`;
}

// --- Bonus: Random & Recipe of the Day ---
document.getElementById('random-btn').addEventListener('click', async () => {
    loadingSpinner.classList.remove('hidden');
    recipeContainer.innerHTML = '';
    const res = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    const data = await res.json();
    state.currentMeals = data.meals;
    categoryFilter.value = "All";
    displayRecipes(data.meals);
    loadingSpinner.classList.add('hidden');
});

async function loadRecipeOfTheDay() {
    const today = new Date().toDateString();
    const storedROTD = JSON.parse(localStorage.getItem('rotd'));

    if (storedROTD && storedROTD.date === today) {
        renderROTD(storedROTD.meal);
    } else {
        const res = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
        const data = await res.json();
        const meal = data.meals[0];
        localStorage.setItem('rotd', JSON.stringify({ date: today, meal }));
        renderROTD(meal);
    }
}

function renderROTD(meal) {
    document.getElementById('rotd-container').innerHTML = `
        <h3 style="margin-bottom: 10px;">🌟 Recipe of the Day</h3>
        <p><strong>${meal.strMeal}</strong></p>
        <button onclick="viewDetails('${meal.idMeal}')" style="margin-top:15px;">Check it out!</button>
    `;
}

// --- Bonus: Recently Viewed ---
function updateRecentlyViewed(meal) {
    // Remove if already exists to push to front
    state.recentlyViewed = state.recentlyViewed.filter(m => m.idMeal !== meal.idMeal);
    state.recentlyViewed.unshift({ idMeal: meal.idMeal, strMeal: meal.strMeal });
    if(state.recentlyViewed.length > 5) state.recentlyViewed.pop(); // Keep only last 5
    
    localStorage.setItem('recentlyViewed', JSON.stringify(state.recentlyViewed));
    renderRecentlyViewed();
}

function renderRecentlyViewed() {
    const list = document.getElementById('recent-list');
    list.innerHTML = state.recentlyViewed.map(m => 
        `<li style="margin-bottom: 5px;"><a href="#" onclick="viewDetails('${m.idMeal}'); return false;" style="color:var(--primary-color); text-decoration:none; font-weight:bold;">${m.strMeal}</a></li>`
    ).join('');
}

// --- Bonus: Share Recipe ---
function shareRecipe(id) {
    const url = `https://www.themealdb.com/meal/${id}`;
    navigator.clipboard.writeText(`Check out this recipe! ${url}`).then(() => {
        alert('Recipe link copied to clipboard!');
    });
}

// --- Dark/Light Mode ---
document.getElementById('theme-toggle').addEventListener('click', () => {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', state.theme);
    localStorage.setItem('theme', state.theme);
});

// Run Init on Page Load
init();