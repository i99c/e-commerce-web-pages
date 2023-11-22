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


// ... Diğer kodlar

// ... Diğer kodlar

function calculateTotal() {
  let cartData = getCartFromLocalStorage();
  let total = 0;

  for (let productId in cartData) {
    let { price } = cartData[productId];
    total += parseFloat(price);
  }

  return total.toFixed(2);
}

function addPaymentButton() {
  let paymentButtonContainer = document.getElementById('payment-button-container');

  let paymentButton = document.createElement('button');
  paymentButton.innerText = 'Ödeme Yap';
  paymentButton.addEventListener('click', function () {
    redirectToCreditCardPage();
  });

  paymentButtonContainer.appendChild(paymentButton);
}

function addTotalElement() {
  let totalContainer = document.getElementById('total-container');
  let total = calculateTotal();

  let totalElement = document.createElement('div');
  totalElement.innerText = `Toplam: ${total} TL`;

  totalContainer.appendChild(totalElement);
}

function redirectToCreditCardPage() {
  console.log('Ödeme yap butonuna tıklandı. Kredi kartı sayfasına yönlendiriliyor...');
  // Burada gerçek bir kredi kartı sayfasına yönlendirmek için uygun URL kullanılabilir.
}

window.onload = function () {
  addExtraProducts();
  updateCartFromLocalStorage();
  addPaymentButton();
  addTotalElement();
};

// ... Diğer kodlar
