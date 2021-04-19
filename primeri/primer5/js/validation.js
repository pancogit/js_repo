// call validation for pages


import { HomeAddress } from './pages/home-address.js';
import { PhoneNumbers } from './pages/phone-numbers.js';
import { Email } from './pages/email.js';
import { EmergencyContact } from './pages/emergency-contact.js';
import { RaceEthnicity } from './pages/race-ethnicity.js';
import { Gender } from './pages/gender.js';
import { HeightWeight } from './pages/height-weight.js';
import { Pharmacy } from './pages/pharmacy.js';
import { Questionnaire } from './pages/questionnaire.js';
import { CurrentInfo } from './pages/current-info.js';
import { Allergies } from './pages/allergies.js';
import { MedicalCondition } from './pages/medical-condition.js';

export class Validation {

    constructor(pages) {
        this.pagesContainer = pages;
        this.textClass = 'navigation__text';
        this.iconClass = 'navigation__icon';
    }

    validatePage(link) {
        if (!link) return;
        
        var page = this.getSetPage(link);

        if (page && page.validatePage) page.validatePage();
    }

    // get or set page from pages container
    getSetPage(link, setPage = false, pageContent) {
        var page;
        var linkText = link.querySelector('.' + this.textClass).textContent;
        var icon = link.querySelector('.' + this.iconClass);

        switch (linkText) {
            case 'Home address':
                // create page and init them
                if (setPage) {
                    this.pagesContainer.homeAddress = new HomeAddress(pageContent, link, icon);
                    this.pagesContainer.homeAddress.initPage();
                }
                else page = this.pagesContainer.homeAddress;
                break;

            case 'Phone numbers':
                if (setPage) {
                    this.pagesContainer.phoneNumbers = new PhoneNumbers(pageContent, link, icon);
                    this.pagesContainer.phoneNumbers.initPage();
                }
                else page = this.pagesContainer.phoneNumbers;
                break;

            case 'Email':
                if (setPage) {
                    this.pagesContainer.email = new Email(pageContent, link, icon);
                    this.pagesContainer.email.initPage();
                }
                else page = this.pagesContainer.email;
                break;

            case 'Emergency contact':
                if (setPage) {
                    this.pagesContainer.emergencyContact = new EmergencyContact(pageContent, link, icon);
                    this.pagesContainer.emergencyContact.initPage();
                }
                else page = this.pagesContainer.emergencyContact;
                break;

            case 'Race/Ethnicity':
                if (setPage) {
                    this.pagesContainer.raceEthnicity = new RaceEthnicity(pageContent, link, icon);
                    this.pagesContainer.raceEthnicity.initPage();
                }
                else page = this.pagesContainer.raceEthnicity;
                break;

            case 'Gender':
                if (setPage) {
                    this.pagesContainer.gender = new Gender(pageContent, link, icon);
                    this.pagesContainer.gender.initPage();
                }
                else page = this.pagesContainer.gender;
                break;

            case 'Height & weight':
                if (setPage) {
                    this.pagesContainer.heightWeight = new HeightWeight(pageContent, link, icon);
                    this.pagesContainer.heightWeight.initPage();
                }
                else page = this.pagesContainer.heightWeight;
                break;

            case 'Pharmacy':
                if (setPage) {
                    this.pagesContainer.pharmacy = new Pharmacy(pageContent, link, icon);
                    this.pagesContainer.pharmacy.initPage();
                }
                else page = this.pagesContainer.pharmacy;
                break;

            case 'Questionnaire':
                if (setPage) {
                    this.pagesContainer.questionnaire = new Questionnaire(pageContent, link, icon);
                    this.pagesContainer.questionnaire.initPage();
                }
                else page = this.pagesContainer.questionnaire;
                break;

            case 'Current info':
                if (setPage) {
                    this.pagesContainer.currentInfo = new CurrentInfo(pageContent, link, icon);
                    this.pagesContainer.currentInfo.initPage();
                }
                else page = this.pagesContainer.currentInfo;
                break;

            case 'Allergies':
                if (setPage) {
                    this.pagesContainer.allergies = new Allergies(pageContent, link, icon);
                    this.pagesContainer.allergies.initPage();
                }
                else page = this.pagesContainer.allergies;
                break;

            case 'Medical condition':
                if (setPage) {
                    this.pagesContainer.medicalCondition = new MedicalCondition(pageContent, link, icon);
                    this.pagesContainer.medicalCondition.initPage();
                }
                else page = this.pagesContainer.medicalCondition;
                break;

            default:
                page = 0;
                break;
        }

        if (setPage) return 1;
        else return page;
    }
}