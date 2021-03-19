// homepage


// import classes from javascript modules
import { Fetch } from './fetch.js';
import { Categories } from './categories.js';
import { Recipes } from './recipes.js';
import { Ads } from './ads.js';
import { LastRecipes } from './last-recipes.js'
import { Courses } from './courses.js';
import { Dropdown } from './dropdown.js';
import { Header }  from './header.js';
import { Subscribe } from './subscribe.js';

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
    var courses = new Courses(value.data.courses);
    var dropdown = new Dropdown(categoriesData);
    var header = new Header(value.data.slides);
    var subscribe = new Subscribe();

    categories.addCategories();
    ads.addAds();
    lastRecipes.add();
    courses.addCourses();
    dropdown.addRecipes();
    header.addSlides();
    subscribe.addEvents();
}

function errorHandler(reason) {
    console.error(reason.stack);
}