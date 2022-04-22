const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=';

const fetchProducts = async (query) => {
  const response = await fetch(`${API_URL}${query}`);
  const result = await response.json();

  return result;
};

if (typeof module !== 'undefined') {
  module.exports = {
    fetchProducts,
  };
}
