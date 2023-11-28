function addToCart(productName, size, price, imageUrl) {
  let productId = generateProductId(productName, size);
  let existingItem = document.getElementById(`cartItem_${productId}`);

  if (existingItem) {
    // Ürün zaten sepette var, miktarını artır
    changeQuantity(productId, 1);
  } else {
    // Yeni ürünü sepete ekle
    updateCartContent(productId, productName, size, price, imageUrl, 1);
    saveCartToLocalStorage(productId, productName, size, price, imageUrl, 1);
  }

  // Toplam tutarı güncelle
  updateTotalPrice();
}

function generateProductId(productName, size) {
  return `${productName.replace(/\s/g, "")}_${size}`;
}


function updateCartContent(productName, size, price, imageUrl, quantity) {
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
      <div class="col-md-2">
          <div class="quantity-section">
              <button class="quantity-button" onclick="changeQuantity('${productName}', '${size}', 1, ${quantity})">+</button>
              <input type="number" class="quantity-input" id="quantityInput_${productName}_${size}" value="${quantity}" min="1">
              <button class="quantity-button" onclick="changeQuantity('${productName}', '${size}', -1, ${quantity})">-</button>
          </div>
      </div>
      <div class="col-md-2">
          <div class="price">${price.toFixed(2)} TL</div>
      </div>
      <div class="col-md-1">
          <i class="fa-solid fa-trash" style="color: #ffffff; cursor: pointer;" onclick="removeCartItem('${productName}', '${size}')"></i>
      </div>
  `;

  cartList.appendChild(newItem);

  // Miktar alanının değişikliklerini dinlemek ve güncellemek için event listener ekleyin
  let quantityInput = document.getElementById(`quantityInput_${productName}_${size}`);
  quantityInput.addEventListener('input', function () {
    let newQuantity = parseInt(this.value) || 1;
    updateTotalPrice(); // Toplam tutarı güncelle
    saveCartToLocalStorage(productName, size, price, imageUrl, newQuantity);
  });
}

function changeQuantity(productId, change) {
  let quantityInput = document.getElementById(`quantityInput_${productId}`);
  let currentQuantity = parseInt(quantityInput.value);
  let newQuantity = Math.max(currentQuantity + change, 1);

  quantityInput.value = newQuantity;

  // Fiyatı güncelleme işlemi
  updateTotalPrice();
}


function changeQuantity(productName, size, change) {
  let quantityInput = document.getElementById(`quantityInput_${productName}_${size}`);
  let currentQuantity = parseInt(quantityInput.value);
  let newQuantity = Math.max(currentQuantity + change, 1);

  quantityInput.value = newQuantity;

  updateTotalPrice(); // Toplam tutarı güncelle
  saveCartToLocalStorage(productName, size, price, imageUrl, newQuantity);
}


function updateCartContent(productId, productName, size, price, imageUrl, quantity) {
  let itemCountElement = document.getElementById('item-count');
  let currentItemCount = parseInt(itemCountElement.innerText);
  itemCountElement.innerText = currentItemCount + 1;

  let cartList = document.getElementById('cartList');
  let newItem = document.createElement('div');
  newItem.id = `cartItem_${productId}`;
  newItem.classList.add('row', 'align-items-center', 'text-white-50');

  newItem.innerHTML = `
      <div class="col-md-3">
          <img src="${imageUrl}" alt="products" class="img-fluid">
      </div>
      <div class="col-md-5">
          <div class="title">${productName} - ${size}</div>
      </div>
      <div class="col-md-2">
          <div class="quantity-section">
              <button class="quantity-button" onclick="changeQuantity('${productId}', 1)">+</button>
              <input type="number" class="quantity-input" id="quantityInput_${productId}" value="${quantity}" min="1">
              <button class="quantity-button" onclick="changeQuantity('${productId}', -1)">-</button>
          </div>
      </div>
      <div class="col-md-2">
          <div class="price">${price.toFixed(2)} TL</div>
      </div>
      <div class="col-md-1">
          <i class="fa-solid fa-trash" style="color: #ffffff; cursor: pointer;" onclick="removeCartItem('${productId}')"></i>
      </div>
  `;

  cartList.appendChild(newItem);

  // Miktar alanının değişikliklerini dinlemek ve güncellemek için event listener ekleyin
  let quantityInput = document.getElementById(`quantityInput_${productId}`);
  quantityInput.addEventListener('input', function () {
    let newQuantity = parseInt(this.value) || 1;
    updateTotalPrice(); // Toplam tutarı güncelle
    saveCartToLocalStorage(productId, productName, size, price, imageUrl, newQuantity);
  });
}

function removeCartItem(productId) {
  let cartItem = document.getElementById(`cartItem_${productId}`);
  cartItem.remove();

  removeFromLocalStorage(productId);
  updateCartCount();
  updateTotalPrice(); // Toplam tutarı güncelle
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

// localStorage.removeItem('cartData'); // "cartData'yı temizlemek için"

