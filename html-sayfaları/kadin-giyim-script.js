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

function saveCartToLocalStorage(productName, size, price, imageUrl) {
  let cartData = JSON.parse(localStorage.getItem('cartData')) || {};
  let productId = Date.now().toString();
  cartData[productId] = { productName, size, price, imageUrl };
  localStorage.setItem('cartData', JSON.stringify(cartData));

  return { productName, size, price, imageUrl }; // Burada değerleri döndürüyoruz
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
  // updateCartFromLocalStorage();
 
};



function addExtraProducts() {
  // Sayfadaki her ürün için bu fonksiyonu çağırabilirsiniz
  let productElements = document.querySelectorAll('.product'); //  .product sınıfına sahip tüm ürünleri ekleriz

  productElements.forEach(productElement => {
    let productName = productElement.querySelector('.product-name').innerText;
    let size = productElement.querySelector('.product-size').innerText;
    let price = parseFloat(productElement.querySelector('.product-price').innerText);
    let imageUrl = productElement.querySelector('.product-image').getAttribute('src');

    let savedData = saveCartToLocalStorage({ productName, size, price, imageUrl });
    updateCartContent(savedData.productName, savedData.size, savedData.price, savedData.imageUrl);
  });
}

// saveCartToLocalStorage fonksiyonu ekledim
function saveCartToLocalStorage(productElement) {
  let cartData = JSON.parse(localStorage.getItem('cartData')) || {};
  let productId = Date.now().toString();
  cartData[productId] = productData;
  localStorage.setItem('cartData', JSON.stringify(cartData));

  return productData; // Burada değerleri döndürüyoruz
}


// localStorage.removeItem('cartData'); // "cartData'yı temizlemek için"
