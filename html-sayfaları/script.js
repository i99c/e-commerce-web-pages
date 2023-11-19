function addToCart(productName, size, price, imageUrl) {
  updateCartContent(productName, size, price, imageUrl);
  saveCartToLocalStorage();
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
          <i class="fa-solid fa-trash" style="color: #ffffff; cursor: pointer;" onclick="removeCartItem(this)"></i>
      </div>
  `;
  cartList.appendChild(newItem);
}

function removeCartItem(clickedIcon) {
  let cartItem = clickedIcon.closest('.row');
  cartItem.remove();
  updateCartCount();
}

function updateCartCount() {
  let itemCountElement = document.getElementById('item-count');
  let currentItemCount = parseInt(itemCountElement.innerText);
  itemCountElement.innerText = currentItemCount - 1;
}

function saveCartToLocalStorage() {
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
  let cartData = getCartFromLocalStorage();
  if (cartData.length > 0) {
    updateCartUI();
  }
}


addExtraProducts();



function updateCartFromLocalStorage() {
  let cartData = getCartFromLocalStorage();
  if (cartData.length > 0) {
    updateCartUI();

    for (let productId in cartData) {
      let { productName, size, price, imageUrl } = cartData[productId];
      updateCartContent(productName, size, price, imageUrl);
    }
  }
}


