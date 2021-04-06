// call validation for pages


export class Validation {

    constructor(pages) {
        this.pagesContainer = pages;
        this.textClass = 'navigation__text';
    }

    validatePage(link) {
        if (!link) return;
        
        var page = this.getPage(link);

        if (page) page.validatePage();
    }

    getPage(link) {
        var page;
        var linkText = link.querySelector('.' + this.textClass).textContent;

        switch (linkText) {
            case 'Home address':
                page = this.pagesContainer.homeAddress;
                break;

            case 'Phone numbers':
                page = this.pagesContainer.phoneNumbers;
                break;

            case 'Email':
                page = this.pagesContainer.email;
                break;

            case 'Emergency contact':
                page = this.pagesContainer.emergencyContact;
                break;

            case 'Race/Ethnicity':
                page = this.pagesContainer.raceEthnicity;
                break;

            case 'Gender':
                page = this.pagesContainer.gender;
                break;

            case 'Height & weight':
                page = this.pagesContainer.heightWeight;
                break;

            case 'Pharmacy':
                page = this.pagesContainer.pharmacy;
                break;

            case 'Questionnaire':
                page = this.pagesContainer.questionnaire;
                break;

            case 'Current info':
                page = this.pagesContainer.currentInfo;
                break;

            case 'Allergies':
                page = this.pagesContainer.allergies;
                break;

            case 'Medical condition':
                page = this.pagesContainer.medicalCondition;
                break;

            default:
                page = 0;
                break;
        }

        return page;
    }
}