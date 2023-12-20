document.addEventListener("DOMContentLoaded", function () {
    // localStorage'daki sepet verilerini al
    let cartData = JSON.parse(localStorage.getItem("cartData")) || {};

    // Sepetin içeriğini kargo sayfasında göster
    displayShippingCart(cartData);
});

function displayShippingCart(cartData) {
    let shippingCartList = document.getElementById("shippingCartList");
    let totalPriceElement = document.getElementById("total-price");

    // Mevcut içeriği temizle
    shippingCartList.innerHTML = "";

    let totalPrice = 0;

    // Her ürünü göster
    for (let productId in cartData) {
        let item = cartData[productId];
        let itemContainer = document.createElement("div");
        itemContainer.classList.add("cart-item");

        let formattedPrice = `${item.price.toFixed(2)} TL`;
        totalPrice += item.price * item.quantity;

        itemContainer.innerHTML = `
            <img src="${item.imageUrl}" alt="products">
            <div>
                <div class="title">${item.productName} - ${item.size}</div>
                <div class="price">${formattedPrice}</div>
                <div class="quantity-section">Quantity: ${item.quantity}</div>
            </div>
        `;

        shippingCartList.appendChild(itemContainer);
    }

    // Toplam tutarı göster
    totalPriceElement.innerText = `${totalPrice.toFixed(2)} TL`;
}

function proceedToPayment() {
    // Ödeme sayfasına yönlendir
    window.location.href = "odeme.html";
}