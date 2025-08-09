// Global variables
let currentTicketType = '';
let currentTicketPrice = 0;
let selectedPaymentMethod = '';
let currentTicketData = {
    id: '',
    event: 'SchoolFest 2025',
    venue: 'Jakarta Convention Center',
    date: 'August 15, 2025',
    time: '10:00 AM - 6:00 PM',
    name: '',
    email: '',
    type: '',
    price: 0,
    quantity: 1,
    paymentMethod: '',
    paymentStatus: '',
    paymentDate: '',
    phoneNumber: ''
};

// --- MAIN INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    initializeUI();
    initializeTicketSystem();
});

// --- UI INITIALIZATION ---
function initializeUI() {
    AOS.init({ once: true });

    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        }
    });

    const hamburger = document.querySelector('.hamburger');
    const navUl = document.querySelector('nav ul');
    if (hamburger && navUl) {
        hamburger.addEventListener('click', () => {
            navUl.style.display = navUl.style.display === 'flex' ? 'none' : 'flex';
        });
        navUl.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    navUl.style.display = 'none';
                }
            });
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// --- TICKET SYSTEM INITIALIZATION ---
function initializeTicketSystem() {
    document.querySelectorAll('.purchase-btn').forEach(button => {
        button.addEventListener('click', () => {
            const type = button.dataset.type;
            const price = parseInt(button.dataset.price, 10);
            purchaseTicket(type, price);
        });
    });

    document.getElementById('ticketForm').addEventListener('submit', handleFormSubmit);
    
    document.querySelectorAll('.payment-method').forEach(methodDiv => {
        methodDiv.addEventListener('click', () => {
            // Mengambil metode dari atribut data-method
            selectPaymentMethod(methodDiv.dataset.method);
        });
    });

    document.getElementById('confirmPhoneBtn').addEventListener('click', confirmPhonePayment);

    document.getElementById('closePurchaseForm').addEventListener('click', closeForm);
    document.getElementById('closePaymentMethodModal').addEventListener('click', closePaymentMethodModal);
    document.getElementById('closePaymentProcessingModal').addEventListener('click', closePaymentProcessingModal);
}


// --- TICKET PURCHASE FLOW FUNCTIONS ---

function purchaseTicket(type, price) {
    currentTicketType = type;
    currentTicketPrice = price;
    
    document.getElementById('ticketType').value = type;
    document.getElementById('ticketPrice').value = price;
    document.getElementById('quantity').value = type === 'Group' ? '5' : '1';
    
    updatePaymentTotal();
    document.getElementById('purchaseForm').style.display = 'flex';
}

function handleFormSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const quantity = parseInt(document.getElementById('quantity').value);
    
    if (!name || !email || !quantity) return alert('Please fill in all required fields');
    if (currentTicketType === 'Group' && quantity < 5) return alert('Group tickets require a minimum of 5 people');
    
    currentTicketData = {
        ...currentTicketData,
        id: 'TICKET-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        name, email, quantity, type: currentTicketType, price: currentTicketPrice
    };
    
    updatePaymentTotal();
    document.getElementById('purchaseForm').style.display = 'none';
    document.getElementById('paymentMethodModal').style.display = 'flex';
}

function selectPaymentMethod(method) {
    selectedPaymentMethod = method;
    currentTicketData.paymentMethod = method;

    document.getElementById('paymentMethodModal').style.display = 'none';
    document.getElementById('paymentMethodTitle').textContent = `${method.toUpperCase()} Payment`;
    
    const paymentContent = document.getElementById('paymentContent');
    const phoneInputContainer = document.getElementById('phoneInputContainer');
    const paymentStatusDiv = document.querySelector('.payment-status');
    const completePaymentBtn = document.getElementById('completePaymentBtn');
    
    paymentContent.innerHTML = '';
    paymentStatusDiv.style.display = 'none';

    if (method === 'qris') {
        paymentContent.innerHTML = `<div class="payment-instruction"><p>Scan this QR code using your mobile banking app</p><div class="qris-code"><img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TICKET-${currentTicketData.id}" alt="QRIS Code"></div><p class="amount"><strong>IDR ${(currentTicketData.price * currentTicketData.quantity).toLocaleString()}</strong></p><p class="small-text">After paying, click the button below to get your ticket.</p></div>`;
        phoneInputContainer.style.display = 'none';
        completePaymentBtn.style.display = 'block';
        completePaymentBtn.textContent = 'I Have Paid, Get My Ticket';
        completePaymentBtn.onclick = confirmPaymentRequest;
    } else {
        paymentContent.innerHTML = `<div class="payment-instruction"><p>You will receive a payment request on your ${method.toUpperCase()} app.</p><p class="amount">Amount: <strong>IDR ${(currentTicketData.price * currentTicketData.quantity).toLocaleString()}</strong></p></div>`;
        phoneInputContainer.style.display = 'block';
        completePaymentBtn.style.display = 'none';
    }
    
    document.getElementById('paymentProcessingModal').style.display = 'flex';
}

function confirmPhonePayment() {
    const phoneNumber = document.getElementById('paymentPhoneNumber').value;
    if (!phoneNumber.match(/^[0-9]{10,13}$/)) return alert('Please enter a valid Indonesian phone number (10-13 digits)');
    
    currentTicketData.phoneNumber = phoneNumber;
    document.getElementById('phoneInputContainer').style.display = 'none';
    
    const paymentStatusDiv = document.querySelector('.payment-status');
    const paymentStatusText = document.getElementById('paymentStatusText');
    const completePaymentBtn = document.getElementById('completePaymentBtn');
    
    paymentStatusDiv.style.display = 'block';
    paymentStatusText.textContent = 'Sending payment request...';
    completePaymentBtn.style.display = 'none';
    
    setTimeout(() => {
        paymentStatusText.textContent = `Payment request sent. Please confirm payment in your ${selectedPaymentMethod.toUpperCase()} app, then verify here.`;
        completePaymentBtn.style.display = 'block';
        completePaymentBtn.textContent = 'I Have Paid, Verify Payment';
        completePaymentBtn.onclick = confirmPaymentRequest;
    }, 2000);
}

function confirmPaymentRequest() {
    const paymentStatusDiv = document.querySelector('.payment-status');
    const paymentStatusText = document.getElementById('paymentStatusText');
    const completePaymentBtn = document.getElementById('completePaymentBtn');
    const loader = paymentStatusDiv.querySelector('.loader');
    const checkmarkContainer = paymentStatusDiv.querySelector('.checkmark-container');

    if (selectedPaymentMethod === 'qris') {
        document.getElementById('paymentContent').style.display = 'none';
    }
    
    paymentStatusDiv.style.display = 'block';
    paymentStatusText.textContent = 'Verifying payment...';
    completePaymentBtn.style.display = 'none';
    
    if(loader) loader.style.display = 'block';
    if(checkmarkContainer) checkmarkContainer.style.display = 'none';
    
    setTimeout(() => {
        currentTicketData.paymentStatus = 'completed';
        currentTicketData.paymentDate = new Date().toLocaleString();
        
        if(loader) loader.style.display = 'none';
        if(checkmarkContainer) checkmarkContainer.style.display = 'block';

        paymentStatusText.textContent = 'Payment successful!';
        completePaymentBtn.style.display = 'block';
        completePaymentBtn.textContent = 'Download Ticket';
        completePaymentBtn.onclick = completePayment;
    }, 2000);
}

function completePayment() {
    try {
        let tickets = JSON.parse(localStorage.getItem('eventTickets')) || [];
        if (!tickets.some(t => t.id === currentTicketData.id)) {
            tickets.push(currentTicketData);
            localStorage.setItem('eventTickets', JSON.stringify(tickets));
        }
    } catch (error) {
        console.error('Error saving ticket:', error);
    }
    generateAndDownloadTicket(currentTicketData);
}

// --- UTILITY & HELPER FUNCTIONS ---

function generateAndDownloadTicket(ticket) {
    const ticketPreview = document.createElement('div');
    ticketPreview.className = 'ticket-preview';
    ticketPreview.innerHTML = `<h2>${ticket.event}</h2><p><strong>Ticket ID:</strong> ${ticket.id}</p><p><strong>Name:</strong> ${ticket.name}</p><p><strong>Type:</strong> ${ticket.type}</p><p><strong>Quantity:</strong> ${ticket.quantity}</p><p><strong>Total Price:</strong> IDR ${(ticket.price * ticket.quantity).toLocaleString()}</p><p><strong>Payment Method:</strong> ${ticket.paymentMethod.toUpperCase()}</p><p><strong>Status:</strong> ${ticket.paymentStatus.toUpperCase()}</p>${ticket.phoneNumber ? `<p><strong>Phone Number:</strong> ${ticket.phoneNumber}</p>` : ''}<hr><p><strong>Venue:</strong> ${ticket.venue}</p><p><strong>Date:</strong> ${ticket.date}</p><p><strong>Time:</strong> ${ticket.time}</p><div class="barcode"><svg id="barcode-${ticket.id}"></svg></div>`;
    document.body.appendChild(ticketPreview);

    if (typeof JsBarcode !== 'undefined') {
        JsBarcode(`#barcode-${ticket.id}`, ticket.id, { format: "CODE128", lineColor: "#000", width: 2, height: 50, displayValue: true });
    }

    if (typeof html2canvas !== 'undefined') {
        html2canvas(ticketPreview).then(canvas => {
            const link = document.createElement('a');
            link.download = `ticket-${ticket.id}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            ticketPreview.remove();
        });
    } else {
        alert('Download feature not available. Please take a screenshot.');
    }
}

function updatePaymentTotal() {
    const paymentTotalElement = document.getElementById('paymentTotal');
    const quantity = parseInt(document.getElementById('quantity').value) || 1;
    if (paymentTotalElement) {
        paymentTotalElement.textContent = (currentTicketPrice * quantity).toLocaleString();
    }
}

function closeForm() { document.getElementById('purchaseForm').style.display = 'none'; }
function closePaymentMethodModal() { document.getElementById('paymentMethodModal').style.display = 'none'; }
function closePaymentProcessingModal() {
    const modal = document.getElementById('paymentProcessingModal');
    if (modal) {
        modal.style.display = 'none';
        document.getElementById('paymentContent').style.display = 'block';
        document.querySelector('.payment-status').style.display = 'none';
        document.getElementById('paymentPhoneNumber').value = '';
    }
}