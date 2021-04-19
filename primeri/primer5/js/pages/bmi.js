// body mass index and weight status updates


export class BMI {

    constructor(heightObject, weightObject) {
        this.height = heightObject;
        this.weight = weightObject;

        this.imperialBMIFactor = 703;  // multiplication factor for BMI
        this.inchesInFeet = 12;        // 1 feet = 12 inches

        this.ranges = [
            {
                name: 'Body Mass Deficit',
                class: 'calculation__content--deficit',

                // range includes minimum value, but excludes maximum value [ min, max }
                range: {
                    min: 0,
                    max: 18.5
                }
            },
            {
                name: 'Normal Body Mass',
                class: 'calculation__content--normal',
                range: {
                    min: 18.5,
                    max: 25
                }
            },
            {
                name: 'Excessive Body Mass',
                class: 'calculation__content--excessive',
                range: {
                    min: 25,
                    max: 30
                }
            },
            {
                name: 'Obesity 1st Degree',
                class: 'calculation__content--obesity-1st',
                range: {
                    min: 30,
                    max: 35
                }
            },
            {
                name: 'Obesity 2nd Degree',
                class: 'calculation__content--obesity-2nd',
                range: {
                    min: 35,
                    max: 40
                }
            },
            {
                name: 'Obesity 3rd Degree',
                class: 'calculation__content--obesity-3rd',
                range: {
                    min: 40,
                    max: 1000000
                }
            }
        ]
    }

    updateBMIandWeightStatus() {
        this.updateBMI();
        this.updateWeightStatus();
    }

    // imperial formula for BMI is used
    // imperial formula BMI = 703 x weight (pounds) / height(inches) ^ 2
    // 1 feet is 12 inches
    updateBMI() {
        var weightInPounds = this.weight.pounds.object.number.value;
        var feetToInches = this.height.feet.object.number.value * this.inchesInFeet;
        var heightInInches = feetToInches + this.height.inches.object.number.value;

        // if height is zero, then don't divide anything
        var imperialBMI = heightInInches ?
            this.imperialBMIFactor * weightInPounds / Math.pow(heightInInches, 2) : 0;

        // round float to 2 decimal places
        imperialBMI = parseFloat(imperialBMI.toFixed(2));

        var imperialBMIChanged = this.weight.bmi.value !== imperialBMI;

        // update BMI only if BMI is changed
        if (imperialBMIChanged) {
            this.weight.bmi.value = imperialBMI;
            this.weight.bmi.element.textContent = imperialBMI;
        }
    }

    // look for BMI result to update weight status
    updateWeightStatus() {
        var range = this.findWeightRange();

        if (range) {
            let weightStatusChanged = this.weight.weightStatus.value !== range.name;

            // update weight range text only if it's changed
            if (weightStatusChanged) {
                this.weight.weightStatus.value = range.name;
                this.weight.weightStatus.element.textContent = range.name;
            }

            let classAlreadyExists = this.weight.weightStatus.element.classList.contains(range.class);

            // update classes for weight status and BMI only if they are not the same
            if (!classAlreadyExists) {
                this.removeWeightStatusBMIClasses();
                this.weight.weightStatus.element.classList.add(range.class);
    
                // add the same class to BMI element also
                this.weight.bmi.element.classList.add(range.class);
            }
        }
    }

    findWeightRange() {
        var currentBMI = this.weight.bmi.value;
        var weightRange;

        for (let i = 0; i < this.ranges.length; i++) {
            // range includes minimum value, but excludes maximum value [ min, max }
            let currentBMIinRange = (currentBMI >= this.ranges[i].range.min) &&
                (currentBMI < this.ranges[i].range.max);

            if (currentBMIinRange) {
                weightRange = this.ranges[i];
                break;
            }
        }

        return weightRange ? weightRange : 0;
    }

    removeWeightStatusBMIClasses() {
        this.ranges.forEach(function iterate(value, index, array) {
            this.weight.weightStatus.element.classList.remove(value.class);
            this.weight.bmi.element.classList.remove(value.class);

        }, this);
    }
}