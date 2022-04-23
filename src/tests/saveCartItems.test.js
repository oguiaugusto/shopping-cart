const saveCartItems = require('../helpers/saveCartItems');

Object.defineProperty(window, 'localStorage', {
  value: {
    setItem: jest.fn(),
  },
});

const ITEM = '<ol><li>Item</li></ol>';

describe('saveCartItems: ', () => {
  it('o método localStorage.setItem é chamado', () => {
    saveCartItems(ITEM);
    expect(window.localStorage.setItem).toHaveBeenCalled();
  });
  it('o método localStorage.setItem é chamado com dois parâmetros: "cartItems" e o valor passado como argumento na função', () => {
    saveCartItems(ITEM);
    expect(window.localStorage.setItem).toHaveBeenCalledWith('cartItems', ITEM);
  });
});
