document.addEventListener("DOMContentLoaded", () => {
    const categories = {
        fruits: ['🍎', '🍌', '🍇', '🍉', '🍒', '🥭', '🍑', '🍍'],
        animals: ['🐶', '🐱', '🐰', '🦊', '🐻', '🐼', '🐸', '🐯'],
        emojis: ['😃', '😂', '😍', '😎', '🤩', '🥳', '🤯', '😜'],
        planets: ['🌎', '🌕', '🪐', '🌟', '☀️', '🌙', '🛰️', '🚀']
    };

    let selectedCategory = [];
    let firstCard, secondCard;
    let lockBoard = false;
    let matches = 0;
    let score = 0;
    let timeLeft = 30;
    let movesLeft = 6; // Maximum allowed moves
    let timer;

    // Select category
    document.querySelectorAll('.category').forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');

            if (!categories[category]) {
                console.error(`Error: Category '${category}' not found!`);
                return;
            }

            document.querySelectorAll('.category').forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');

            selectedCategory = [...categories[category], ...categories[category]];
            selectedCategory.sort(() => Math.random() - 0.5);
        });
    });

    // Animate Start Game Button
    const startButton = document.getElementById('start-game');
    startButton.addEventListener('mouseenter', () => {
        startButton.classList.add('pulse');
    });
    startButton.addEventListener('mouseleave', () => {
        startButton.classList.remove('pulse');
    });

    // Start Game Button
    startButton.addEventListener('click', () => {
        if (selectedCategory.length === 0) {
            alert("Please select a category!");
            return;
        }
        document.getElementById('landing-page').classList.add('hidden');
        document.getElementById('game-container').classList.remove('hidden');
        startGame();
    });

    function startGame() {
        const grid = document.querySelector('.grid-container');
        grid.innerHTML = '';
        matches = 0;
        score = 0;
        timeLeft = 30;
        movesLeft = 6; // Reset move counter
        document.getElementById('score').textContent = `Score: ${score}`;
        document.getElementById('timer').textContent = `Time: ${timeLeft}s`;

        selectedCategory.forEach(item => {
            const card = document.createElement('div');
            card.classList.add('card', 'flipped'); // Initially flipped
            card.dataset.value = item;
            card.innerHTML = `<span class="card-content">${item}</span>`;
            grid.appendChild(card);
        });

        // Show all cards for 7 seconds, then hide them
        setTimeout(() => {
            document.querySelectorAll('.card').forEach(card => {
                card.classList.remove('flipped');
                card.querySelector('.card-content').style.opacity = '0';
                card.addEventListener('click', flipCard);
            });
        }, 7000);

        // Start timer
        timer = setInterval(() => {
            timeLeft--;
            document.getElementById('timer').textContent = `Time: ${timeLeft}s`;
            if (timeLeft === 0) {
                clearInterval(timer);
                showLosingMessage();
                resetGame();
            }
        }, 1000);
    }

    function flipCard() {
        if (lockBoard || this.classList.contains('flipped')) return;
    
        // If card does not have a counter, initialize it
        if (!this.dataset.clickCount) {
            this.dataset.clickCount = 0;
        }
    
        this.dataset.clickCount++;
    
        // Flip card only after 6 clicks
        if (this.dataset.clickCount < 6) {
            return;
        }
    
        this.classList.add('flipped');
        this.querySelector('.card-content').style.opacity = '1';
    
        if (!firstCard) {
            firstCard = this;
            return;
        }
    
        secondCard = this;
        checkMatch();
    }

    function checkMatch() {
        let isMatch = firstCard.dataset.value === secondCard.dataset.value;
        isMatch ? disableCards() : unflipCards();
    }

    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        resetBoard();
        matches++;
        score += 10;
        document.getElementById('score').textContent = `Score: ${score}`;

        if (matches === 8) {
            clearInterval(timer);
            showWinningMessage();
        }
    }

    function unflipCards() {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            firstCard.querySelector('.card-content').style.opacity = '0';
            secondCard.querySelector('.card-content').style.opacity = '0';
            resetBoard();
        }, 1000);
    }

    function resetBoard() {
        [firstCard, secondCard, lockBoard] = [null, null, false];
    }

    function resetGame() {
        setTimeout(() => {
            document.getElementById('landing-page').classList.remove('hidden');
            document.getElementById('game-container').classList.add('hidden');
            document.querySelector('.grid-container').innerHTML = ''; 
            selectedCategory = [];
        }, 2000);
    }

    // Winning Message with Fireworks Animation
    function showWinningMessage() {
        document.body.innerHTML += `
            <div class="win-message">
                🎉 Congratulations! You won! 🎉
                <div class="fireworks"></div>
            </div>
        `;
        document.querySelector('.win-message').classList.add('show');
        setTimeout(() => {
            document.querySelector('.win-message').remove();
            resetGame();
        }, 4000);
    }

    // Losing Message with Sad Emojis
    function showLosingMessage() {
        document.body.innerHTML += `
            <div class="lose-message">
                ❌ Game Over! You exceeded 6 moves. ❌
            </div>
        `;
        document.querySelector('.lose-message').classList.add('show');
        setTimeout(() => {
            document.querySelector('.lose-message').remove();
            resetGame();
        }, 4000);
    }
});
