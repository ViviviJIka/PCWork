let productsFromJSON = []; // Создаём переменную для хранения данных

const productsFromDir = 
[
    {
        name: "Болтик для видеокарты",
        price: 1,
        description: "Болт для закрепления видеокарты",
        photo: "img/services/gpu.jpg"
    },
    {
        name: "Болтик для корпуса",
        price: 2,
        description: "Болт для любых компонентов в корпусе",
        photo: "img/services/case.jpg"
    },
    {
        name: "Болтики для мат.платы",
        price: 10,
        description: "Болты для прикручивания материнской платы к корпусу",
        photo: "img/services/mb.jpg"
    },
    {
        name: "Стяжка (Чёрная)",
        price: 5,
        description: "Чёрная кабельная стяжка для кабель-менеджмента",
        photo: "img/services/black.jpg"
    },
    {
        name: "Стяжка (Белая)",
        price: 7,
        description: "Белая кабельная стяжка для кабель-менеджмента",
        photo: "img/services/white.jpg"
    },
    {
        name: "Стяжка (Цветная)",
        price: 10,
        description: "Цветная кабельная стяжка для кабель-менеджмента",
        photo: "img/services/color.jpg"
    }
];



  // Запрос товаров с сервера
fetch('https://gexpc.ru/api/services')
  .then(response => {
    if (!response.ok) throw new Error('Ошибка сети');
    return response.json();
  })
  .then(data => {
    productsFromJSON = data;

    productsFromJSON.sort(function(a, b) { // Сартирофка правилам буравчика
        return a.price - b.price;
    });

    renderServices();
  })
  .catch(error => {
    console.error('Произошла ошибка:', error);
  });

let servicesList = document.querySelector('.services__list');
let additionalServicesList = document.querySelector(".additional__services");
let productTemplate = document.getElementById('service-item');

    //Рендер услуг из JSON 
let itemTemplate = document.getElementById('product');

function renderServices() {

    for (let product in productsFromJSON) {
        let serviceItem = productTemplate.content.cloneNode(true);
        
        serviceItem.querySelector('.services__item-price').textContent = productsFromJSON[product].price;
        serviceItem.querySelector('.services__item-name').textContent = productsFromJSON[product].name;

        for (let descItem in productsFromJSON[product].description) {
            let newElement = document.createElement('li');
            newElement.textContent = productsFromJSON[product].description[descItem];
            serviceItem.querySelector('.services__item-desc').appendChild(newElement);
        }

        serviceItem.querySelector('img').setAttribute('src', `api/${ productsFromJSON[product].photo}`);

        addToCartFunction(serviceItem, product);

        servicesList.appendChild(serviceItem);
    }
}

renderAdditionalServices();

function renderAdditionalServices() {
    for (let product in productsFromDir) {
        let serviceItem = productTemplate.content.cloneNode(true);
        
        serviceItem.querySelector('.services__item-price').textContent = productsFromDir[product].price;
        serviceItem.querySelector('.services__item-name').textContent = productsFromDir[product].name;

        serviceItem.querySelector('.services__item-desc').textContent = productsFromDir[product].description;

        serviceItem.querySelector('img').setAttribute('src', `${ productsFromDir[product].photo}`);

        addToCartFromAdditional(serviceItem, product);

        additionalServicesList.appendChild(serviceItem);
    }
}

  // Переменные с DOM-объектами;
const cartButton = document.querySelector('.button__cart'); // Кнопка открытия корзины
const cartMenu = document.querySelector('.show-menu'); // Корзина
const cartItemList = document.querySelector('.cart-menu-list'); // Список для товаров в корзине
const cartPrice = document.querySelector('.cart-price'); // Общая стоимость товаров в корзине
const cartClearButton = document.querySelector('.cart-clear-button'); // Кнопка очистки корзины
const headerCartPrice = document.querySelector('.header__cart-price'); // Сумма корзины рядом с кнопкой
const cartPayButton = document.querySelector('.cart-pay-button'); // Кнопка оплаты товара
const tipsPayButton = document.querySelector('.tips__button-pay'); // Кнопка оплаты чаевых 


cartItemList.innerHTML = '';

let cart = JSON.parse(localStorage.getItem('cart')) || {};

    // Сохранение корзины в localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

    // Функция добавления товара в корзину
function addToCartFunction(serviceItem, product) {
    serviceItem.querySelector('.services__item-cart').addEventListener('click', function(e) {

        let templateClone = itemTemplate.content.cloneNode(true);
        let itemsInCart = document.querySelectorAll('.cart-item-name');
        let found = false;

        if (itemsInCart.length != 0) {

            for (item of itemsInCart) {
                if (item.textContent === productsFromJSON[product].name) {
                    let currentItem = item.closest('.cart-menu-item');
                    let currentCount = currentItem.querySelector('.cart-item-count');
                    currentCount.textContent = Number(currentCount.textContent) + 1;
                    
                        // Обновление количества товара в объекте cart
                    cart[productsFromJSON[product].name].quantity++;
                    
                    found = true;
                    break;
                }
            }
        }

            // Если товар не найден, добавляем его в DOM и в объект cart
        if (!found) { 
            templateClone.querySelector('.cart-item-name').textContent = productsFromJSON[product].name;
            templateClone.querySelector('.cart-item-price').textContent = productsFromJSON[product].price;
            templateClone.querySelector('img').setAttribute('src', `api/${ productsFromJSON[product].photo}`);

            let incButton = templateClone.querySelector('.increase-cart-item');
            let decButton = templateClone.querySelector('.decrease-cart-item');

            addControlButtonEvents(incButton, decButton);
            cartItemList.appendChild(templateClone);

                // Добавление нового товара в объект cart
            cart[productsFromJSON[product].name] = {
                price: productsFromJSON[product].price,
                quantity: 1,
                photo: `api/${ productsFromJSON[product].photo}`
            };
        }

        saveCart();
        calculateCartPrice();
    });
}

function addToCartFromAdditional(serviceItem, product) {
    serviceItem.querySelector('.services__item-cart').addEventListener('click', function(e) {

        let templateClone = itemTemplate.content.cloneNode(true);
        let itemsInCart = document.querySelectorAll('.cart-item-name');
        let found = false;

        if (itemsInCart.length != 0) {

            for (item of itemsInCart) {
                if (item.textContent === productsFromDir[product].name) {
                    let currentItem = item.closest('.cart-menu-item');
                    let currentCount = currentItem.querySelector('.cart-item-count');
                    currentCount.textContent = Number(currentCount.textContent) + 1;
                    
                        // Обновление количества товара в объекте cart
                    cart[productsFromDir[product].name].quantity++;
                    
                    found = true;
                    break;
                }
            }
        }

            // Если товар не найден, добавляем его в DOM и в объект cart
        if (!found) { 
            templateClone.querySelector('.cart-item-name').textContent = productsFromDir[product].name;
            templateClone.querySelector('.cart-item-price').textContent = productsFromDir[product].price;
            templateClone.querySelector('img').setAttribute('src', `${ productsFromDir[product].photo}`);

            let incButton = templateClone.querySelector('.increase-cart-item');
            let decButton = templateClone.querySelector('.decrease-cart-item');

            addControlButtonEvents(incButton, decButton);
            cartItemList.appendChild(templateClone);

                // Добавление нового товара в объект cart
            cart[productsFromDir[product].name] = {
                price: productsFromDir[product].price,
                quantity: 1,
                photo: `${ productsFromDir[product].photo}`
            };
        }

        saveCart();
        calculateCartPrice();
    });
}

    // Функция загрузки корзины при старте страницы
function loadCart() {
    for (let product in cart) {
        let templateClone = itemTemplate.content.cloneNode(true);
    
        templateClone.querySelector('.cart-item-name').textContent = product;
        templateClone.querySelector('.cart-item-price').textContent = cart[product].price;
        templateClone.querySelector('.cart-item-count').textContent = cart[product].quantity;
        templateClone.querySelector('img').setAttribute('src', cart[product].photo);
    
        let incButton = templateClone.querySelector('.increase-cart-item');
        let decButton = templateClone.querySelector('.decrease-cart-item');
    
        addControlButtonEvents(incButton, decButton);
        cartItemList.appendChild(templateClone);

        calculateCartPrice();
    }
}
    
    // Загрузка корзины при загрузке страницы
document.addEventListener('DOMContentLoaded', loadCart);

    // Функция добавления обработчиков событий на кнопки + и -
function addControlButtonEvents(incButton, decButton) {

    incButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        const cartItem = this.closest('.cart-menu-item');
        const itemName = cartItem.querySelector('.cart-item-name').textContent;
        const quantityInput = cartItem.querySelector('.cart-item-count');
        quantityInput.textContent = Number(quantityInput.textContent) + 1;

            // Обновляем количество в объекте cart
        cart[itemName].quantity++;
        saveCart(); 

        calculateCartPrice();
    });

    decButton.addEventListener('click', function(e) {
        e.preventDefault();
    
        const cartItem = this.closest('.cart-menu-item');
        const itemName = cartItem.querySelector('.cart-item-name').textContent;
        const quantityInput = cartItem.querySelector('.cart-item-count');
        const newQuantity = Number(quantityInput.textContent) - 1;

        if (newQuantity >= 1) {

            quantityInput.textContent = newQuantity;
            cart[itemName].quantity--;
            saveCart(); 

        } else {

            cartItem.remove();
            delete cart[itemName];
            saveCart();
        }

        calculateCartPrice();
    });
}

    // Функция подсчёта общей стоимости корзины
function calculateCartPrice() {
    let totalPrice = 0;

    let allCartItems = document.querySelectorAll('.cart-menu-item');
    allCartItems.forEach(function(item) {
        totalPrice += Number(item.querySelector('.cart-item-count').textContent) * Number(item.querySelector('.cart-item-price').textContent.replace('Р', ''));
    })

    headerCartPrice.textContent = totalPrice + ' руб.';
    cartPrice.textContent = `Общая цена: ${totalPrice} руб.`;
}

    // Открывание / закрывание меню
cartButton.addEventListener('click', function(e) { 
    e.preventDefault();
    cartMenu.classList.toggle('show');
    cartButton.classList.toggle('isActive');
});

    // Кнопка очистки корзины
cartClearButton.addEventListener('click', function(e) {
    e.preventDefault();

    let cartList = document.querySelectorAll('.cart-menu-item');

    cartList.forEach(function(item) {
        item.remove();
    })

    cart = {};
    localStorage.removeItem('cart');
    cartItemList.innerHTML = '';
    cartPrice.textContent = `Общая цена: 0 руб.`;
    headerCartPrice.textContent = '';
});

    // Оплата корзины
cartPayButton.addEventListener('click', async function(e) {
    e.preventDefault();
    const form = document.querySelector('.cart-form');

    const fullName = form.querySelector('input[type="firstname"]').value.trim();
    const phone = form.querySelector('input[type="tel"]').value.trim();

    const itemsList = Object.entries(cart).map(([name, item]) => ({
        name,
        price: item.price,
        quantity: item.quantity
    }));

    fetch('https://gexpc.ru/api/create-payment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            description: 'Оплата заказа',
            customer: {
                full_name: fullName ,
                phone: phone,
            },
            itemsList: itemsList
        })
    })
        .then(response => {
            if (!response.ok) throw new Error('Ошибка при создании платежа');
            return response.json();
        })
        .then(data => {
            if (data.confirmation_url) {
                window.location.href = data.confirmation_url;
            } else {
                console.log('Ответ от сервера:', data);
            }
        })
        .catch(error => {
            console.error('Ошибка при оплате:', error);
        });
});