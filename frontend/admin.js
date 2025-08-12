function removeCard(buttonElement) {
            const cardContainer = buttonElement.closest('.order-container');
            cardContainer.classList.add('card-fade-out');
            
            // Wait for the animation to finish before removing the element
            cardContainer.addEventListener('transitionend', () => {
                cardContainer.remove();
            });
        }

        // Function to move an order to the "Ready for Pickup" section
        function markReady(button) {
            const cardContainer = button.closest('.order-container');
            const card = cardContainer.querySelector('.order-card');
            const cardHeader = card.querySelector('.card-header');
            const badge = cardHeader.querySelector('.badge');
            const cardFooter = card.querySelector('.card-footer');
            const pickupGrid = document.getElementById('pickup-grid');

            // Change card appearance to "ready" state
            card.classList.add('is-ready');
            card.style.borderColor = ''; // Remove inline style if present
            cardHeader.style.color = ''; // Remove inline style if present

            // Update the badge
            if (badge) {
                badge.classList.remove('bg-primary', 'bg-warning', 'text-dark');
                badge.classList.add('bg-success');
                badge.textContent = 'Ready';
            }

            // Update the buttons in the footer
            cardFooter.innerHTML = `
                <button class="btn btn-primary w-100" onclick="completeOrder(this)">
                    <i class="fas fa-clipboard-check me-2"></i>Complete Order
                </button>
            `;

            // Move the card to the pickup section
            pickupGrid.appendChild(cardContainer);
        }

        // Function to handle a cancelled order
        function cancelOrder(button) {
            console.log('Order cancelled.');
            removeCard(button);
        }

        // Function to handle a completed/picked-up order
        function completeOrder(button) {
            console.log('Order completed.');
            removeCard(button);
        }