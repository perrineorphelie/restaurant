// ==========================================
// SLIDER ANIMATION (Home Page)
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.slider-track');
    if (track) {
        const images = Array.from(track.children);

        images.forEach(img => {
            const clone = img.cloneNode(true);
            track.appendChild(clone);  
        });

        let speed = 0;
        const targetSpeed = 1;
        
        function animate() {
            speed += (targetSpeed - speed) * 0.1;
            const currentTransform = getComputedStyle(track).transform;
            const matrix = new DOMMatrix(currentTransform);
            let currentX = matrix.m41;
            
            if (Math.abs(currentX) >= track.scrollWidth / 2) {
                currentX = 0;
            }
            
            track.style.transform = `translateX(${currentX - speed}px)`;
            requestAnimationFrame(animate);
        }
        
        // Only start animation if slider exists
        if (images.length > 0) {
            animate();
        }
    }
});

// ==========================================
// RESERVATION SYSTEM
// ==========================================
const modal = document.getElementById('confirmationModal');
const reservationForm = document.getElementById('reservationForm');

if (reservationForm) {
    reservationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(reservationForm);
        const name = formData.get('name');
        const date = formData.get('date');
        const time = formData.get('time');
        const guests = formData.get('guests');
        
        const details = document.getElementById('confirmationDetails');
        details.innerHTML = `
            <strong>Name:</strong> ${name}<br>
            <strong>Date:</strong> ${formatDate(date)}<br>
            <strong>Time:</strong> ${time}<br>
            <strong>Guests:</strong> ${guests}
        `;
        
        modal.style.display = 'flex';
    });
}

function closeModal() {
    if (modal) {
        modal.style.display = 'none';
    }
    if (reservationForm) {
        reservationForm.reset();
    }
}

// Close modal when clicking X
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('close-btn')) {
        closeModal();
    }
    if (e.target === modal) {
        closeModal();
    }
});

function formatDate(dateString) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// ==========================================
// TAKEOUT CART SYSTEM
// ==========================================
let cart = [];

function addToCart(itemName, price) {
    const existingItem = cart.find(item => item.name === itemName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: itemName,
            price: price,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    showAddedFeedback(event.target);
}

function removeFromCart(itemName) {
    cart = cart.filter(item => item.name !== itemName);
    updateCartDisplay();
}

function updateQuantity(itemName, change) {
    const item = cart.find(item => item.name === itemName);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(itemName);
        } else {
            updateCartDisplay();
        }
    }
}

function updateCartDisplay() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartSummary = document.getElementById('cartSummary');
    
    if (!cartCount || !cartItems || !cartTotal) return;
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartCount.textContent = `${totalItems} item${totalItems !== 1 ? 's' : ''}`;
    cartTotal.textContent = totalPrice.toFixed(2);
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <span class="cart-item-name">${item.name}</span>
                    <span class="cart-item-price">$${item.price}</span>
                </div>
                <div class="cart-item-controls">
                    <button onclick="updateQuantity('${item.name}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity('${item.name}', 1)">+</button>
                </div>
            </div>
        `).join('');
    }
    
    // Show/hide cart summary based on items
    if (cartSummary) {
        cartSummary.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

function showAddedFeedback(button) {
    const originalText = button.innerHTML;
    button.innerHTML = '<span class="check">✓</span> ADDED';
    button.classList.add('added');
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.classList.remove('added');
    }, 1500);
}

function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Thank you for your order! Total: $${total.toFixed(2)}\n\nThis would proceed to payment processing.`);
}

// ==========================================
// GIFT CARD SYSTEM
// ==========================================
let selectedAmount = 100;

function selectAmount(amount) {
    selectedAmount = amount;
    
    // Update visual selection
    document.querySelectorAll('.amount-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent === `$${amount}`) {
            btn.classList.add('active');
        }
    });
    
    // Update card preview
    const cardAmount = document.getElementById('cardAmountDisplay');
    const purchaseAmount = document.getElementById('purchaseAmount');
    if (cardAmount) {
        cardAmount.textContent = `$${amount}`;
    }
    if (purchaseAmount) {
        purchaseAmount.textContent = amount;
    }
    
    // Clear custom amount
    const customInput = document.getElementById('customAmount');
    if (customInput) customInput.value = '';
}

function purchaseGiftCard() {
    const customAmount = document.getElementById('customAmount').value;
    const finalAmount = customAmount || selectedAmount;
    const recipientName = document.getElementById('recipientName').value;
    const recipientEmail = document.getElementById('recipientEmail').value;
    const deliveryMethod = document.querySelector('input[name="deliveryMethod"]:checked').value;
    
    if (!recipientName || !recipientEmail) {
        alert('Please fill in recipient details');
        return;
    }
    
    const methodText = deliveryMethod === 'email' ? 'E-gift card' : 'Physical card';
    alert(`${methodText} for $${finalAmount} purchased successfully!\n\nSent to: ${recipientName} (${recipientEmail})`);
}

// Custom amount input listener
document.addEventListener('DOMContentLoaded', function() {
    const customInput = document.getElementById('customAmount');
    if (customInput) {
        customInput.addEventListener('input', function() {
            const value = this.value;
            if (value && value >= 25 && value <= 1000) {
                // Remove active from preset buttons
                document.querySelectorAll('.amount-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                // Update displays
                const cardAmount = document.getElementById('cardAmountDisplay');
                const purchaseAmount = document.getElementById('purchaseAmount');
                if (cardAmount) {
                    cardAmount.textContent = `$${value}`;
                }
                if (purchaseAmount) {
                    purchaseAmount.textContent = value;
                }
                selectedAmount = value;
            }
        });
    }
});