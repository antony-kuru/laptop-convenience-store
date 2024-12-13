// script.js
const products = [
    { id: 1, name: 'Laptop 1', price: 999 },
    { id: 2, name: 'Laptop 2', price: 1299 },
    { id: 3, name: 'Laptop 3', price: 1599 },
];

function displayProducts() {
    const productList = document.getElementById('product-list');
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.innerHTML = `<h3>${product.name}</h3><p>Price: $${product.price}</p>`;
        productList.appendChild(productCard);
    });
}

window.onload = displayProducts;