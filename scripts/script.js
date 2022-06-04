// 'use strict'


document.addEventListener('DOMContentLoaded', setup) 



let tileSequence // key = sequencenumber (a number) value = the html id (format: tile-n, n = 1 to 9)
let clickingEnabled = false;   //true means enable player to click the tiles.
let gameOver;
let roundClicks;
let playButton;

function setup() {
    // document.querySelector('img').style.visibility = 'hidden'
    tileSequence = new Map()
    playButton = document.querySelector('button');
    let allTiles = document.querySelectorAll('td')
    allTiles.forEach(element => {
        element.style.backgroundColor = 'rgb(255,162,29)'
        element.addEventListener('click', evt => {
            if (clickingEnabled) {
                clickTile(evt)
            }
        })
    });
    playButton.addEventListener('click', () => {
        // document.querySelector('img').style.visibility = 'hidden'
        document.querySelector('#message').style.color = `rgb(255,255,255)`
        document.querySelector('#message').textContent = `Tip: The sequence will get harder and you must click the tiles in the right order to advance to the next round.`
        gameOver = false;
        roundClicks = 0;
        playRound()
        allTiles.forEach(element => {
            element.style.backgroundColor = 'rgb(255,162,29)'
        });

        playButton.style.visibility = 'hidden'
    })
}

//light the tile up upon clicking
function clickTile(evt) {
    roundClicks++; //increment round clicks by 1
    const tile = evt.target
    //set the tile to green if player clicked the correct 1.
    //else set it to red, and keep it red. gameOver will be true and player cannot click anymore tiles.
    if (evt.target.getAttribute('id') === tileSequence.get(roundClicks)){
        tile.style.backgroundColor = 'rgb(0,255,0)'
        playClickSfx()
        setTimeout(() => {
            tile.style.backgroundColor = 'rgb(255,162,29)'
        }, 60);
    } else {
        playSmackSfx()
        // playPhoenixSfx()
        tile.style.backgroundColor = 'rgb(255,0,0)'
        gameOver = true;  //GAME OVER!!!
        tileSequence.clear() //empty the sequence.
        document.querySelector('#message').textContent = `Game Over!`
        document.querySelector('#message').style.color = `rgb(255,0,0)`
        clickingEnabled = false;
        playButton.style.visibility = 'visible'
        playButton.textContent = "Try again."
    }
    //as soon as the player's click count reaches the size of the map (that holds)
    //the sequence, play another round!
    if (tileSequence.size === roundClicks && !(gameOver)) {
        playRound()
    }
    //set the colour back to the original colour.
}

/**generates a random number from 1 to 9 (integer)
 * 
 * @returns {int}
 */
function randomOneToNine() {
    let randomNumber = Math.random() * 9
    return Math.floor(randomNumber) + 1
}


function addToSequence() {
    const randomTileNumber = randomOneToNine()
    tileSequence.set(tileSequence.size + 1, `tile-${randomTileNumber}`)
    
}

function lightSequence() {
    clickingEnabled = false; //do not enable player to click the tiles
    document.querySelector('table').style.borderColor = `rgb(255,178,0)`
    setTimeout( () => {
        clickingEnabled = true;
        roundClicks = 0;         //reset the number of clicks to 0
        document.querySelector('table').style.borderColor = `rgb(255,255,255)`
        document.querySelector('#message').textContent = `Click away!`
    }, (tileSequence.size+1.5) * 1000)
    tileSequence.forEach((value, key) => {
        const tile = document.querySelector(`#${value}`) //get tile using id value of the map
        setTimeout(() => {
            lightTile(tile)
        }, 1000 * key);
        
    })
}

function lightTile(tile) {

    tile.style.backgroundColor = 'rgb(255,255,0)'

    
    //set the colour back to the original colour.
    setTimeout(() => {
        tile.style.backgroundColor = 'rgb(255,162,29)'
        playBeepSfx()
    }, 200);
}


//each round, add a new tile to the sequence.
function playRound() {

    addToSequence()
    //updates the round number
    document.querySelector('#round-heading').textContent = `Round ${tileSequence.size}`
    lightSequence() //light up the buttons
}


function playBeepSfx() {
    const beepSfx = new Audio('misc/audio_compBlip.mp3')
    beepSfx.play()
}

function playClickSfx() {
    const beepSfx = new Audio('misc/click.mp3')
    beepSfx.currentTime = 1
    beepSfx.play()
}

function playSmackSfx() {
    const beepSfx = new Audio('misc/smack.mp3')
    beepSfx.currentTime = 0.4
    beepSfx.volume = 0.7
    beepSfx.play()
}
