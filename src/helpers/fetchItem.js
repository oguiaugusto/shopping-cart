const API_ITEM_URL = 'https://api.mercadolibre.com/items/';

const fetchItem = async (itemId) => {
  const response = await fetch(`${API_ITEM_URL}${itemId}`);
  const result = await response.json();

  return result;
};

if (typeof module !== 'undefined') {
  module.exports = {
    fetchItem,
  };
}
