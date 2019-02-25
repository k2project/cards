const marvelCards =[
      [ 'Doctor Doom', 'Fantastic Four' ],
      [ 'Magneto', 'X-men' ],
      [ 'Green Goblin', 'Spider-man' ],
      [ 'Red Skull', 'Captain America' ],
      [ 'Loki', 'Thor' ],
      [ 'Galactus', 'Fantastic Four' ],
      [ 'Ultron', 'Avengers' ],
      [ 'Thanos', 'Avengers' ] 
    ];
const oddCards =['Green Lantern','Superman','Joker', 'Batman'];
// console.log(encode(oddCards[0]));
//encoded names
    // hAndV.forEach(arr=>{
    //   arr.forEach(n=>{
    //     console.log(n, encode(n))
    //   })
    // })

class Card {
  constructor(name){
    this.name = name;
  }
  createCard(){
    let name = encode(this.name)
    // name = decode(name)
    let card = document.createElement('li');
    card.classList = 'card unmatched';
    card.innerHTML = `
        <div class = 'card_front'></div>
        <div class = 'card_back' data-char='${name}'></div>
    `
    return card;
  }
}
 class Stats {
   constructor(pairsNum,scoreLi){
      this.pairsNum = pairsNum;
      this.scoreLi = scoreLi;
      this.scoreBoxUl= document.querySelector( '.score_box ul');
      this.progressBar= document.querySelector( '.progress_bar');
      this.infoBar= document.querySelector( '.info_bar');
   }
   init(){
     //show stats bar
    document.querySelector( '.stats').style.display = 'grid';
    this.displayProgressBar();
    this.displayScoreBox();
    //clear info bar
    this.infoBar.innerText = '';
   }
   displayNames(names){
      this.infoBar.innerText = '';
      if(names){
        this.infoBar.innerText = names.join(' & ');
      }
     
   }
   displayProgressBar(){
    this.progressBar.innerHTML = '';
    for( let a = 0; a<this.pairsNum; a++){
      let span = document.createElement('span');
      this.progressBar.appendChild(span);
     }
   }
   handleProgress(matched){
      matched = Math.floor(matched/2);
      const progressSpans = document.querySelectorAll('.progress_bar span');
      for( let n=1; n<=matched; n++){
        progressSpans[n-1].style.backgroundColor = 'white';
      }
   }
   displayScoreBox() {
    //reset score box settings
    this.scoreBoxUl.style.marginTop = '0rem';
    this.scoreBoxUl.innerHTML = '';
     for( let a = 0; a<=this.scoreLi; a++){
      let li = document.createElement('li');
      li.innerText = a;
      this.scoreBoxUl.appendChild(li);
     }
   }
   displayNewScore(score){
    this.scoreBoxUl.style.marginTop = `-${score*4}rem`;
   }
 }

class GameUI {
  constructor(){
    this.levels={
      cards4:{
        maxAttempts: 10
      },
      cards8:{
        maxAttempts: 30
      },
      cards15:{
        maxAttempts: 50
      }
    }
    this.currentBest = 0;
    this.cardsClicked = 0;
    this.cardsPair= [];
    //init set up for standard level
    this.cardsDisplayed = 8;
    this.maxAttempts = 30;
    
    this.messageBox = document.querySelector( '.message_box');
    this.gameBox= document.querySelector( '.game_box');
//methods passsed to event listeners
    this.loadCards = this.loadCards.bind(this);
    this.handleCardClick = this.handleCardClick.bind(this);
    this.setLevel = this.setLevel.bind(this);
    this.resetSettings = this.resetSettings.bind(this);
  }
  
  loadCards(){
    //set the display of cards: game_box class
    document.querySelector( '.game').className =`game cards-${this.cardsDisplayed}`;
    //hide message
    this.messageBox.style.display = 'none';
    this.messageBox.style.opacity = 0;
    this.messageBox.style.transform = 'scale(1.3)';
    this.gameBox.innerHTML = '';
    //reset current score
    this.currentBest = 0;
    this.displayCards();
    //display max attempt info at the bottom;
    const maxAttemptsInfo = document.querySelector('small');
    if(this.maxAttempts){
      maxAttemptsInfo.innerText = `You have max ${this.maxAttempts} goes to finish this level. Good Luck!`
    }
   
    //stats initializing
    let pairs = Math.floor(this.cardsDisplayed/2);
    let scores = 100;
    this.stats = new Stats(pairs,scores);
    this.stats.init();
    
  }
  mixCards(){
    //get random pairs
    let cardsArr = shuffle( marvelCards );
    cardsArr = cardsArr.slice(0,this.cardsDisplayed/2);
    //get arr of all carachters
    let charArr = [];
    cardsArr.forEach( pair =>{
      pair.forEach( character => charArr.push(character))
    })
    //add odd card for challenging level
    if(this.cardsDisplayed === 15){
      const r = random(0, oddCards.length-1);
      const oddChar = oddCards[r]
      charArr.push(oddChar)
    }
    // mix all characters randomly
    charArr =  shuffle(charArr);
    return charArr;
  }
  displayCards(){
    let charArr = this.mixCards();
    //load cards 
    charArr.forEach(char=>{
      let card =new Card(char);
      let cardEl = card.createCard();
      cardEl.style.opacity = 0;
      cardEl.style.top = `${random(-200,200)}px`;
      cardEl.style.left = `${random(-200,200)}px`;
      cardEl.style.transition= `1s cubic-bezier(.17,.67,.46,1.3)`;
      this.gameBox.appendChild(cardEl);
    })
    let cards = document.querySelectorAll('.card');
    cards.forEach((card, index)=>{
      setTimeout(()=>{
        card.style.opacity = 1;
        card.style.top = '0px'; 
        card.style.left = '0px'; 
        setTimeout(()=>{
          card.style.transition= ` .5s linear`;
        },50)
      },index*50+500)
    })
  }
  handleCardClick(e){
    //check how many cards has been clicked
    //check for match
    let t = e.target.parentElement;
    if(t.className === 'card unmatched'){
      ++this.cardsClicked;
      //flip the card over
      //decode and save the names for match check
      t.classList.add('flipped');
      let name = decode(t.lastElementChild.dataset.char);
      this.cardsPair.push(name);
      if(this.cardsClicked<2){
        return;
      }
      //disable click for 1.5s
      this.gameBox.removeEventListener('click', this.handleCardClick)
      //update current score
      ++this.currentBest;
      //display new score
      this.stats.displayNewScore(this.currentBest);
      //check the 2 flipped cards for match 
      //check if game is resolved
      let match = this.checkCardsForMatch();
      if(match){
        //change class of flipped cards to matched
        let matchedCards = document.querySelectorAll('.flipped');
        matchedCards.forEach(card=>card.className = 'card matched');
        let allCardsMatched = this.allCardsMatched();
        if(allCardsMatched){
          //show the odd card
          let odd = document.querySelector('.unmatched');
          if(odd){
            odd.className = 'card matched dc';
            odd.style.transition = ' .7s 1.5s linear';
          }
          //to flip odd card
          let delay = this.cardsDisplayed === 15 ? 3000 : 1000;
          setTimeout(()=>{
            //display message
            //update personal best
            this.gameOver();
            return;
          },delay)
        }
        
      }
      //attempts excceded
      if(this.currentBest === this.maxAttempts ){
        setTimeout(()=>{
          const title = 'GAME OVER'
          const subtitle = `It looks like you are not paying attention to the game. You have exceeded all ${this.maxAttempts} attempts set to finish this level.`
          this.displayMessage(title,subtitle)
          clearTimeout(resetState)
          return;
        },1000)
      }
      //reset state
      //flip umatched cards over
      //enable cards click
      let resetState = setTimeout(()=>{
        this.cardsPair=[];
        this.cardsClicked = 0;
        this.flipUnmatchedCards();
        this.gameBox.addEventListener('click', this.handleCardClick)
      },1500)
      

    }
    return;
  }
  allCardsMatched(){
    let allMatching = false;
    //check how  many unmatched cards is left
    let matchedCards = document.querySelectorAll('.matched');
    if(matchedCards.length === this.cardsDisplayed || matchedCards.length === this.cardsDisplayed-1){
      allMatching = true;
    }
    //update progress bar 
    this.stats.handleProgress(matchedCards.length);
    return allMatching;
  }
  checkCardsForMatch(){
    let res =false;
    let arr = marvelCards.map(el=>el.sort())
    let pair = this.cardsPair.sort();
    arr.forEach(el=>{
      if(el[0]=== pair[0] && el[1] === pair[1]){
        res = true;
      }
    })
    if(res){
      //display names in stats bar
      this.stats.displayNames(this.cardsPair);
    }else{
       //clear info bar
       this.stats.displayNames(null);
    }
    return res;
  }
  flipUnmatchedCards(){
    let unmatchedCards = document.querySelectorAll('.unmatched');
    unmatchedCards.forEach(card=>card.className = 'card unmatched')
   
  }

  displayMessage(title,subtitle,pb){
     //show message box
     this.messageBox.style.display = 'grid';
     setTimeout(()=>{
       this.messageBox.style.opacity = 1;
       this.messageBox.style.transform = 'scale(1)';
     },10)
     //display text in message box
     this.messageBox.querySelector('h1').innerText = title;
     this.messageBox.querySelector('h2').innerText = subtitle;
     this.messageBox.querySelector('.play').innerText = 'PLAY AGAIN';
     //display current score
     document.querySelector( '.current_best' ).innerText = `Current Score: ${this.currentBest}`;
     //display personal best
     if(pb){
      document.querySelector( '.personal_best' ).innerText = `Personal Best: ${pb}`;
     }
     
  }
  gameOver(){
    //to update current stats and push levels obj into loacalStorage
    const level = this.levels[`cards${this.cardsDisplayed}`];
    level.personalBest = this.currentBest;
    //get the storaged PB
    //set the lowest PB to be stored
    const storage = JSON.parse(localStorage.getItem( 'game-levels'));
    const storageLevel = storage[`cards${this.cardsDisplayed}`];
    const storagePB = storageLevel.personalBest;

    if(storagePB && storagePB < level.personalBest){
      level.personalBest = storagePB; 
    }
    //update storage
    localStorage.setItem( 'game-levels', JSON.stringify(this.levels));
    
    const title ='CONGRATULATIONS!';
    let subtitle ='';
    let anotherLevel = this.cardsDisplayed !== 15? 'Why not try another level now?' : 'Well done! Thank you for playing.';
    if(this.currentBest === Math.floor(this.cardsDisplayed/2)){
      subtitle = `You are a SUPER-HERO! You rock at this game. ${anotherLevel}`
    }else{
      subtitle = 'You are doing a great job! '
      if(storagePB && storagePB > this.currentBest){
        subtitle += ' And you beat your Personal Best on top of that. Keep it up!'
      }
      
    }
    
    this.displayMessage(title,subtitle,level.personalBest)

    //display reset 
    const reset = document.querySelector('.reset');
    reset.style.opacity = 1;
    reset.style.top = '0px';
    reset.innerText = 'Reset your personal best for all levels.';
  }
  setLevel(e){
    let t = e.target.closest('input');
    if(t){
      this.cardsDisplayed = Number(t.value);
      t.checked = true;
      //set max attempts number accordingly to level
      this.maxAttempts = this.levels[`cards${this.cardsDisplayed}`]['maxAttempts'];
      console.log(this.maxAttempts)
      
    }
  }
  handleEvents(){
    this.gameBox.addEventListener('click', this.handleCardClick);
    document.querySelector('.play').addEventListener('click', this.loadCards)
    document.querySelector('form').addEventListener('click', this.setLevel)
    document.querySelector('.reset').addEventListener('click', this.resetSettings)
  }
  resetSettings(e){
    //clear storage
    localStorage.clear();
    //reset levels to init value
    this.levels={
      cards4:{
        maxAttempts: 10
      },
      cards8:{
        maxAttempts: 30
      },
      cards15:{
        maxAttempts: 50
      }
    }
    e.target.textContent = 'Reset Completed! Your personal best records have been deleted.';
    setTimeout(()=>{
      e.target.style.opacity = 0;
      e.target.style.top = '20px';
    },1000)
    let pb = document.querySelector( '.personal_best' ).textContent;
    if(pb.length>0){
      document.querySelector( '.personal_best' ).textContent = `Personal Best: DELETED`;
    }
    //restart game
    this.start();
  }
  start(){
    this.handleEvents();
    //initialize storage
    //get game levels object from localStorage
    const storage = JSON.parse(localStorage.getItem( 'game-levels'));
    if(!storage){
      localStorage.setItem( 'game-levels', JSON.stringify(this.levels))
    }
  }
  
}


let game = new GameUI();
game.start();

