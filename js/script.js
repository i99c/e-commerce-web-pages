/* Sepete yeni bir ürün eklemek için kullanılır.
Önce ürünün fiyatını kontrol eder ve geçerli değilse bir hata mesajı yazdırır.
Ürünün benzersiz bir kimliğini (productId) oluşturur.
Eğer aynı ürün zaten sepette bulunuyorsa, miktarını arttırır (changeQuantity fonksiyonunu çağırarak).
Eğer ürün sepette yoksa, yeni bir ürün ekler ve updateCartContent fonksiyonunu çağırarak HTML içeriğini günceller.
Toplam tutarı güncelleyerek ve sepeti kaydederek (saveCartToLocalStorage fonksiyonunu çağırarak) işlemi tamamlar. */
function addToCart(productName, size, price, imageUrl) {
  // Ürün fiyatı kontrolü ekleniyor
  if (isNaN(price) || price === undefined) {
    console.error("Geçersiz fiyat değeri:", price);
    return;
  }

  let productId = `${productName.replace(/\s/g, "")}_${size}`;
  let existingItem = document.getElementById(`cartItem_${productId}`);

  if (existingItem) {
    // Ürün zaten sepette var, miktarını artır
    changeQuantity(productId, 1);
  } else {
    // Yeni ürünü sepete ekle
    updateCartContent(productId, productName, size, price, imageUrl, 1);
    saveCartToLocalStorage(productId, productName, size, price, imageUrl);
  }

  updateTotalPrice();

  // Sepeti kaydet
  saveCartToLocalStorage();
}

/* Sepetteki belirli bir ürünün miktarını artırmak veya azaltmak için kullanılır.
Önce mevcut miktarı alır, ardından değişikliği uygular.
Fiyatı güncellemek ve sepeti kaydetmek için updateTotalPrice ve saveCartToLocalStorage fonksiyonlarını çağırır. */

function changeQuantity(productId, change) {
  let quantityInput = document.getElementById(`quantityInput_${productId}`);
  let currentQuantity = parseInt(quantityInput.value);
  let newQuantity = Math.max(currentQuantity + change, 1);

  quantityInput.value = newQuantity;

  // Fiyatı güncelleme işlemi
  updateTotalPrice();

  // Sepeti kaydet
  saveCartToLocalStorage();
}

/* Sepet içeriğini güncellemek için kullanılır.
Sepetin ürün sayısını artırır.
Yeni bir HTML öğesi oluşturarak sepet listesine ekler.
Toplam tutarı günceller ve resmi kaydeder. */
function updateCartContent(productId, productName, size, price, imageUrl, quantity) {
  let itemCountElement = document.getElementById("item-count");
  let currentItemCount = parseInt(itemCountElement.innerText);
  itemCountElement.innerText = currentItemCount + 1;

  let cartList = document.getElementById("cartList");
  let newItem = document.createElement("div");
  newItem.id = `cartItem_${productId}`;
  newItem.classList.add("row", "align-items-center", "text-white-50");

  // İlgili öğeyi kontrol et
  let formattedPrice = price !== undefined ? `${parseFloat(price).toFixed(2)} TL` : "0.00 TL";

  newItem.innerHTML = `
    <div class="col-md-3">
      <img src="${imageUrl}" alt="products" class="img-fluid">
    </div>
    <div class="col-md-5">
      <div class="title">${productName} - ${size}</div>
    </div>
    <div class="col-md-3">
      <div class="price">${formattedPrice}</div>
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

  // Resmi saklamak için örnek bir yöntem
  saveImageToLocalStorage(productId, imageUrl);
}

/* Sepetten belirli bir ürünü kaldırmak için kullanılır.
HTML içeriğinden ilgili ürünü kaldırır.
LocaleStorage'dan ürünü kaldırır ve toplam tutarı günceller. */
function removeCartItem(productId, imageUrl) {
  let cartItem = document.getElementById(`cartItem_${productId}`);
  cartItem.remove();

  removeFromLocalStorage(productId, imageUrl);
  updateCartCount();
  updateTotalPrice();
  saveCartToLocalStorage(productId, imageUrl); // Ürünü kaldırdıktan sonra localStorage'a kaydet
}

// LocaleStorage'dan belirli bir ürünü kaldırmak için kullanılır.
function removeFromLocalStorage(productId) {
  let cartData = JSON.parse(localStorage.getItem("cartData")) || {};
  if (cartData.hasOwnProperty(productId)) {
    delete cartData[productId];
    localStorage.setItem("cartData", JSON.stringify(cartData));
  }
}

// Sepet içindeki ürün sayısını günceller.
function updateCartCount() {
  let itemCountElement = document.getElementById("item-count");
  let currentItemCount = parseInt(itemCountElement.innerText);
  itemCountElement.innerText = currentItemCount - 1;
}

// LocaleStorage'a ürün resmini kaydetmek için kullanılır.
function saveImageToLocalStorage(productId, imageUrl) {
 
  localStorage.setItem(`productImage_${productId}`, imageUrl);
}

// LocaleStorage'a sepet verilerini kaydetmek için kullanılır.
function saveCartToLocalStorage(productId, productName, size, price, imageUrl) {
  let cartData = JSON.parse(localStorage.getItem("cartData")) || {};
  cartData[productId] = { productName, size, price, imageUrl };
  localStorage.setItem("cartData", JSON.stringify(cartData));
}

// LocaleStorage'a sepet verilerini kaydetmek için kullanılır.
function saveCartToLocalStorage() {
  let cartData = {};
  let cartList = document.getElementById("cartList");
  if (!cartList) {
    console.error("cartList bulunamadı.");
    return;
  }

  let cartItems = cartList.getElementsByClassName("row");

  for (let i = 0; i < cartItems.length; i++) {
    let item = cartItems[i];
    let productId = item.id.replace("cartItem_", "");
    let titleElement = item.querySelector(".title");
    let priceElement = item.querySelector(".price");
    let quantityInput = item.querySelector(".quantity-input");
    let imgElement = item.querySelector("img");

    if (!titleElement || !priceElement || !quantityInput || !imgElement) {
      console.error("Gerekli öğe cart item içinde bulunamadı:", item);
      continue; // Gerekli öğelerden biri eksikse bu öğeyi atla
    }

    let productName = titleElement.innerText.split(" - ")[0];
    let size = titleElement.innerText.split(" - ")[1];
    let priceText = priceElement.innerText;
    let price = parseFloat(priceText.replace(" TL", "").replace(",", ""));
    let imageUrl = imgElement.getAttribute("src");
    let quantity = parseInt(quantityInput.value);

    cartData[productId] = { productName, size, price, imageUrl, quantity };
  }

  // Verileri localStorage'a kaydet
  localStorage.setItem("cartData", JSON.stringify(cartData));
}



function selectSize(productName, size, price, imageUrl) {
  // Ürün fiyatı kontrolü ekleniyor
  if (isNaN(price) || price === undefined) {
    console.error("Geçersiz fiyat değeri:", price);
    return;
  }

  addToCart(productName, size, price, imageUrl);
}

document.getElementById("cartBtn").addEventListener("click", function () {
  let cartList = document.getElementById("cartList");
  cartList.classList.toggle("show");
});
window.onload = function () {
  // Sepetteki ürünleri alıyoruz
  let cart = JSON.parse(sessionStorage.getItem("cart")) || [];
 
  // Sepetteki ürünleri görüntüleme
  displayCart(cart);
 };

 window.onbeforeunload = function () {
  // Sayfadan ayrılmadan önce sepeti sessionStorage'a kaydet
  saveCartToSessionStorage();
};
function saveCartToSessionStorage() {
  let cartData = {};
  let cartItems = document.getElementById("cartList").getElementsByClassName("row");

  for (let i = 0; i < cartItems.length; i++) {
    let item = cartItems[i];
    let productId = item.id.replace("cartItem_", "");
    let productName = item.querySelector(".title").innerText.split(" - ")[0];
    let size = item.querySelector(".title").innerText.split(" - ")[1];
    let priceText = item.querySelector(".price").innerText;
    let price = parseFloat(priceText.replace(" TL", "").replace(",", ""));
    let imageUrl = item.querySelector("img").getAttribute("src");
    let quantity = parseInt(item.querySelector(".quantity-input").value);

    cartData[productId] = { productName, size, price, imageUrl, quantity };
  }

  // Verileri sessionStorage'a kaydet
  sessionStorage.setItem("cartData", JSON.stringify(cartData));
}

function updateCartFromSessionStorage() {
  let cartData = JSON.parse(localStorage.getItem("cartData")) || {};
  for (let productId in cartData) {
    let { productName, size, price, imageUrl, quantity } = cartData[productId];
    updateCartContent(
      productId,
      productName,
      size,
      price !== undefined ? price : 0,
      imageUrl,
      quantity
    );
  }
}




window.onload = function () {
  // Sayfa yüklendiğinde sessionStorage'deki sepet verilerini kontrol et
  updateCartFromSessionStorage();
};




function addExtraProducts() {
  let productElements = document.querySelectorAll(".product");
  productElements.forEach((productElement) => {
    let productName = productElement.querySelector(".product-name").innerText;
    let size = productElement.querySelector(".product-size").innerText;
    let priceText = productElement.querySelector(".product-price").innerText; // Fiyat metnini doğru şekilde al

    console.log("productName:", productName);
    console.log("size:", size);
    console.log("priceText:", priceText);

    // Fiyatı düzgün bir şekilde çözümle
    let price = parseFloat(priceText.replace(" TL", ""));

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
    let quantityInput = item.querySelector(".quantity-input");

    if (!priceElement || !quantityInput) {
      console.error("Price or quantity input element not found in cart item.");
      continue; // Geçerli ürünün fiyatı veya miktarı alınamazsa sonraki ürüne geç
    }

    let priceText = priceElement.innerText;

    if (!priceText.includes(" TL")) {
      console.error("Invalid price format:", priceText);
      continue; // Geçerli fiyat formatı değilse sonraki ürüne geç
    }

    let price = parseFloat(priceText.replace(" TL", "").replace(",", ""));
    let quantity = parseInt(quantityInput.value);

    if (isNaN(price) || isNaN(quantity)) {
      console.error("Invalid price or quantity value.");
      continue; // Geçerli bir sayı değilse sonraki ürüne geç
    }

    totalPrice += price * quantity;
  }

  totalElement.innerText = totalPrice.toFixed(2) + " TL";
}
// Sepet içinde toplam tutarı gösteren alanın üzerine çizgi ekleyen hr elementi
let totalSection = document.createElement("div");
totalSection.classList.add(
  "row",
  "align-items-center",
  "text-white-50",
  "mt-3"
);
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
  window.location.href = "kargo.html";
});


// 'cart-table' ID'sine sahip HTML tablosu bulunuyor
let cartTable = document.getElementById("cart-table");

// 'total-price' ID'sine sahip HTML elemanı bulunuyor
let totalPrice = document.getElementById("total-price");

// Videonun DOM öğesini seçin
let video = document.getElementById("video");

// Videonun oynatılması için bir event listener ekleyin
video.addEventListener("click", function() {
    if (video.paused) {
        video.play(); // Eğer durmuşsa, oynat
    } else {
        video.pause(); // Eğer oynatılıyorsa, duraklat
    }
});

// Videonun oynama durumunu izleyin ve durum değiştiğinde gerekli işlemleri yapın
video.addEventListener("play", function() {
    console.log("Video oynatılıyor");
});

video.addEventListener("pause", function() {
    console.log("Video duraklatıldı");
});

video.addEventListener("ended", function() {
    console.log("Video tamamlandı");
});


 

