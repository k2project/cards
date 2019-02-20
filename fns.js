function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function encode(str){
  return str.split('').map(letter=>letter.charCodeAt(0)).join('-');
}
function decode(str){
  return str.split('-').map(num=>String.fromCharCode(Number(num))).join('');

}

function random(min, max){
  return Math.floor(Math.random()*(max-min+1)+min)
}