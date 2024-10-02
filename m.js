const loadFood = (foodName) => {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${foodName}`)
        .then(res => res.json())
        .then(data => {
            if (data.meals) {
                displayFood(data.meals);
            }
            else {
                NotFound();
            }
        })
        .catch(err => {
            console.error('Error fetching food:', err);
            NotFound();
        });
};

const displayFood = (meals) => {
    const foodContainer = document.getElementById('food-container');
    foodContainer.innerHTML = '';
    meals.forEach(meal => {
        const div = document.createElement('div');
        div.classList.add('col-md-4', 'mb-4');
        div.innerHTML = `
            <div class="card">
                <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
                <div class="card-body">
                    <h5 class="card-title">${meal.strMeal}</h5>
                    <p class="card-text"><strong>Type:</strong> ${meal.strCategory || 'N/A'}</p>
                    <p class="card-text"><strong>Area:</strong> ${meal.strArea || 'N/A'}</p>
                    <button class="btn btn-info" onclick="showFoodDetails(${meal.idMeal})" data-bs-toggle="modal" data-bs-target="#exampleModal">Details</button>
                </div>
            </div>
        `;
        foodContainer.appendChild(div);
    });
};

const NotFound = () => {
    const foodContainer = document.getElementById('food-container');
    foodContainer.innerHTML = '';
    const div = document.createElement('div');
    div.classList.add('col-12', 'text-center', 'mt-5');
    div.innerHTML = `
        <h3>No meals found for this search term.</h3>
        <p>Please try searching for another meal.</p>
    `;
    foodContainer.appendChild(div);
};

const showFoodDetails = (mealId) => {
    const modalBody = document.getElementById('modal-body');
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0];
            modalBody.innerHTML = `
                <img src="${meal.strMealThumb}" class="img-fluid" alt="${meal.strMeal}">
                <h5>${meal.strMeal}</h5>
                <p><strong>Type:</strong> ${meal.strCategory || 'N/A'}</p>
                <p><strong>Area:</strong> ${meal.strArea || 'N/A'}</p>
                <p>${meal.strInstructions}</p>
                <h6>Ingredients:</h6>
                <ul>
                    ${Object.keys(meal)
                    .filter(key => key.startsWith('strIngredient') && meal[key])
                    .map(key => `<li>${meal[key]}</li>`)
                    .join('')}
                </ul>
            `;
        })
        .catch(err => {
            console.error('Error fetching meal details:', err);
        });
};
document.getElementById('search-btn').addEventListener('click', () => {
    const foodName = document.getElementById('player-name').value.trim();
    if (foodName) {
        loadFood(foodName);
    }
    else {
        alert('Please enter a food name to search.');
    }
});