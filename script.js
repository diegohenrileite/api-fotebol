document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const resultsList = document.getElementById('results-list');
    const suggestionsContainer = document.getElementById('suggestions-container');

    const popularRecipes = [
        "Pizza", "Pasta", "Sushi", "Burger", "Tacos", "Lasagna", "Salad", "Soup",
        "Pancakes", "Waffles", "Spaghetti", "Curry", "Steak", "Chicken", "Fish",
        "Tiramisu", "Brownies", "Cheesecake", "Muffin", "Omelette"
    ].sort();

    const searchRecipes = async () => {
        const searchTerm = searchInput.value;
        if (searchTerm.trim() === '') {
            resultsList.innerHTML = '<p>Por favor, digite um nome de prato para buscar.</p>';
            return;
        }

        resultsList.innerHTML = '<p>Buscando receitas...</p>';
        const apiUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`Erro na API: ${response.status}`);
            }
            const data = await response.json();

            if (data.meals) {
                displayRecipes(data.meals);
            } else {
                resultsList.innerHTML = '<p>Nenhuma receita encontrada. Tente outro nome.</p>';
            }
        } catch (error) {
            console.error('Falha ao buscar as receitas:', error);
            resultsList.innerHTML = `<p>Não foi possível buscar as receitas. ${error.message}</p>`;
        }
    };

    const displayRecipes = (meals) => {
        resultsList.innerHTML = '';
        meals.forEach(meal => {
            const recipeCard = document.createElement('div');
            recipeCard.classList.add('recipe-card');
            recipeCard.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <h3>${meal.strMeal}</h3>
            `;
            resultsList.appendChild(recipeCard);
        });
    };

    const displaySuggestions = (suggestions) => {
        suggestionsContainer.innerHTML = '';
        if (suggestions.length === 0) {
            return;
        }
        
        const ul = document.createElement('ul');
        ul.classList.add('suggestions-list');
        suggestions.forEach(name => {
            const li = document.createElement('li');
            li.classList.add('suggestion-item');
            li.textContent = name;
            li.addEventListener('click', () => {
                searchInput.value = name;
                suggestionsContainer.innerHTML = '';
                searchButton.click();
            });
            ul.appendChild(li);
        });
        suggestionsContainer.appendChild(ul);
    };

    searchInput.addEventListener('input', () => {
        const term = searchInput.value.toLowerCase();
        if (term.length === 0) {
            suggestionsContainer.innerHTML = '';
            return;
        }
        const filteredSuggestions = popularRecipes.filter(name => 
            name.toLowerCase().includes(term)
        );
        displaySuggestions(filteredSuggestions);
    });

    document.addEventListener('click', (e) => {
        if (!suggestionsContainer.contains(e.target) && e.target !== searchInput) {
            suggestionsContainer.innerHTML = '';
        }
    });

    searchButton.addEventListener('click', searchRecipes);
    
    // Permite buscar também com a tecla Enter
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            searchRecipes();
        }
    });

    resultsList.innerHTML = '<p>Busque por um prato para começar!</p>';
});