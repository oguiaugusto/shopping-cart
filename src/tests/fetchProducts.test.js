const fetchSimulator = require('../mocks/fetchSimulator');
const { fetchProducts } = require('../helpers/fetchProducts');
const computadorSearch = require('../mocks/search');

window.fetch = jest.fn(fetchSimulator);

describe('fecthProducts: ', () => {
  it('é uma função', () => {
    expect(typeof fetchProducts).toBe('function');
  });
  it('quando passado o argumento "computador", fetch é chamada', async () => {
    await fetchProducts('computador');
    expect(window.fetch).toHaveBeenCalled();
  });
  it('quando chamada com o argumento "computador", utiliza o endpoint esperado', async () => {
    await fetchProducts('computador');
    expect(window.fetch).toHaveBeenCalledWith('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  });
  it('quando chamada com o argumento "computador", retorna dados iguais aos esperados', async () => {
    const result = await fetchProducts('computador');
    expect(result).toEqual(computadorSearch);
  });
  it('quando chamada sem argumentos, lança um erro com a mensagem "You must provide an url"', async () => {
    const expectedError = new Error('You must provide an url');
    try {
      await fetchProducts();
    } catch (error) {
      expect(error).toEqual(expectedError);
    }
  });
});
