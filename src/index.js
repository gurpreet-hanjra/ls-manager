import shortid from 'shortid';
import { sortBy, prop, compose, toLower } from 'ramda';

class LocalStorageManager {
  constructor() {
    if (!LocalStorageManager.instance) {
      this.data = LocalStorageManager.getParsedContacts();
      LocalStorageManager.instance = this;
    }
    return LocalStorageManager.instance;
  }

  // returns parsed data. String => Array //
  static getParsedContacts() {
    const contacts =
      localStorage.getItem('contacts') && JSON.parse(localStorage.getItem('contacts'));
    return contacts && contacts.length ? contacts : [];
  }

  // returns all items //
  getAllItems() {
    const contacts = this.data;
    const sortOn = localStorage.getItem('sortOn');

    // check if they were already sorted //
    if (sortOn && contacts.length) {
      return this.sort(sortOn, contacts);
    }

    return contacts;
  }

  // returns sorted data based on SortOn key, original data is not modified //
  sort(sortOn, contacts = []) {
    if (sortOn === 'Select') {
      return contacts.length ? contacts : this.data;
    }
    localStorage.setItem('sortOn', sortOn);

    const sortedContacts = sortBy(
      compose(
        toLower,
        prop(sortOn)
      ),
      this.data
    );

    return sortedContacts;
  }

  // filters the data based upon firstname or lastname //
  filter(filterOn) {
    const contacts = this.data;
    const filtered = contacts.filter(contact =>
      contact.firstName.toLowerCase().includes(filterOn) ||
        contact.lastName.toLowerCase().includes(filterOn));
    return filtered || [];
  }

  // returns stringified data to store in localStorage //
  static getStrigifiedData(data) {
    return JSON.stringify(data);
  }

  // finds the item and returns it //
  editItem(id) {
    const contacts = this.data;
    return contacts.filter(contact => contact.id === id);
  }

  // update the item and returns true if success //
  updateItem(data) {
    const contacts = this.data;
    const itemIndex = contacts.findIndex(contact => contact.id === data.id);

    contacts[itemIndex].firstName = data.firstName;
    contacts[itemIndex].lastName = data.lastName;

    localStorage.setItem('contacts', LocalStorageManager.getStrigifiedData(contacts));
    this.data = LocalStorageManager.getParsedContacts();

    return true;
  }

  // sets the new item or add to existing item //
  setItem(name) {
    let contacts = [];
    if (!localStorage.getItem('contacts')) {
      contacts.push(LocalStorageManager.createItem(name));
      localStorage.setItem('contacts', LocalStorageManager.getStrigifiedData(contacts));
    } else {
      contacts = this.data;
      contacts.push(LocalStorageManager.createItem(name));
      localStorage.setItem('contacts', LocalStorageManager.getStrigifiedData(contacts));
    }

    this.data = LocalStorageManager.getParsedContacts();

    return true;
  }

  // takes the name, adds the unique id //
  static createItem(name) {
    return Object.assign({ id: shortid.generate() }, name);
  }
}

const instance = new LocalStorageManager();
export default instance;
