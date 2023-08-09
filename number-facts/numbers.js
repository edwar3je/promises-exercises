// Initialize the inputs, buttons and list
const favoriteNumberInput = document.querySelector("input.favorite-number");
const fourFactsButton = document.querySelector("button.four-facts");
const minNumber = document.querySelector("input.min-value");
const maxNumber = document.querySelector("input.max-value");
const rangeFactsButton = document.querySelector("button.range-facts")
const factList = document.querySelector("ul.facts")

// Create a function to execute for each Promise in the array (should add facts to the board)
function appendLi(fact){
    console.log(fact)
    const li = document.createElement('li');
    li.innerText = fact;
    factList.append(li);
}

// Generates four random facts for a given number
async function getFourNumberFacts(num){
    let fourNumberFacts = [];

    for (let i=1; i<5; i++) {
        fourNumberFacts.push(
            axios.get(`http://numbersapi.com/${num}?json`)
        );
    }

    Promise.all(fourNumberFacts)
        .then(results => {
            for (let res of results){
                appendLi(res.data.text)
            }
        })
        .catch(err => console.log(err));
}

// Add an event listener to the "four facts" button that generates four facts and posts the facts to the list.
// If existing facts are still in the list, all the facts will be deleted. 
fourFactsButton.addEventListener("click", async function(e){
    e.preventDefault();
    if (factList.firstChild){
        while(factList.firstChild){
            document.querySelector('li').remove()
        }
    }
    if(favoriteNumberInput.value >= 0 && favoriteNumberInput.value != ""){
        await getFourNumberFacts(favoriteNumberInput.value);
        favoriteNumberInput.value = "";
    }
})

// Generates 1 fact for each number in a range
async function getRangeFacts(minNum, maxNum){
    let rangeFacts = [];

    for (let i = minNum; i <= maxNum; i++) {
        rangeFacts.push(
            await axios.get(`http://numbersapi.com/${i}?json`)
        );
    }

    Promise.all(rangeFacts)
        .then(results => {
            for (let res of results){
                appendLi(res.data.text)
            }
        })
        .catch(err => console.log(err));
}

// Add an event listener to the "range-facts" button that generates facts for each number in the range and adds the facts to the list.
// If the min value exceeds the max value or the difference between the min-max value is greater than 10, an error will occur.
rangeFactsButton.addEventListener("click", async function(e){
    e.preventDefault();
    if (factList.firstChild){
        while(factList.firstChild){
            document.querySelector('li').remove()
        }
    }
    let difference = maxNumber.value - minNumber.value;
    console.log(difference)
    if(minNumber.value < maxNumber.value && difference <= 10 && minNumber.value != "" || maxNumber.value != ""){
        await getRangeFacts(minNumber.value, maxNumber.value);
        minNumber.value = "";
        maxNumber.value = "";
    }
})