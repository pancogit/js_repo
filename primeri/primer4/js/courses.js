// courses


export class Courses {

    constructor(serverData) {
        this.data = serverData;
        this.courses = document.getElementsByClassName('home__courses').item(0);
        this.contentClass = 'home__courses-content';
        this.content = 0;
    }

    addCourses() {
        this.removeStaticContent();

        // create content and add to the page
        this.content = this.createContentHTML();
        this.courses.prepend(this.content);
    }

    removeStaticContent() {
        var content = this.courses.getElementsByClassName(this.contentClass).item(0);

        this.courses.removeChild(content);
    }

    createContentHTML() {
        var content = document.createElement('div');
        var heading = document.createElement('h2');
        var subheading = document.createElement('h3');
        var dishes = document.createElement('div');
        var content = document.createElement('div');

        content.classList.add(this.contentClass);
        heading.classList.add('home__heading', 'home__heading--orange', 'home__heading--margin-bottom');
        heading.textContent = this.data.heading;
        subheading.classList.add('home__subheading');
        subheading.textContent = this.data.subheading;
        dishes.classList.add('home__dishes');

        var serverDishes = this.data.dishes;

        this.addDishesFromServer(serverDishes, dishes);

        content.append(heading);
        content.append(subheading);
        content.append(dishes);

        return content;
    }

    addDishesFromServer(dishesObject, dishesDOM) {
        for (let i = 0; i < dishesObject.length; i++) {
            let isLast = i === dishesObject.length - 1;

            dishesDOM.append(this.createDishHTML(dishesObject[i], isLast));

            // add text node for HTML new line if it's not last dish
            if (!isLast) dishesDOM.append(document.createTextNode('\n'));
        }
    }

    createDishHTML(dishObject, isLastDish) {
        var dish = document.createElement('a');

        dish.classList.add('home__dish');
        dish.textContent = dishObject.name;
        dish.href = dishObject.link;

        // add comma for all except last dish
        if (!isLastDish) dish.textContent += ',';

        return dish;
    }
}