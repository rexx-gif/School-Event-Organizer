// Global variables
let currentTicketType = '';
let currentTicketPrice = 0;
let selectedPaymentMethod = '';
let currentTicketData = {
    id: '',
    event: 'SchoolFest 2025',
    venue: 'Indoor SMKN 1 Bondowoso',
    date: 'Agustus 15, 2025',
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

document.addEventListener('DOMContentLoaded', () => {
    initializeUI();
    initializeTicketSystem();
});



function initializeUI() {
    AOS.init({ once: true });

    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
    
    const hamburger = document.querySelector('.hamburger');
    const navUl = document.querySelector('nav ul');
    if (hamburger && navUl) {
        hamburger.addEventListener('click', () => {
            navUl.classList.toggle('active');
        });
    }

    const backToTopBtn = document.getElementById('backToTopBtn');
    const heroSection = document.getElementById('home');
    if (backToTopBtn && heroSection) {
        window.addEventListener('scroll', () => {
            backToTopBtn.classList.toggle('show', window.scrollY > heroSection.offsetHeight);
        });
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Chatbot AI Initialization
    initializeChatbot();
}

 (function(){
        emailjs.init("ImEIAz3SHbAg1nLZj"); // ⚠️ Replace with your actual Public Key
    })();

    document.getElementById("confirmPhoneBtn").addEventListener("click", function(e) {
        e.preventDefault(); // Prevent page reload

        const now = new Date()

    const fullName = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value;
        const quantity = document.getElementById("quantity").value;
        const ticketType = document.getElementById("ticketType").value;
        const ticketPrice = document.getElementById("ticketPrice").value;
        const tanggalPembelian = now.toLocaleString("id-ID",{
             day: "2-digit",
            month: "2-digit",
            year: "numeric"
        })
        const jamPembelian = now.toLocaleString("id-ID",{
            hour : "2-digit",
            minute : "2-digit",
            second : "2-digit"
        })


        // Create the parameters object for EmailJS
        const templateParams = {
            from_name: fullName,
            from_mail: email,
            ticket_type: ticketType,
            quantity: quantity,
            total_price: ticketPrice * quantity,
            purchase_time : jamPembelian,
            purchase_date : tanggalPembelian,
            to_email: "schoolfestconcert@gmail.com" // gc
        };

            if (!fullName || !email || !ticketType || !quantity || !ticketPrice) {
        alert("Mohon lengkapi semua data sebelum melanjutkan.");
        return;
    }

        // Now you can safely call emailjs.send
        // Note: The third argument should be the template parameters object.
        emailjs.send("service_33yg3na", "template_1lc68gk", templateParams)
            .then(
                res => {
                    alert("✅ Pesanan terkirim ke email!");
                    console.log("SUCCESS!", res.status, res.text);
                },
                err => {
                    alert("❌ Gagal mengirim pesanan: " + JSON.stringify(err));
                    console.log("FAILED...", err);
                }
            );
    });

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
        methodDiv.addEventListener('click', () => selectPaymentMethod(methodDiv.dataset.method));
    });
    document.getElementById('confirmPhoneBtn').addEventListener('click', confirmPhonePayment);
    document.getElementById('closePurchaseForm').addEventListener('click', closeForm);
    document.getElementById('closePaymentMethodModal').addEventListener('click', closePaymentMethodModal);
    document.getElementById('closePaymentProcessingModal').addEventListener('click', closePaymentProcessingModal);
}

// --- CHATBOT AI WITH OPEN ROUTER API ---
function initializeChatbot() {
    const chatbotBtn = document.getElementById('chatbotBtn');
    const chatbotModal = document.getElementById('chatbotModal');
    const closeChatbot = document.getElementById('closeChatbot');
    const sendChatBtn = document.getElementById('sendChatBtn');
    const chatInput = document.getElementById('chatInput');

   // --- LOGIKA BARU ---
if (chatbotBtn && chatbotModal && closeChatbot) {
    chatbotBtn.addEventListener('click', () => {
        chatbotModal.classList.toggle('show');
    });
    closeChatbot.addEventListener('click', () => {
        chatbotModal.classList.remove('show');
    });
}

    const handleSendChat = () => {
        const userMessage = chatInput.value.trim();
        if (userMessage === '') return;
        appendMessage(userMessage, 'user');
        chatInput.value = '';
    getOpenRouterResponse(userMessage);
    };

    if (sendChatBtn && chatInput) {
        sendChatBtn.addEventListener('click', handleSendChat);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSendChat();
        });
    }
}

async function getOpenRouterResponse(userMessage) {
    const chatbox = document.getElementById('chatbox');
    const thinkingIndicator = document.getElementById('botThinking');
    thinkingIndicator.style.display = 'block';
    chatbox.scrollTop = chatbox.scrollHeight;

    const systemPrompt = `
        RESPON JAWABAN DENGAN SANGAT MANUSIAWI DAN TIDAK ADA TANDA TANDA AI ATAU ROBOT
        Berbicara seperti anggota Gen Z. Sampaikan apa adanya; tanpa mempermanis respons. Inovatif dan berpikir di luar kebiasaan.
        Kamu adalah AI Asisten untuk siswa yg hadir dalam konser ini,harap bersikap sopan dan asik pada semua user.
        jangan meggunakan bahasa baku
        pakai bahasa indonesia9
        jangan pernah pakai huruf kapial dan kalo jawab make huruf kecil semua dan jangan pakai tanda baca
        kalo ngerespon make aku kamu jangan make lo gue
        Berikut adalah informasi lengkap tentang acara SchoolFest:
        - Nama Acara: SchoolFest 2025
        - Bintang Tamu Utama: Baskara Hindia
        - Tanggal: 15 Agustus 2025
        - Lokasi: Indoor Sasana Krida Wiyata SMKN 1 Bondowoso
        - Rafi : Hama dunia
        - Jadwal: Gerbang dibuka pukul 15:00, Penampilan utama pukul 18:00.
        - Harga Tiket: 
          - Regular: IDR 50,000
          - VIP: IDR 150,000 (dapat kursi prioritas & merchandise eksklusif)
          - Grup: IDR 40,000 per orang (minimal pembelian 5 tiket)
        - Developer Website : Developer website ini adalah siswa SMKN 1 Bondowoso dari Kelas XI RPL 2 yg bernama Rafi Abdillah Fairuz,Satria Nanda Tama,dan Septiyan Bintang Ramadhan Putra,keren kan mereka membuat website seperti ini. 
        
        ATURAN WAJIB:
        1. Jika pertanyaan pengguna berhubungan dengan SchoolFest (harga, jadwal, lokasi, bintang tamu, dll), jawab dengan ramah berdasarkan informasi di atas.
        2. Jika pertanyaan pengguna TIDAK ADA HUBUNGANNYA SAMA SEKALI dengan SchoolFest (misal: "Apa ibukota Prancis?", "buatkan saya puisi", "siapa presiden Indonesia?"), Anda HARUS menolak dengan sopan.
        3. Jaga jawaban agar singkat dan jelas.

        Pertanyaan Pengguna: "${userMessage}"
    `;

    const apiKey = "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";
    const apiUrl = "https://openrouter.ai/api/v1/chat/completions";

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': window.location.origin,
                'X-Title': 'SchoolFest Chatbot'
            },
            body: JSON.stringify({
                model: "openai/gpt-4o-mini",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userMessage }
                ],
                temperature: 0.7
            })
        });

        if (!response.ok) throw new Error(`API Error: ${response.status}`);

        const result = await response.json();
        const botResponse = result.choices[0].message.content;
        appendMessage(botResponse, 'bot');

    } catch (error) {
        console.error("OpenRouter API call failed:", error);
        appendMessage("Maaf, lagi error. Coba lagi nanti ya.", 'bot');
    } finally {
        thinkingIndicator.style.display = 'none';
    }
}

function appendMessage(message, sender) {
    const chatbox = document.getElementById('chatbox');
    const thinkingIndicator = document.getElementById('botThinking');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message', sender);
    messageDiv.textContent = message;
    
    // Sisipkan pesan sebelum indikator "mengetik"
    chatbox.insertBefore(messageDiv, thinkingIndicator);
    chatbox.scrollTop = chatbox.scrollHeight;
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
    currentTicketData = { ...currentTicketData, id: 'TICKET-' + Math.random().toString(36).substr(2, 9).toUpperCase(), name, email, quantity, type: currentTicketType, price: currentTicketPrice };
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
        paymentContent.innerHTML = `<div class="payment-instruction"><p>Scan this QR code</p><div class="qris-code"><img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TICKET-${currentTicketData.id}" alt="QRIS Code"></div><p class="amount"><strong>IDR ${(currentTicketData.price * currentTicketData.quantity).toLocaleString()}</strong></p><p class="small-text">After paying, click the button below.</p></div>`;
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
    if (!phoneNumber.match(/^[0-9]{10,13}$/)) return alert('Please enter a valid Indonesian phone number');
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
        completePaymentBtn.textContent = 'I Have Email, Verify Payment';
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
    } catch (error) { console.error('Error saving ticket:', error); }
    generateAndDownloadTicket(currentTicketData);
}
function generateAndDownloadTicket(ticket) {
    const ticketPreview = document.createElement('div');
    ticketPreview.className = 'ticket-concert';
    
    ticketPreview.style.position = 'fixed';
    ticketPreview.style.left = '-9999px';
    ticketPreview.style.top = '0px';

    ticketPreview.innerHTML = `
        <div class="ticket-main">
            <div class="header">
                <span class="eyebrow">SCHOOLFEST 2025 CONCERT</span>
                <h1 class="artist">${ticket.event} - BASKARA HINDIA</h1>
            </div>
            <div class="details">
                <div class="info-group">
                    <span class="label">NAMA</span>
                    <span class="value">${ticket.name}</span>
                </div>
                <div class="info-group">
                    <span class="label">TIPE TIKET</span>
                    <span class="value">${ticket.type.toUpperCase()}</span>
                </div>
                <div class="info-group">
                    <span class="label">TANGGAL</span>
                    <span class="value">${ticket.date}</span>
                </div>
                <div class="info-group">
                    <span class="label">LOKASI</span>
                    <span class="value">${ticket.venue}</span>
                </div>
            </div>
            <div class="barcode-area">
                 <svg id="barcode-${ticket.id}"></svg>
            </div>
        </div>
        <div class="ticket-stub">
            <div class="stub-info">
                 <h3 class="stub-artist">HINDIA</h3>
                 <span class="stub-label">ID TIKET</span>
                 <span class="stub-id">${ticket.id}</span>
                 <svg id="stub-barcode-${ticket.id}" class="stub-barcode"></svg>
            </div>
        </div>
    `;

    document.body.appendChild(ticketPreview);


    JsBarcode(`#barcode-${ticket.id}`, ticket.id, {
        format: "CODE128",
        lineColor: "#000",
        width: 2.5,
        height: 50,
        displayValue: false
    });

    JsBarcode(`#stub-barcode-${ticket.id}`, ticket.id, {
        format: "CODE128",
        lineColor: "#fff",
        background: "transparent",
        width: 2,
        height: 120,
        displayValue: false
    });

    const ticketWidth = ticketPreview.offsetWidth;
    const ticketHeight = ticketPreview.offsetHeight;

    if (typeof html2canvas !== 'undefined') {
        html2canvas(ticketPreview, {
            scale: 3, 
            useCORS: true,
            width: ticketWidth,
            height: ticketHeight,
            windowWidth: ticketWidth,
            windowHeight: ticketHeight
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = `tiket-schoolfest-${ticket.name.replace(/\s/g, '_')}.png`; 
            link.href = canvas.toDataURL('image/png');
            link.click();
            
            ticketPreview.remove();
        });
    } else {
        alert('Fitur download tidak tersedia.');
        ticketPreview.remove(); 
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

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Navbar animation on scroll
gsap.to(".navbar", {
  scrollTrigger: {
    trigger: "body",
    start: "top top",
    toggleActions: "play none none reverse",
    scrub: true,
  },
  backgroundColor: "rgba(13, 13, 13, 0.95)",
  padding: "15px 0",
  boxShadow: "0 5px 20px rgba(0, 0, 0, 0.2)",
  duration: 0.3,
});

// Hero Section Timeline
const heroTl = gsap.timeline({defaults: { ease: "power3.out" }});

heroTl.from(".navbar", { y: -100, opacity: 0, duration: 1.2 })
      .from(".hero-section .center-image", { scale: 0.8, opacity: 0, duration: 1.5 }, "-=0.8")
      .from("h1.back-text", { x: 500, rotation: 30, opacity: 0, duration: 1.5 }, "-=1")
      .from(".hero-section .dove1", { x: "-200%", opacity: 0, duration: 1.5 }, "<")
      .from(".hero-section .dove2", { x: "200%", opacity: 0, duration: 1.5 }, "<")
      .from(".artist-info", { y: 50, opacity: 0, duration: 1 }, "-=1")
      .from(".scroll-down", { y: 50, opacity: 0, duration: 0.8 }, "-=0.5");

      