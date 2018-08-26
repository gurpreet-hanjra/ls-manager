import localStorage from './localStorageMock';
import LocalStorageManager from '../src';
import { assert, expect } from 'chai';

const data1 = { firstName: 'Gerry', lastName: 'Hanjra' };
const data2 = { firstName: 'John', lastName: 'Doe' };
let result;
let idToEdit;

describe('LocalStorageManager', () => {
  it('LocalStorageManager should be defined', () => {
    assert.isDefined(LocalStorageManager);
  });

  it('setItems should add a contact', () => {
    assert.isDefined(LocalStorageManager.setItem);
    assert(LocalStorageManager.setItem(data1), true);
  });

  it('getAllItems should be defined and return added contacts', () => {
    assert.isDefined(LocalStorageManager.getAllItems());

    result = LocalStorageManager.getAllItems();
    expect(result).to.be.an('array');

    expect(result[0]).to.have.a.property('firstName', data1.firstName);
    expect(result[0]).to.have.a.property('lastName', data1.lastName);
    expect(result[0]).to.have.a.property('id');
  });

  it('editItem should be defined and return if element found', () => {
    assert.isDefined(LocalStorageManager.editItem);

    idToEdit = result[0].id;

    expect(LocalStorageManager.editItem(idToEdit)[0]).to.have.a.property('id', idToEdit);
    expect(LocalStorageManager.editItem('somerandomid')).to.not.have.a.property(
      'id',
      'somerandomid'
    );
  });

  it('updateItem should return updated contact name', () => {
    assert.isDefined(LocalStorageManager.updateItem);

    const toUpdate = { id: idToEdit, firstName: 'Tony', lastName: 'Stark' };
    assert(LocalStorageManager.updateItem(toUpdate), true);

    expect(LocalStorageManager.getAllItems()[0]).to.have.a.property('firstName', 'Tony');
    expect(LocalStorageManager.getAllItems()[0]).to.have.a.property('lastName', 'Stark');
    expect(LocalStorageManager.getAllItems()[0]).to.have.a.property('id', idToEdit);
  });

  it('filter should return empty array when contacts are not found', () => {
    const filterOn = 'zxzx';
    expect(LocalStorageManager.filter(filterOn)).to.be.an('array').that.is.empty;
  });

  it('filter should return an array when contacts are found', () => {
    const filterOn = 'ony';
    expect(LocalStorageManager.filter(filterOn)).to.be.an('array').that.is.not.empty;
    expect(LocalStorageManager.getAllItems()[0]).to.have.a.property('firstName', 'Tony');
  });

  it('setItems should add another contact', () => {
    assert.isDefined(LocalStorageManager.setItem);
    assert(LocalStorageManager.setItem(data2), true);
    expect(LocalStorageManager.getAllItems()).to.have.lengthOf(2);
  });

  it('sort should sort by firstName', () => {
    assert.isDefined(LocalStorageManager.sort);

    // before sort //
    expect(LocalStorageManager.getAllItems()[0]).to.have.a.property('firstName', 'Tony');

    const sortOn = 'firstName';
    assert(LocalStorageManager.sort(sortOn), true);
    // after sort //
    expect(LocalStorageManager.getAllItems()[0]).to.have.a.property('firstName', 'John');
  });
});
