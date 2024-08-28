const typing_text = document.querySelector('.text-of-typing p');
const inputField = document.querySelector('.container .input-field');
const errorTag = document.querySelector('.errors span');
const timeTag = document.querySelector('.time span');
const wpmTag = document.querySelector('.wpm span');
const cpmTag = document.querySelector('.cpm span');
const button = document.querySelector('button');
const bus = document.querySelector('.bus');
const message = document.querySelector('.message');
const busReachedHomeMessage = document.querySelector('.bus-reached-home-message');

let characterIndex = 0;
let errors = 0;
let timer;
let maxTime = 120;
let timeLeft = maxTime;
let isTyping = false;
let passageCompleted = false;

function randomParagraph() {
    let randomIndex = Math.floor(Math.random() * paragraphs.length);
    
    typing_text.innerHTML = "";

    paragraphs[randomIndex].split("").forEach((span) => {
        let spanTag = `<span>${span}</span>`;
        typing_text.innerHTML += spanTag;
    });

    typing_text.querySelectorAll('span')[0].classList.add('active');

    document.addEventListener('keydown', () => inputField.focus());
    typing_text.addEventListener('click', () => inputField.focus());
}
randomParagraph();

function moveBus() {
    const raceTrackWidth = document.querySelector('.race-track').offsetWidth;
    const maxDistance = raceTrackWidth - bus.offsetWidth;
    
    const moveDistance = (characterIndex / typing_text.querySelectorAll('span').length) * maxDistance;
    bus.style.left = `${moveDistance}px`;

    // Check if the bus has reached the end and there are no errors
    if (moveDistance >= maxDistance && errors === 0) {
        passageCompleted = true;
        busReachedHomeMessage.style.display = 'block';
        clearInterval(timer);  // Stop the timer when the bus reaches home
    }
}

function initTyping() {
    const characters = typing_text.querySelectorAll('span');
    
    let typedCharacter = inputField.value.charAt(characterIndex);

    if(characterIndex < characters.length && timeLeft > 0){
        if(!isTyping){
            timer = setInterval(initTimer, 1000);
            isTyping = true;   
        }
    
        if(typedCharacter === ''){ // If user typed backspace
            characterIndex--;
    
            if(characters[characterIndex].classList.contains('incorrect')){
                errors--;
            }
    
            characters[characterIndex].classList.remove('correct', 'incorrect');
        }
        else{
            if(characters[characterIndex].innerText === typedCharacter){
                characters[characterIndex].classList.add('correct');
            }
            else{
                errors++;
                characters[characterIndex].classList.add('incorrect');
            }
            characterIndex++;
        }
    
        characters.forEach(span => span.classList.remove('active'));
        if (characterIndex < characters.length) {
            characters[characterIndex].classList.add('active');
        }
    
        errorTag.innerText = errors;
    
        cpmTag.innerText = Math.round((characterIndex - errors) * 60 / (maxTime - timeLeft));// CPM calculation
    
        let wpm = Math.round(((characterIndex - errors) / 5) / ((maxTime - timeLeft) / 60));
        wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
        wpmTag.innerText = wpm;

        moveBus();  // Move the bus after every correct character typed
    }
    else{
        inputField.value = "";
        clearInterval(timer);
        message.style.display = 'block'; // Show the message when time is up
    }
}

inputField.addEventListener('input', initTyping);

function initTimer() {
    if(timeLeft > 0 && !passageCompleted){
        timeLeft--;
        timeTag.innerText = timeLeft + "s";
    }
    else{
        clearInterval(timer);
        if (!passageCompleted) {
            message.style.display = 'block'; // Show the message when time is up
        }
    }
}

button.onclick = () => {
    randomParagraph();
    inputField.value = "";
    clearInterval(timer);
    timeLeft = maxTime;
    characterIndex = errors = 0;
    timeTag.innerText = timeLeft + "s";
    errorTag.innerText = errors;
    wpmTag.innerText = 0;
    cpmTag.innerText = 0;
    bus.style.left = "0px";
    message.style.display = 'none'; // Hide the message on button click
    busReachedHomeMessage.style.display = 'none'; // Hide the "bus reached home" message on button click
    isTyping = false;
    passageCompleted = false;
};
