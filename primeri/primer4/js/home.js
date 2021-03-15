// homepage


// import classes from javascript modules
import { Fetch } from './fetch.js';
import { Categories } from './categories.js';
import { Recipes } from './recipes.js';
import { Ads } from './ads.js';
import { LastRecipes } from './last-recipes.js'

var fetch = new Fetch();

fetch.getDataFromServer()
        .then(dataFetched.bind(null, fetch))  // send fetch object via bind
        .catch(errorHandler);

// add remaining javascript when data is fetched from server
function dataFetched(value) {
    var categoriesData = value.data.recipes.categories;
    var recipes = new Recipes(categoriesData);
    var categories = new Categories(categoriesData, recipes);
    var ads = new Ads(value.data.ads);
    var lastRecipes = new LastRecipes(categoriesData);

    categories.addCategories();
    ads.addAds();
    lastRecipes.add();
}

function errorHandler(reason) {
    console.error(reason.stack);
}