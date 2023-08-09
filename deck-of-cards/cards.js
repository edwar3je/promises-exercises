// Initialize buttons and initial div container
const startButton = document.querySelector('button.start');
const drawButton = document.querySelector('button.draw');
const initContainer = document.querySelector('div.init-container');

// Upon clicking the "start button", a deck will be chosen, the deck id will be saved to local storage, the grid-row-start/end will be set to localStorage,
// the first card from the deck will be drawn and the button will delete/change.
startButton.addEventListener("click", async function(e){
    e.preventDefault();
    startButton.remove();
    $("div.init-container").append($('<button class="draw">Draw</button>'));
    await selectDeck();
    await drawCard();
})

// Upon clicking the "draw button", a new card will be drawn from the deck (deck id in local storage)
$('div.init-container')
    .on('click', '.draw', async function(e){
        e.preventDefault();
        await drawCard();
    })

// Selects a single deck, stores the deck id in local storage, sets the remaining cards in local storage to 52 and sets the grid-row-start/end for local storage to 1 and 5 respectively.
async function selectDeck() {
    // Request a new, shuffled deck, extract the deck id and save it to local storage
    let newDeck = await axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
    let deckId = newDeck.data.deck_id;
    localStorage.setItem("deckId", deckId);
    localStorage.setItem("remaining", 52);
    localStorage.setItem("grid-row-start", 1);
    localStorage.setItem("grid-row-end", 5);
    console.log("You have a new, shuffled deck")
}

// Draws a single card from a given deck using the deck id in local storage, updates the count of the remaining cards in local storage and updates the grid-row-start/end. 
async function drawCard() {
    if (localStorage.getItem("remaining") > 0){
        let deckId = localStorage.getItem("deckId");
        let drawedCard = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
        appendCard(drawedCard.data.cards[0].images.png);
        console.log(`You just drew the ${drawedCard.data.cards[0].value} of ${drawedCard.data.cards[0].suit}. ${drawedCard.data.remaining} cards remaining.`);
        
        localStorage.setItem("remaining", drawedCard.data.remaining);
        
        let previousStart = localStorage.getItem("grid-row-start");
        let newStart = Number(previousStart) + 1;
        localStorage.setItem("grid-row-start", newStart);

        let previousEnd = localStorage.getItem("grid-row-end");
        let newEnd = Number(previousEnd) + 1;
        localStorage.setItem("grid-row-end", newEnd);
    }
    else {
        console.log("No cards remaining")
    }
}

// Appends card to "card-container" div
function appendCard(link) {
    let gridRowStart = localStorage.getItem("grid-row-start");
    let gridRowEnd = localStorage.getItem("grid-row-end");
    let gridColumnStart = 1;
    let gridColumnEnd = 3;
    $("div.card-container").append($(`<img style="grid-row:${gridRowStart}/${gridRowEnd};grid-column:${gridColumnStart}/${gridColumnEnd}" src="${link}"></img>`));
}