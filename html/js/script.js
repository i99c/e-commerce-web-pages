function addToCart(productName, size, price, imageUrl) {
  let productId = `${productName.replace(/\s/g, "")}_${size}`;
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

function changeQuantity(productId, change) {
  let quantityInput = document.getElementById(`quantityInput_${productId}`);
  let currentQuantity = parseInt(quantityInput.value);
  let newQuantity = Math.max(currentQuantity + change, 1);

  quantityInput.value = newQuantity;

  // Fiyatı güncelleme işlemi
  updateTotalPrice();
}

function updateCartContent(
  productId,
  productName,
  size,
  price,
  imageUrl,
  quantity
) {
  let itemCountElement = document.getElementById("item-count");
  let currentItemCount = parseInt(itemCountElement.innerText);
  itemCountElement.innerText = currentItemCount + 1;

  let cartList = document.getElementById("cartList");
  let newItem = document.createElement("div");
  newItem.id = `cartItem_${productId}`;
  newItem.classList.add("row", "align-items-center", "text-white-50");
  newItem.innerHTML = `
    <div class="col-md-3">
        <img src="${imageUrl}" alt="products" class="img-fluid">
    </div>
    <div class="col-md-5">
        <div class="title">${productName} - ${size}</div>
    </div>
    <div class="col-md-3">
        <div class="price">${price.toFixed(2)} TL</div>
    </div>
    <div class="col-md-3">
        <div class="quantity-section">
            <button class="quantity-button" onclick="changeQuantity('${productId}', 1)">+</button>
            <input type="number" class="quantity-input" id="quantityInput_${productId}" value="${quantity}" min="1">
            <button class="quantity-button" onclick="changeQuantity('${productId}', -1)">-</button>
        </div>
    </div>
    <div class="col-md-1">
        <i class="fa-solid fa-trash" style="color: #ffffff; cursor: pointer;" onclick="removeCartItem('${productId}', '${imageUrl}')"></i>
    </div>
  `;

  // Yeni ürünü, totalSection'dan önce eklemek için
  cartList.insertBefore(newItem, totalSection);

  // Toplam tutarı güncelle
  updateTotalPrice();
}



function removeCartItem(productId, imageUrl) {
  let cartItem = document.getElementById(`cartItem_${productId}`);
  cartItem.remove();

  removeFromLocalStorage(productId);
  updateCartCount();
  updateTotalPrice(); // Toplam tutarı güncelle

  // Eğer resimleri kaldırmak istiyorsanız, aşağıdaki satırı ekleyebilirsiniz
  removeImageFromLocalStorage(imageUrl);
}

function removeImageFromLocalStorage(imageUrl) {
  // Resimleri kaldırmak için gerekli işlemleri burada yapabilirsiniz
}


function removeFromLocalStorage(productName, size) {
  let cartData = JSON.parse(localStorage.getItem("cartData")) || {};
  for (let productId in cartData) {
    let { productName: storedProductName, size: storedSize } =
      cartData[productId];
    if (storedProductName === productName && storedSize === size) {
      delete cartData[productId];
      localStorage.setItem("cartData", JSON.stringify(cartData));
      break;
    }
  }
}

function updateCartCount() {
  let itemCountElement = document.getElementById("item-count");
  let currentItemCount = parseInt(itemCountElement.innerText);
  itemCountElement.innerText = currentItemCount - 1;
}

function saveCartToLocalStorage(productName, size, price, imageUrl) {
  let cartData = JSON.parse(localStorage.getItem("cartData")) || {};
  let productId = Date.now().toString();
  cartData[productId] = { productName, size, price, imageUrl };
  localStorage.setItem("cartData", JSON.stringify(cartData));
}

function selectSize(productName, size, price, imageUrl) {
  addToCart(productName, size, price, imageUrl);
}

document.getElementById("cartBtn").addEventListener("click", function () {
  let cartList = document.getElementById("cartList");
  cartList.classList.toggle("show");
});

window.onload = function () {
  addExtraProducts();
  updateCartFromLocalStorage();
};

function updateCartFromLocalStorage() {
  let cartData = JSON.parse(localStorage.getItem("cartData")) || {};
  for (let productId in cartData) {
    let { productName, size, price, imageUrl } = cartData[productId];
    updateCartContent(productName, size, price, imageUrl);
  }
}

function addExtraProducts() {
  let productElements = document.querySelectorAll(".product");
  productElements.forEach((productElement) => {
    let productName = productElement.querySelector(".product-name").innerText;
    let size = productElement.querySelector(".product-size").innerText;
    let price = parseFloat(
      productElement.querySelector(".product-price").innerText
    );
    let imageUrl = productElement
      .querySelector(".product-image")
      .getAttribute("src");

    let savedData = saveCartToLocalStorage(productName, size, price, imageUrl);
    updateCartContent(
      savedData.productName,
      savedData.size,
      savedData.price,
      savedData.imageUrl
    );
  });
}

// localStorage.removeItem("cartData"); // "cartData'yı temizlemek için"

// ... (Önceki kodlar)

function addToCart(productName, size, price, imageUrl) {
  let productId = `${productName.replace(/\s/g, "")}_${size}`;
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

function changeQuantity(productId, change) {
  let quantityInput = document.getElementById(`quantityInput_${productId}`);
  let currentQuantity = parseInt(quantityInput.value);
  let newQuantity = Math.max(currentQuantity + change, 1);

  quantityInput.value = newQuantity;

  // Fiyatı güncelleme işlemi
  updateTotalPrice();
}

function updateTotalPrice() {
  let totalElement = document.getElementById("total-price");
  let cartList = document.getElementById("cartList");

  if (!totalElement || !cartList) {
    console.error("totalElement or cartList is null.");
    return;
  }

  let cartItems = cartList.getElementsByClassName("row");

  if (!cartItems || cartItems.length === 0) {
    console.error("No cart items found.");
    totalElement.innerText = "0.00 TL"; // Sepet boşsa 0.00 TL olarak ayarla
    return;
  }

  let totalPrice = 0;

  for (let i = 0; i < cartItems.length; i++) {
    let item = cartItems[i];
    let priceElement = item.querySelector(".price");

    if (!priceElement) {
      console.error("Price element not found in cart item.");
      continue; // Geçerli ürünün fiyatı alınamazsa sonraki ürüne geç
    }

    let priceText = priceElement.innerText;

    if (!priceText.includes(" TL")) {
      console.error("Invalid price format:", priceText);
      continue; // Geçerli fiyat formatı değilse sonraki ürüne geç
    }

    let price = parseFloat(priceText.replace(" TL", ""));

    if (isNaN(price)) {
      console.error("Invalid price value:", priceText);
      continue; // Geçerli bir sayı değilse sonraki ürüne geç
    }

    totalPrice += price;
  }

  totalElement.innerText = totalPrice.toFixed(2) + " TL";
}



// Sepet içinde toplam tutarı gösteren alanın üzerine çizgi ekleyen hr elementi
let totalSection = document.createElement("div");
totalSection.classList.add("row", "align-items-center", "text-white-50", "mt-3");
totalSection.innerHTML = `
    <div class="col-md-6"></div>
    <div class="col-md-3">
        <div class="total-label">Toplam Tutar:</div>
    </div>
    <div class="col-md-3">
        <div class="total-price" id="total-price">0.00 TL</div>
    </div>
`;

// Renkli "Ödeme Yap" butonu
let checkoutButton = document.createElement("button");
checkoutButton.classList.add("btn", "btn-primary", "mt-3");
checkoutButton.innerText = "Ödeme Yap";
checkoutButton.addEventListener("click", function () {
    // Burada ödeme sayfasına yönlendirme işlemini yapabilirsiniz
    // Örneğin: window.location.href = 'odeme.html';
});

let hrElement = document.createElement("hr");
hrElement.classList.add("bg-white", "mt-3");

let cartList = document.getElementById("cartList");
cartList.appendChild(totalSection);
cartList.appendChild(hrElement);
cartList.appendChild(checkoutButton);


checkoutButton.addEventListener("click", function () {
  window.location.href = 'odeme.html';
});
