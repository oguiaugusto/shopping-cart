const body = document.querySelector('body');
const itemsSection = document.querySelector('.items');
const cartSection = document.querySelector('.cart__items');
const searchInput = document.getElementById('search-input');

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image, price }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createCustomElement('span', 'item__price', `R$ ${price}`));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemRemoveButtonListener({ target: { id } }) {
  const item = cartSection.children.namedItem(id);
  cartSection.removeChild(item);
}

// eslint-disable-next-line max-lines-per-function
function createCartItemElement({ sku, name, price, image }) {
  const li = document.createElement('li');
  const imageDiv = document.createElement('div');
  const infoDiv = document.createElement('div');
  const buttonDiv = document.createElement('div');

  const itemImage = document.createElement('img');
  const itemName = document.createElement('p');
  const fullItemPrice = document.createElement('p');
  const itemPrice = document.createElement('span');
  const removeButton = document.createElement('button');
  const buttonIcon = document.createElement('i');

  li.className = 'cart__item';
  li.id = sku;

  itemImage.src = image;
  itemName.innerText = name;

  itemPrice.innerText = price;
  itemPrice.className = 'item__cart__price';
  fullItemPrice.innerHTML = `<span>R$ </span>${itemPrice.outerHTML}`;

  buttonIcon.className = 'fa fa-solid fa-xmark';

  removeButton.type = 'button';
  removeButton.className = 'item__remove';
  removeButton.id = sku;
  removeButton.appendChild(buttonIcon);

  imageDiv.className = 'cart__item__image';
  infoDiv.className = 'cart__item__info';
  buttonDiv.className = 'cart__item__button';
  
  imageDiv.appendChild(itemImage);
  infoDiv.appendChild(itemName);
  infoDiv.appendChild(fullItemPrice);
  buttonDiv.appendChild(removeButton);

  li.appendChild(imageDiv);
  li.appendChild(infoDiv);
  li.appendChild(infoDiv);
  li.appendChild(buttonDiv);

  return li;
}

async function setProducts(query) {
  const products = await fetchProducts(query);

  products.results.forEach(({ thumbnail, title: name, id: sku, price }) => {
    const image = thumbnail.split('I.jpg').join('W.jpg');
    const productElement = createProductItemElement({ sku, name, image, price });
    itemsSection.appendChild(productElement);
  });

  if (products.results.length === 0) {
    const p = document.createElement('p');
    p.className = 'not-found';
    p.innerText = 'Nenhum item foi encontrado';

    itemsSection.appendChild(p);
  }

  const loader = document.querySelector('.loader');
  itemsSection.removeChild(loader);
}

async function addProductToCart(e) {
  const productId = getSkuFromProductItem(e.target.parentElement);
  const { id: sku, title: name, price, thumbnail: image } = await fetchItem(productId);

  const itemElement = createCartItemElement({ sku, name, price, image });
  cartSection.appendChild(itemElement);
}

function updateCart() {
  saveCartItems(cartSection.innerHTML);
}

function setCartItems() {
  const items = getSavedCartItems();
  cartSection.innerHTML = items;
}

function updateTotalPrice() {
  const priceNodes = Array.from(document.querySelectorAll('.item__cart__price'));
  const totalPrice = priceNodes
    .reduce((acc, price) => acc + parseFloat(price.innerText), 0)
    .toFixed(2);

  document.querySelector('.total-price').innerText = totalPrice;
}

function searchItem() {
  if (searchInput.value !== '') {
    itemsSection.innerHTML = '';
  
    const loader = document.createElement('div');
    loader.className = 'loader';
    itemsSection.appendChild(loader);
  
    const query = searchInput.value;
    setProducts(query);
  }
}

// eslint-disable-next-line max-lines-per-function
body.addEventListener('click', (e) => {
  if (e.target.classList.contains('item__add')) {
    addProductToCart(e).then(() => {
      updateCart();
      updateTotalPrice();
    });
  }

  if (e.target.classList.contains('item__remove')) {
    cartItemRemoveButtonListener(e);
    updateCart();
    updateTotalPrice();
  }

  if (e.target.classList.contains('empty-cart')) {
    cartSection.innerHTML = '';
    updateCart();
    updateTotalPrice();
  }

  if (e.target.id === 'search-icon') {
    searchItem();
    searchInput.value = '';
  }
});

searchInput.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    searchItem();
    e.target.value = '';
  }
});

window.onload = async () => {
  setProducts('computador');
  setCartItems();
  updateTotalPrice();
};
