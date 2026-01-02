/* SCRIPT.JS */


let cart = {};

(function() {
    emailjs.init("YOUR_PUBLIC_KEY");  
})();


/* FUNCTION: scrollToSection */
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}


/* FUNCTION: addToCart */
function addToCart(serviceId, name, price) {
  
    if (cart[serviceId]) {
        alert('This service is already in your cart!');
        return;
    }
    
       cart[serviceId] = { name, price };
    
       const serviceItem = document.querySelector(`[data-service="${serviceId}"]`);
    const button = serviceItem.querySelector('.service-btn');
    
    button.className = 'service-btn remove-btn';
    button.innerHTML = 'Remove Item <i class="fas fa-minus-circle"></i>';
    button.onclick = function() { removeFromCart(serviceId); };
    
    updateCartDisplay();
}


/* FUNCTION: removeFromCart */
function removeFromCart(serviceId) {
    
    const serviceInfo = cart[serviceId];
        
    delete cart[serviceId];
      
    const serviceItem = document.querySelector(`[data-service="${serviceId}"]`);
    const button = serviceItem.querySelector('.service-btn');
    
    button.className = 'service-btn add-btn';
    button.innerHTML = 'Add Item <i class="fas fa-plus-circle"></i>';
    button.onclick = function() { 
        addToCart(serviceId, serviceInfo.name, serviceInfo.price); 
    };
    
    updateCartDisplay();
}


/* FUNCTION: updateCartDisplay */
function updateCartDisplay() {
    const cartBody = document.getElementById('cart-body');
    const totalElement = document.getElementById('total-amount');
    
    cartBody.innerHTML = '';
    
    const items = Object.entries(cart);
    
    items.forEach(([id, item], index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.name}</td>
            <td>₹${item.price.toFixed(2)}</td>
        `;
        cartBody.appendChild(row);
    });
    
    const total = calculateTotal();
    totalElement.textContent = `₹ ${total.toFixed(2)}`;
}


/* FUNCTION: calculateTotal */
function calculateTotal() {
    return Object.values(cart).reduce((sum, item) => sum + item.price, 0);
}


/* FUNCTION: handleBooking */
function handleBooking(event) {

    event.preventDefault();
    
    if (Object.keys(cart).length === 0) {
        alert('Please add at least one service to your cart!');
        return;
    }
    
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    
    const servicesList = Object.values(cart)
        .map(item => `${item.name} - ₹${item.price}`)
        .join('\n');
    
    const total = calculateTotal();
    

    const bookBtn = document.getElementById('book-btn');
    bookBtn.disabled = true;
    bookBtn.textContent = 'Processing...';
    
    const templateParams = {
        from_name: fullName,
        from_email: email,
        phone: phone,
        services: servicesList,
        total: `₹${total.toFixed(2)}`
    };
    
    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
        .then(function(response) {
            console.log('Email sent successfully!', response.status);
        }, function(error) {
            console.log('EmailJS not configured yet:', error);
        });
    
    document.getElementById('success-msg').classList.add('show');
 
    document.getElementById('booking-form').reset();
    
    cart = {};
    updateCartDisplay();
    
    resetAllButtons();
    
    bookBtn.disabled = false;
    bookBtn.textContent = 'Book now';
}


/* FUNCTION: resetAllButtons */
function resetAllButtons() {
    document.querySelectorAll('.remove-btn').forEach(btn => {
        const serviceItem = btn.closest('.service-item');
        const serviceId = serviceItem.dataset.service;
        const serviceName = serviceItem.querySelector('.service-name').textContent;
        const price = parseInt(serviceItem.dataset.price);
        
        btn.className = 'service-btn add-btn';
        btn.innerHTML = 'Add Item <i class="fas fa-plus-circle"></i>';
        btn.onclick = function() { 
            addToCart(serviceId, serviceName, price); 
        };
    });
}


/* FUNCTION: handleNewsletter */
function handleNewsletter(event) {
    event.preventDefault();
    alert('Thank you for subscribing to our newsletter!');
    event.target.reset();
}
