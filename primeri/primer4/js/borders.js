// borders


export class Borders {

    constructor() {

    }

    // create and return HTML for borders including small borders
    createBordersHTML(smallBorders = false) {
        var borders = document.createElement('div');
        var top = document.createElement('div');
        var bottom = document.createElement('div');
        var left = document.createElement('div');
        var right = document.createElement('div');

        if (smallBorders) borders.classList.add('borders--small');

        borders.classList.add('borders');
        top.classList.add('borders__top');
        bottom.classList.add('borders__bottom');
        left.classList.add('borders__left');
        right.classList.add('borders__right');

        borders.append(top);
        borders.append(bottom);
        borders.append(left);
        borders.append(right);

        return borders;
    }
}