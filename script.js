const body = document.querySelector('body');
const itemsSection = document.querySelector('.items');
const cartSection = document.querySelector('.cart__items');

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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemRemoveButtonListener(event) {
  // coloque seu código aqui
}

// eslint-disable-next-line max-lines-per-function
function createCartItemElement({ sku, name, price, image }) {
  const li = document.createElement('li');
  const imageDiv = document.createElement('div');
  const infoDiv = document.createElement('div');
  const buttonDiv = document.createElement('div');

  const itemImage = document.createElement('img');
  const itemName = document.createElement('p');
  const itemPrice = document.createElement('p');
  const removeButton = document.createElement('button');
  const buttonIcon = document.createElement('i');

  li.className = 'cart__item';
  li.id = sku;

  itemImage.src = image;
  itemName.innerText = name;
  itemPrice.innerText = price;
  buttonIcon.className = 'fa fa-solid fa-xmark';
  removeButton.type = 'button';
  removeButton.addEventListener('click', cartItemRemoveButtonListener);
  removeButton.appendChild(buttonIcon);
  
  imageDiv.appendChild(itemImage);
  infoDiv.appendChild(itemName);
  infoDiv.appendChild(itemPrice);
  buttonDiv.appendChild(removeButton);

  li.appendChild(imageDiv);
  li.appendChild(infoDiv);
  li.appendChild(infoDiv);
  li.appendChild(buttonDiv);

  return li;
}

async function setProducts(query) {
  const products = await fetchProducts(query);

  products.results.forEach(({ thumbnail, title: name, id: sku }) => {
    const image = thumbnail.split('I.jpg').join('W.jpg');
    const productElement = createProductItemElement({ sku, name, image });
    itemsSection.appendChild(productElement);
  });
}

async function addProductToCart(e) {
  const productId = getSkuFromProductItem(e.target.parentElement);
  const { id: sku, title: name, price, thumbnail: image } = await fetchItem(productId);

  const itemElement = createCartItemElement({ sku, name, price, image });
  cartSection.appendChild(itemElement);
}

body.addEventListener('click', (e) => {
  if (e.target.classList.contains('item__add')) addProductToCart(e);
});

window.onload = async () => {
  setProducts('computador');
};
