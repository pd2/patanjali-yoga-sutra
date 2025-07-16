const reference = document.getElementById("reference");
const quote = document.getElementById("quote");
const start = document.getElementById("start");
const info = document.getElementById("info");
const message = document.getElementById("message");
const list_choices = document.getElementById("list_choices");
const meaning = document.getElementById("meaning");
const words = document.getElementById("words");
const settings = document.getElementById("settings");
const share =  document.getElementById("share");
const tooltip = document.getElementById("myTooltip");
const hist_graph = document.getElementById("guess-distribution");


let patanjali_yoga_sutra;

async function get_yoga_sutra() {
  
  let responses = await fetch('patanjali_yoga_sutra.txt');
  
  patanjali_yoga_sutra = await responses.json();
  
//  console.log(patanjali_yoga_sutra);
  
}

get_yoga_sutra();

let choices, quoteText, startTime, ch_index = 0, sh_index = -1, is_playing = false;

let num_guess, is_random, num_choices = 5; 

// let hist_guess =  Array(num_choices+1).fill(0);

let lastPlayedTs;

function startGame() {

  var today = new Date();
  
  if ( Na(new Date(lastPlayedTs), today) < 1) {
    alert("Play a new puzzle tomorrow!")
    return;
  }
  
  console.log("new game started!");
  is_playing = true;
  num_guess = 0;
  
  is_random = document.getElementById('rand').checked;
  // console.log("Is random: ",is_random);
  
  message.innerHTML = ``;
  meaning.innerHTML = ``;
  words.innerHTML = ``;
  
  info.innerHTML = `Guess the meaning of this verse.`;
  start.innerHTML = `New Game`;
  // viswaroopa.innerHTML = ``;
  // input.style.display = "block";
  share.style.display = "none";
  tooltip.innerHTML = "Copy to clipboard";
  hist_graph.innerHTML = ``;

  list_choices.innerHTML = `<ul>  
    <template id="choice_item">
      <li class="item"></li>
    </template>
    </ul>`;
  
  if (is_random == true) {
    ch_index = Math.floor(Math.random() * patanjali_yoga_sutra.length);
    sh_index = Math.floor(Math.random() * patanjali_yoga_sutra[ch_index].length);
  } else {
    sh_index++;
    if (sh_index == patanjali_yoga_sutra[ch_index].length) {
      sh_index = 0;
      ch_index++;
      if (ch_index == patanjali_yoga_sutra.length) {
        ch_index = 0;
      }
    }
  }
  quoteText = `<span class="boldit">Verse:</span> ${patanjali_yoga_sutra[ch_index][sh_index].shloka}`;
  // wordQueue = quoteText.split(" ");
  
  reference.innerHTML = `Chapter: ${ch_index+1}, Shloka: ${sh_index+1}`;
  quote.innerHTML = quoteText;
//  quote.innerHTML = wordQueue.map((word) => `<span>${word}</span>`).join("").split(",").join("<br>");
//  highlightPosition = 0;
//  quote.childNodes[highlightPosition].className = "highlight";
  
  choices = Array.from({length: patanjali_yoga_sutra[ch_index].length}, (x, i) => i);
  shuffle(choices);
  choices.splice(choices.indexOf(sh_index),1);
  choices.length = num_choices-1;
  choices.push(sh_index);
  shuffle(choices);
  // console.log(choices);
  
  const template = document.getElementById('choice_item');
  
  for(let i = 0; i < num_choices; i++)   {
  
    const choice_item = template.content.cloneNode(true);
    const item = choice_item.querySelector('.item');
    let text = patanjali_yoga_sutra[ch_index][choices[i]].meaning;
    item.innerHTML = `<button onclick="submitButtonStyle(this); checkAnswer(${choices[i]})" >${text}</button><br><br>`;
      
    list_choices.appendChild(item);
    
  }
  
  startTime = new Date().getTime();
  
  document.body.className = "";
  
  // $("typedValue").focus();
//  document.getElementById("typedValue").focus();
//  document.getElementById("typedValue").select();
}


function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function submitButtonStyle(_this) {
  _this.style.backgroundColor = "red";
}

function checkAnswer(selected_index) {
  
  if (is_playing == false) {
    return;
  }
  
  num_guess += 1;
  
  if ( (sh_index == selected_index) || (num_guess == 1) ) {
    words.innerHTML = `<span class="clue"><span class="boldit">Clue:</span> ${patanjali_yoga_sutra[ch_index][sh_index].words}</span>`;
  }
  
  let rnd = Math.floor(Math.random() * 3);
  
  if (sh_index == selected_index) {
    
    if (num_guess == 1) {
      if (rnd == 0)
        message.innerHTML = `Bingo!`;
      else if (rnd==1)
        message.innerHTML = `Nice Job!`;
      else
        message.innerHTML = `Correct guess at first try!`;
    }
    else if (num_guess == 2)
      message.innerHTML = `Second time's a charm?`;
    else if (num_guess == num_choices-1)
      message.innerHTML = `Was this that tough?`;
    else if (num_guess == num_choices)
      message.innerHTML = `You are a genius!`;
    
    hist_guess[num_guess] += 1;

    gameOver();
    
    return (0);
  }
  
  let message_innerHTML;
  
  if (num_guess == 1) {
    if (rnd == 0)
      message_innerHTML = `Strike 1. Give it another try!`;
    else if (rnd==1)
      message_innerHTML = `You cannot get lucky every time.`;
    else
      message_innerHTML = `Keep guessing! Read the clue`;
  }
  else if (num_guess == 2) {
    if (rnd == 0)
      message_innerHTML = `On the bright side, you now have 50/50 chance!`;
    else if (rnd==1)
      message_innerHTML = `That wasn't it either.`;
    else
      message_innerHTML = `Bad luck again! Use the clue`;
  }
  else if (num_guess == num_choices-1) {
    if (rnd == 0)
      message_innerHTML = `Duh. It can't get anymore clear!`;
    else if (rnd==1)
      message_innerHTML = `Last chance. The clues are useful!`;
    else
      message_innerHTML = `Today isn't your lucky day.`;
  }
  else if (num_guess >= num_choices) {
    if (rnd == 0)
      message_innerHTML = `Did you repeat your guess?`;
    else if (rnd==1)
      message_innerHTML = `You have no idea. Did you read the clue?`;
    else
      message_innerHTML = `Are you randomly clicking?`;
  }
  else {
    if (rnd == 0)
      message_innerHTML = `Wrong answer. Try using the clue this time!`;
    else if (rnd==1)
      message_innerHTML = `Hard luck. You could pay attention to meanings of words!`;
    else
      message_innerHTML = `Incorrect. Using the clue makes it easy!`;
  }
  
  message.innerHTML = `<span class="wrong">${message_innerHTML}</span>`;
  
  return(1);
}

var Ts = document.createElement("template");
Ts.innerHTML = `<div class="graph-container">
      <div class="guess"></div>
      <div class="graph">
        <div class="graph-bar">
          <div class="num-guesses">
        </div>
      </div>
      </div>
    </div>`;

// var Ts = document.getElementById("guess-distribution"); 

function update_hist() {
  
  let t = 0; 
  hist_guess.forEach(x => {t += x;});
  
  hist_graph.innerHTML = `<h3>Guess Distribution</h3>`;
  
  for (var n = 1; n < Object.keys(hist_guess).length; n++) {
      var r = n,
          i = hist_guess[n],
          l = Ts.content.cloneNode(!0),
          d = Math.max(7,Math.round((i / t) * 100));
    
      l.querySelector(".guess").textContent = r;
    
      var u = l.querySelector(".graph-bar");
    
      if ( ((u.style.width = "".concat(d,"%")),"number" == typeof i) ) {
          (l.querySelector(".num-guesses").textContent = i),i > 0 && u.classList.add("align-right");
          var c = num_guess;// parseInt(this.getAttribute("highlight-guess"),10);
          c && n === c && u.classList.add("highlight");
      }
      hist_graph.appendChild(l);
  }
  // window.alert('dialog');
}
  
let elapsedTime;

function gameOver() {
  
  if (is_playing == false) {
    return;
  } else {
    is_playing = false;
  }
  
  lastPlayedTs = new Date();
  
  elapsedTime = new Date().getTime() - startTime;
  // let time_taken = (elapsedTime/1000);
  // console.log(`Time taken is: ${Math.round(time_taken)}`)

  list_choices.innerHTML = `<ul>  
  <template id="choice_item">
    <li class="item"></li>
  </template>
  </ul>`;
  

  message.innerHTML = `
    <span class="congrats">Congrats!</span>
    <br> You guessed the meaning in ${elapsedTime/1000} seconds and took ${num_guess} guess(es).
    `;
  
  quote.innerHTML = `<span class="quote"><span class="boldit">Verse:</span> ${patanjali_yoga_sutra[ch_index][sh_index].shloka.split(",").join("<br>")}</span>`;
  meaning.innerHTML = `<span class="meaning"><span class="boldit">Meaning:</span> ${patanjali_yoga_sutra[ch_index][sh_index].meaning}</span>`;
  
  update_hist();
  
  // input.style.display = "none";
  share.style.display = "block";
  share.focus();
  
  if (is_random == false) {
    save_history();
  }
  
//  document.body.className = "winner";
  ShareIt();
}

var copyText;

function ShareIt() {
  
  let linkURL = "https://pd2.github.io/patanjali-yoga-sutra/";
  
  copyText = `#YogaSutra I found the meaning of shloka ${sh_index+1} from chapter ${ch_index+1} in ${Math.round(elapsedTime/1000)} sec at ${linkURL}`;
  
  navigator.clipboard.writeText(copyText);
  
   if (navigator.canShare) {
    navigator.share({
      title: 'Share results',
      text: `#YogaSutra I found the meaning of shloka ${sh_index+1} from chapter ${ch_index+1} in ${Math.round(elapsedTime/1000)} sec at ${linkURL}`,
      // url: linkURL,
    })
    .then(() => console.log('Successful share'))
    .catch((error) => console.log('Error sharing', error));
  }
  
//  alert("Copied the results to clipboard");
  tooltip.innerHTML = "Results copied";
}

function outFunc() {
  tooltip.innerHTML = "Copy to clipboard";
}

document.addEventListener("keypress", function onPress(event) {
    if (event.key === "@") {
      console.log("cheat code for testing game");
      checkAnswer(sh_index);
      return;
    }
    if (event.key === "n") {
      console.log("started new game");
      startGame();
      return;
    }
});

function Na(e, a) {
    var s = new Date(e);
    var t = new Date(a).setHours(0, 0, 0, 0) - s.setHours(0, 0, 0, 0);
    return Math.round(t / 864e5);
}


function get_history() {
  const noItemsFound_ch = '0', noItemsFound_sh = '-1', noItemsFound_lastPlayedTs = 0, noItemsFound_hist = '[0,0,0,0,0,0]';
  const ch = localStorage.getItem('ch_index') || noItemsFound_ch;
  const sh = localStorage.getItem('sh_index') || noItemsFound_sh;
  const hist = localStorage.getItem('hist_guess') || noItemsFound_hist;
  const lpts = localStorage.getItem('lpts') || noItemsFound_lastPlayedTs;
  
  ch_index = JSON.parse(ch);
  sh_index = JSON.parse(sh);
  hist_guess = JSON.parse(hist);
  lastPlayedTs = JSON.parse(lpts);
}

function save_history() {
  const ch = JSON.stringify(ch_index);
  const sh = JSON.stringify(sh_index);
  const hist = JSON.stringify(hist_guess);
  const lpts = JSON.stringify(lastPlayedTs);
  localStorage.setItem('ch_index', ch);
  localStorage.setItem('sh_index', sh);
  localStorage.setItem('hist_guess', hist);
  localStorage.setItem('lpts', lpts);
}

get_history();

share.style.display = "none";

document.getElementById("start").focus();
start.addEventListener("click", startGame);

