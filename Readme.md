Documentation: SchoolFest Event Landing Page
This document provides a brief overview of the index.html file for the SchoolFest event page, detailing its structure, features, and external libraries.

1. Page Structure
The page is a single-page layout divided into semantic <section> tags, allowing for smooth scrolling navigation.

<header class="navbar">: The navigation bar at the top. It's responsive and collapses into a hamburger menu on mobile devices.
<section id="home">: The main "hero" section. It features the artist's image, a title, an event countdown timer, and animated dove graphics.
<section id="about">: Contains a description of the event, its main attractions (features like food stalls, photo booths), and a relevant image.
<section id="schedule">: A timeline layout that details the event's schedule from gates opening to the closing.
<section id="tickets">: Displays ticket options in a card format. This section is interactive and leads to the ticket purchase flow.
<section id="contact">: Provides contact details, social media links, and a contact form for inquiries.
<footer>: The page footer with quick links, a newsletter signup form, and copyright information.

2. Interactive Features & Modals
The page includes several dynamic elements controlled by JavaScript (js/script.js).
Ticket Purchase Flow: A multi-step process using modals:
#purchaseForm: The initial modal that appears when a "Buy Now" button is clicked. It collects the user's name, email, and ticket quantity.
#paymentMethodModal: After the first form is submitted, this modal appears, allowing the user to select a payment method (DANA, OVO, QRIS, etc.).
#paymentProcessingModal: The final modal that simulates the payment process, showing a loader and a success checkmark animation.

AI Chatbot:
#chatbotBtn: A floating button with a robot icon that opens the chatbot modal.
#chatbotModal: The chat interface where users can interact with an AI assistant.

Back to Top Button:
#backToTopBtn: A floating button that appears after the user scrolls down, allowing them to return to the top of the page instantly.

Animations:
AOS (Animate On Scroll): Used for simple fade-in and slide-in animations as the user scrolls through the sections.
GSAP (GreenSock Animation Platform): Used for more complex animations, such as the movement of the dove images in the hero section.

3. External Libraries & Dependencies
The page relies on several external CSS and JavaScript libraries to function correctly.

Font Awesome: For all icons used across the site (e.g., fas fa-music, fab fa-instagram).
AOS: aos.css and aos.js for scroll animations.
GSAP & ScrollTrigger: gsap.min.js and ScrollTrigger.min.js for advanced animations.
JsBarcode: JsBarcode.all.min.js is likely used to generate a barcode for the ticket after a successful purchase.
html2canvas: html2canvas.min.js is likely used to capture a part of the page as an image, probably for generating a downloadable ticket receipt.
css/index.css: The primary custom stylesheet for the page.
js/script.js: The primary custom JavaScript file that controls all interactivity.

All Of This Is Developer By Students From SMKN 1 Bondowoso XI RPL 2 Among Them Namely :
1.Rafi Abdillah Fairuz XI RPL 2
2.Septiyan Bintang Ramadhan Putra XI RPL 2
3.Satria Nanda Tama XI RPL 1

Demo Website : "SchoolFestHindia-id-netlify.app" / "SchoolFestHindia-id-vercel.app"

We Hope Hou Enjoy Eur Website