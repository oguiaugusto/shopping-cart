const getSavedCartItems = require('../helpers/getSavedCartItems');

Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(),
  },
});

describe('getSavedCartItems: ', () => {
  it('o método localStorage.getItem é chamado', () => {
    getSavedCartItems();
    expect(window.localStorage.getItem).toHaveBeenCalled();
  });
  it('o método localStorage.getItem é chamado com dois parâmetros: "cartItems" e o valor passado como argumento na função', () => {
    getSavedCartItems();
    expect(window.localStorage.getItem).toHaveBeenCalledWith('cartItems');
  });
});
