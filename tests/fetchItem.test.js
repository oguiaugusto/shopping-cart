const fetchSimulator = require('../mocks/fetchSimulator');
const { fetchItem } = require('../helpers/fetchItem');
const item = require('../mocks/item');

window.fetch = jest.fn(fetchSimulator);

describe('fecthItem: ', () => {
  it('é uma função', () => {
    expect(typeof fetchItem).toBe('function');
  });
  it('quando passado o argumento "MLB1615760527", fetch é chamada', async () => {
    await fetchItem('MLB1615760527');
    expect(window.fetch).toHaveBeenCalled();
  });
  it('quando chamada com o argumento "MLB1615760527", utiliza o endpoint esperado', async () => {
    await fetchItem('MLB1615760527');
    expect(window.fetch).toHaveBeenCalledWith('https://api.mercadolibre.com/items/MLB1615760527');
  });
  it('quando chamada com o argumento "MLB1615760527", retorna dados iguais aos esperados', async () => {
    const result = await fetchItem('MLB1615760527');
    expect(result).toEqual(item);
  });
  it('quando chamada sem argumentos, lança um erro com a mensagem "You must provide an url"', async () => {
    const expectedError = new Error('You must provide an url');
    try {
      await fetchItem();
    } catch (error) {
      expect(error).toEqual(expectedError);
    }
  });
});
