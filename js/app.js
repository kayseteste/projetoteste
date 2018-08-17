// collecting all cards on board
let board = document.getElementsByClassName('card');
let cards = [...board];

// getting all cards on the deck
const deck = document.querySelector('.deck');

// init moves variables
let moves;
let counter = document.querySelector('.moves');

// getting the stars icons and rank list
const stars = document.querySelectorAll('.fa-star');
let starsList = document.querySelectorAll('.stars li');

// getting the matched cards
let matchedCards = document.getElementsByClassName('match');

// the clock variables
let second = 0, minute = 0, hour = 0;
let timer = document.querySelector('.clock');
let interval;

// init the congratulations modal and get the close button
let modal = document.getElementById('congrats-modal');
let close = document.querySelector('.close');

// openedCards init
let openedCards = [];


// randomize cards position
function shuffle(array) {
    let control = array.length, tempValue, index;

    while (control !== 0) {
        index = Math.floor(Math.random() * control);
        control -= 1;
        tempValue = array[control];
        array[control] = array[index];
        array[index] = tempValue;
    }

    return array;
}

// shuffle cards when page is refreshed
document.body.onload = start();


// function to start and reset the board
function start() {
    // shuffle cards
    cards = shuffle(cards);

    // clear all classes from each card and append it on deck
    for (let i = 0; i < cards.length; i++) {
        deck.innerHTML = '';
        [].forEach.call(cards, function(item) {
            deck.appendChild(item);
        });
        cards[i].classList.remove('show', 'open', 'match', 'disabled');
    }

    // reset moves
    moves = 0;
    counter.innerHTML = `${moves} moves`;

    // reset rating
    for (let i = 0; i < stars.length; i++) {
        stars[i].style.color = '#ffd700';
        stars[i].style.visibility = 'visible';
    }

    // reset timer
    second = 0;
    minute = 0;
    hour = 0;
    let timer = document.querySelector('.clock');
    timer.innerHTML = `${minute}m ${second}s`;
    clearInterval(interval);
}


// displayCard is a function to change the card's states
let displayCard = function() {
    this.classList.toggle('open');
    this.classList.toggle('show');
    this.classList.toggle('disabled');
}


// adding opened cards to a list and check if they are match or not
function cardOpen() {
    openedCards.push(this);

    let len = openedCards.length;

    if (len === 2) {
        addCounter();
        if (openedCards[0].dataset.type === openedCards[1].dataset.type) {
            matched();
        } else {
            unmatched();
        }
    }
}

// when the cards data-type match
function matched() {
    openedCards[0].classList.add('match', 'disabled');
    openedCards[1].classList.add('match', 'disabled');
    openedCards[0].classList.remove('show', 'open');
    openedCards[1].classList.remove('show', 'open');
    openedCards = [];
}

// when the cards data-type don't match
function unmatched() {
    openedCards[0].classList.add('unmatched');
    openedCards[1].classList.add('unmatched');
    
    disable();
    setTimeout(function() {
        openedCards[0].classList.remove('show', 'open', 'unmatched');
        openedCards[1].classList.remove('show', 'open', 'unmatched');
        enable();
        openedCards = [];
    }, 1000);
}


// disable cards by 1 second
function disable() {
    Array.prototype.filter.call(cards, function(card) {
        card.classList.add('disabled');
    });
}

// (r)enable cards and disable the matched cards
function enable() {
    Array.prototype.filter.call(cards, function(card) {
        card.classList.remove('disabled');
        for (let i = 0; i < matchedCards.length; i++) {
            matchedCards[i].classList.add('disabled');
        }
    });
}



// counting the player's moves
function addCounter() {
    moves++;
    counter.innerHTML = `${moves} move${(moves >= 2 ? 's' : '')}`;
    

    // starting the timer counter
    if (moves == 1) {
        second = 0;
        minute = 0;
        hour = 0;

        startClock();
    }

    // starting the rating logic
    if (moves > 8 && moves < 12) {
        for (let i = 0; i < 3; i++) {
            if (i > 1) {
                stars[i].style.visibility = 'collapse';
            }
        }
    } else if (moves > 13) {
        for (let i = 0; i < 3; i++) {
            if (i > 0) {
                stars[i].style.visibility = 'collapse';
            }
        }
    }
}

// the clock function
function startClock() {
    interval = setInterval(function() {
        timer.innerHTML = `${minute}m ${second}s`;
        second++;
        if (second == 60) {
            minute++;
            second = 0;
        }
        if (minute == 60) {
            hour++;
            minute = 0;
        }
    }, 1000);
}


// when all cards match, congrats the player
function congrats() {
    if (matchedCards.length == 16) {
        clearInterval(interval);
        finalTime = timer.innerHTML;

        // bring the congrats modal
        modal.classList.add('show');

        // init star rating
        let starRate = document.querySelector('.stars').innerHTML;

        // shows move, rating and time on modal
        document.getElementById('finalMove').innerHTML = moves;
        document.getElementById('starRate').innerHTML = starRate;
        document.getElementById('totalTime').innerHTML = finalTime;

        // close button on modal
        closeModal();
    };
}

// closeModal and playAgain functions
function closeModal() {
    close.addEventListener('click', function(e) {
        modal.classList.remove('show');
        start();
    });
}

function playAgain() {
    modal.classList.remove('show');
    start();
}


// looping and adding event listeners to each card
for (let i = 0; i < cards.length; i++) {
    card = cards[i];
    card.addEventListener('click', displayCard);
    card.addEventListener('click', cardOpen);
    card.addEventListener('click', congrats);
};
