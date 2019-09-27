document.addEventListener('DOMContentLoaded', () => {

  // get the brief for the app

  function briefStripper(brief){
    const superfluousWords = ["on", "a", "of", "the", "in", "at", "so", "that", "to", "for", "it", "app"]
    return brief.split(" ").filter(word => !superfluousWords.includes(word))
  }

  //make a request for every word in the brief
  function wordRequest(word){
    return fetch(`https://wordsapiv1.p.mashape.com/words/${word}`, {headers: {"X-Mashape-Key": "184f0e47c8mshfc23c061e0a355bp14c8ddjsnd9afb38a3ff8"}})
    .then(res => res.json())
    .then(definition => {
      if(!definition.results) return word
      let randomIndex = Math.floor((Math.random() * definition.results.length))
      return definition.results[randomIndex]
    })
  }

  function shuffle(array){
    var currentIndex = array.length;
    var temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  };

  function suffixer(appName){
    const suffixes = ["erer", "izzy", "wow", "zam", "Pow!", "z", ".com"]
    let randomIndex = Math.floor((Math.random() * suffixes.length))
    let randomSuffix = suffixes[randomIndex]
    return `${appName}${randomSuffix}`
  }

  function displayAppName(appName){
    const fullAppName = suffixer(appName)
    const output = document.getElementById("userOutput")
    output.innerHTML = ""
    const nameDisplay = document.createElement('h1')
    if(appName === undefined){
      nameDisplay.innerText = "Please describe your app in more detail"
    } else {
      nameDisplay.innerText = `Your app is called ${fullAppName}`
    }
    output.appendChild(nameDisplay)
  }

  function nameGenerator(brief){
    const strippedBrief = briefStripper(brief)

    const promises = strippedBrief.map(word => wordRequest(word))

    Promise.all(promises).then(result => {
      //identify the nouns and verbs from the brief
      const verbsAndNouns = result.filter(word => word.partOfSpeech === "verb" || word.partOfSpeech === "noun")
      //pick a synonym for the nouns and verbs
      const synonyms = verbsAndNouns.map(word => {
        if(word.synonyms){
          let randomIndex = Math.floor((Math.random() * word.synonyms.length))
          let capitalisedWord = word.synonyms[randomIndex].charAt(0).toUpperCase() + word.synonyms[randomIndex].slice(1)
          return capitalisedWord.split(" ").join("")
        }
      })

      if(synonyms.length > 0){
        const appName = shuffle(synonyms).join("")
        displayAppName(appName)
      } else {
        displayAppName()
      }

    })
  }

  document.getElementById('name').addEventListener('click', () => {
    const brief = document.getElementById('brief').value
    nameGenerator(brief)
  })

})
