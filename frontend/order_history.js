document.addEventListener('DOMContentLoaded', () => {
    // create local storage for rating and orderhistory
    const orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
    const container = document.getElementById('order-history-container');
    const savedRatings = JSON.parse(localStorage.getItem('ratings')) || {};

    // Shows no orders when history is empty
    if (orderHistory.length === 0) {
        container.innerHTML = '<div class="empty-history"><p>You have no past orders.</p></div>';
        return;
    }

    //Creates the order template in the page for each order
    orderHistory.reverse().forEach(order => {
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card';
        orderCard.innerHTML = `
            <h2>Order #${order.id}</h2>
            <p><strong>Date:</strong> ${order.date}</p>
            <p><strong>Status:</strong> ${order.status}</p>
            <hr>
        `;
        
        for (const itemName in order.items) {
            //Adds the item name,quatity and rating
            const item = order.items[itemName];
            const itemElement = document.createElement('div');
            itemElement.className = 'order-item';
            itemElement.innerHTML = `
                <span>${itemName} (x${item.quantity})</span>
                <div class="rating-stars" id="rating-${order.id}-${itemName.replace(/\s+/g, '-')}" data-item="${itemName}" data-order-id="${order.id}">
                    <i class="far fa-star star" data-value="1"></i>
                    <i class="far fa-star star" data-value="2"></i>
                    <i class="far fa-star star" data-value="3"></i>
                    <i class="far fa-star star" data-value="4"></i>
                    <i class="far fa-star star" data-value="5"></i>
                </div>
            `;
            orderCard.appendChild(itemElement);

            // Load saved rating and apply styling
            const ratingKey = `${order.id}-${itemName}`;
            const rating = savedRatings[ratingKey];
            //Check if rating exist
            if (rating) {
                const starsContainer = itemElement.querySelector('.rating-stars');
                const allStars = starsContainer.querySelectorAll('.star');
                //Adds stylying
                allStars.forEach(s => {
                    if (parseInt(s.dataset.value) <= rating) {
                        s.classList.add('rated');
                        s.classList.remove('far');
                        s.classList.add('fas');
                    }
                });
            }
        }

        container.appendChild(orderCard);
    });

    // Add event listeners for the rating stars
    container.addEventListener('click', (event) => {
        const star = event.target.closest('.star');
        if (!star) return;

        const ratingValue = star.dataset.value;
        const starsContainer = star.closest('.rating-stars');
        const itemId = starsContainer.dataset.item;
        const orderId = starsContainer.dataset.orderId;

        saveRating(orderId, itemId, ratingValue);
        //Add color to stars based on selecting or deselecting a rating
        const allStars = starsContainer.querySelectorAll('.star');
        allStars.forEach(s => {
            if (s.dataset.value <= ratingValue) {
                s.classList.add('rated');
                s.classList.remove('far');
                s.classList.add('fas');
            } else {
                s.classList.remove('rated');
                s.classList.add('far');
                s.classList.remove('fas');
            }
        });
    });
});
//Saves the rating in local storage
function saveRating(orderId, itemId, rating) {
    let savedRatings = JSON.parse(localStorage.getItem('ratings')) || {};
    const ratingKey = `${orderId}-${itemId}`;
    savedRatings[ratingKey] = rating;
    localStorage.setItem('ratings', JSON.stringify(savedRatings));
}
