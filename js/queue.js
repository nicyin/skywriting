var words1 = [
    'She', 'stepped', 'out', 'past', 'the', 'heavy', 'glass', 'doors', 'and', 'walked', 'into', 'a', 'sea', 'of', 'murmurs', 'H', 'H...E', 'He', 'what?', 'The', 'murmuring', 'winds', 'down', 'a', 'ripple', 'of', 'heads', 'crane', 'up', 'H', 'E', 'L', 'L', 'Waves', 'of', 'gasps', 'and', 'prayers', 'chanted', 'under', 'breath', 'replace', 'the', 'silence', 'what', 'makes', 'them', 'so', 'certain', 'God', 'speaks', 'English', 'H', 'E', 'L', 'L', 'O', 'Oh', 'hell', 'It', 'is', 'just', 'a', 'hello'
]

var words2 = [
    'The', 'instruction', 'was', 'written', 'on', 'a', 'card', 'by', 'some', 'famous', 'artist', 'and', 'forgotten', 'for', '40', 'years', 'Today', 'they', 'gather', 'in', 'a', 'hipster', 'backyard', 'one', 'hand', 'holding', 'lukewarm', 'white', 'wine', 'served', 'in', 'cheap', 'plastic', 'the', 'other', 'name', 'dropping', 'this-or-that', 'installation', 'they', 'saw', 'of', 'this', 'famous', 'artist', 'shame', 'they', 'didn’t', 'do', 'it', 'then', 'this', 'land', 'art', 'piece', 'in', 'the', 'air', '—', 'yes', 'yes', 'wasn’t', 'it', 'brilliant'
]

var words3 = [
    'Remember', 'if', 'you', 'fly', 'high', 'enough', 'they', 'can’t', 'even', 'see', 'you', 'He', 'lines', 'up', 'in', 'formation', 'with', 'the', 'rest', 'five', 'altogether', 'ready', 'for', 'this', 'choreography', 'they’ve', 'done', 'all', 'too', 'many', 'times', 'Take', 'off', 'space', 'out', 'equal', 'distance', 'between', 'Puff', 'puff', 'gap', 'gap', 'puff', 'gap', 'puff', 'Somewhere', 'on', 'the', 'ground', 'a', 'shriek', 'and', 'a', 'yes', 'Applause', 'beneath', 'silent', 'magic'
]

/*var test = [
    'drift', 'quiet', 'morning', 'the', 'sky', 'holds', 'still', 'a', 'small', 'plane', 'crosses',
    'somewhere', 'over', 'clouds', 'gather', 'and', 'then', 'it', 'was', 'gone', 'faint', 'light',
    'a', 'long', 'breath', 'nothing', 'to', 'say', 'just', 'passing', 'through', 'soft', 'static',
    'half', 'a', 'thought', 'the', 'horizon', 'bends', 'still', 'here', 'a', 'little', 'further',
    'not', 'yet', 'almost', 'morning', 'the', 'wind', 'turns', 'somewhere', 'else',
    'a', 'held', 'note', 'fading', 'in', 'fading', 'out', 'one', 'more', 'line',
    'the', 'shape', 'of', 'it', 'barely', 'there', 'a', 'whole', 'afternoon', 'coming', 'back', 'around',
    'low', 'light', 'the', 'long', 'way', 'home'
]*/

var i = 0;

var stories = [words1, words2, words3];

var words = stories[Math.floor(Math.random() * stories.length)];

// add function so stories don't repeat on reload?

function peekPhrase(){
    return words[i].toUpperCase(); //upper or lower tbd
}

function phrase(){

    var word = words[i];
    i = (i + 1) % words.length;
    return word;

}