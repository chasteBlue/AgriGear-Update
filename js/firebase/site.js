import { auth, app, database, ref, update, query, orderByChild, equalTo, get, remove, deleteUser, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from '../firebase/auth/auth.js';

function fetchProductsAndDisplay() {
  const categoriesContainer = document.getElementById('categories-container');
  const categories = {};

  const dbRef = ref(database, 'product');
  get(dbRef).then((snapshot) => {
    snapshot.forEach(productSnapshot => {
      const product = productSnapshot.val();
      const { category, sku, proName } = product;

      if (!categories[category]) {
        categories[category] = [];
      }

      categories[category].push({ sku, proName });
    });

    for (const [categoryName, products] of Object.entries(categories)) {
      const categoryDiv = document.createElement('div');

      const categoryTitle = document.createElement('div');
      categoryTitle.className = 'title';

      const arrowIcon = document.createElement('i');
      arrowIcon.className = 'arrow-down';
      arrowIcon.innerHTML = '&#9662;'; 

      categoryTitle.appendChild(arrowIcon);
      categoryTitle.appendChild(document.createTextNode(categoryName));

      const productList = document.createElement('div');
      productList.className = 'product-list';

      categoryTitle.addEventListener('click', function() {
        productList.classList.toggle('active');
        productList.style.display = productList.style.display === 'none' ? 'block' : 'none';
        arrowIcon.innerHTML = productList.style.display === 'none' ? '&#9662;' : '&#9652;'; // Toggle between down and up arrow
      });

      products.forEach(({ sku, proName }) => {
        const productLink = document.createElement('a');
        productLink.className = 'product-link';
        productLink.href = `ShopDetail.html?sku=${sku}`;
        productLink.textContent = proName;
        productLink.addEventListener('click', function(event) {
          event.preventDefault();
          localStorage.setItem('productName', proName);
          window.location.href = productLink.href;
        });
        productList.appendChild(productLink);
      });

      categoryDiv.appendChild(categoryTitle);
      categoryDiv.appendChild(productList);
      categoriesContainer.appendChild(categoryDiv);
    }
  });
}

window.onload = fetchProductsAndDisplay;
