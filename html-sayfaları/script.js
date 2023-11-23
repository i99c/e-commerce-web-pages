function addToCart(productName, size, price, imageUrl) {
  updateCartContent(productName, size, price, imageUrl);
  saveCartToLocalStorage(productName, size, price, imageUrl);
}

function updateCartContent(productName, size, price, imageUrl) {
  let itemCountElement = document.getElementById('item-count');
  let currentItemCount = parseInt(itemCountElement.innerText);
  itemCountElement.innerText = currentItemCount + 1;

  let cartList = document.getElementById('cartList');
  let newItem = document.createElement('div');
  newItem.classList.add('row', 'align-items-center', 'text-white-50');
  newItem.innerHTML = `
      <div class="col-md-3">
          <img src="${imageUrl}" alt="products" class="img-fluid">
      </div>
      <div class="col-md-5">
          <div class="title">${productName} - ${size}</div>
      </div>
      <div class="col-md-3">
          <div class="price">${price} TL</div>
      </div>
      <div class="col-md-1">
          <i class="fa-solid fa-trash" style="color: #ffffff; cursor: pointer;" onclick="removeCartItem('${productName}', '${size}')"></i>
      </div>
  `;
  cartList.appendChild(newItem);
}

function removeCartItem(productName, size) {
  let cartList = document.getElementById('cartList');
  let cartItems = cartList.getElementsByClassName('row');

  for (let i = 0; i < cartItems.length; i++) {
    let item = cartItems[i];
    let title = item.querySelector('.title').innerText;

    if (title === `${productName} - ${size}`) {
      item.remove();
      removeFromLocalStorage(productName, size);
      updateCartCount();
      break;
    }
  }
}

function removeFromLocalStorage(productName, size) {
  let cartData = JSON.parse(localStorage.getItem('cartData')) || {};
  for (let productId in cartData) {
    let { productName: storedProductName, size: storedSize } = cartData[productId];
    if (storedProductName === productName && storedSize === size) {
      delete cartData[productId];
      localStorage.setItem('cartData', JSON.stringify(cartData));
      break;
    }
  }
}

function updateCartCount() {
  let itemCountElement = document.getElementById('item-count');
  let currentItemCount = parseInt(itemCountElement.innerText);
  itemCountElement.innerText = currentItemCount - 1;
}

function saveCartToLocalStorage(productName, size, price, imageUrl) {
  let cartData = JSON.parse(localStorage.getItem('cartData')) || {};
  let productId = Date.now().toString();
  cartData[productId] = { productName, size, price, imageUrl };
  localStorage.setItem('cartData', JSON.stringify(cartData));
}

function selectSize(productName, size, price, imageUrl) {
  addToCart(productName, size, price, imageUrl);
}

document.getElementById('cartBtn').addEventListener('click', function () {
  let cartList = document.getElementById('cartList');
  cartList.classList.toggle('show');
});

window.onload = function () {
  addExtraProducts();
  updateCartFromLocalStorage();
};

function updateCartFromLocalStorage() {
  let cartData = JSON.parse(localStorage.getItem('cartData')) || {};
  for (let productId in cartData) {
    let { productName, size, price, imageUrl } = cartData[productId];
    updateCartContent(productName, size, price, imageUrl);
  }
}

function addExtraProducts() {
  let productElements = document.querySelectorAll('.product');
  productElements.forEach(productElement => {
    let productName = productElement.querySelector('.product-name').innerText;
    let size = productElement.querySelector('.product-size').innerText;
    let price = parseFloat(productElement.querySelector('.product-price').innerText);
    let imageUrl = productElement.querySelector('.product-image').getAttribute('src');

    let savedData = saveCartToLocalStorage(productName, size, price, imageUrl);
    updateCartContent(savedData.productName, savedData.size, savedData.price, savedData.imageUrl);
  });
}
