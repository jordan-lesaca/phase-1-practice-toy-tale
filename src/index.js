let addToy = false;
let toyCollection = document.querySelector('#toy-collection')

function getToys(){
  return fetch("http://localhost:3000/toys")
  .then(resp => resp.json())
}

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyForm = document.querySelector(".container");

  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    if (addToy) {
      toyForm.style.display = "block"
      toyForm.addEventListener('submit', (e) => {
        e.preventDefault()
        postToy(e.target)
      })
    } else {
      toyForm.style.display = "none"
    }
  })
})

function postToy(toyInfo){
  fetch('http://localhost:3000/toys', {
    method: "POST", 
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      "name": toyInfo.name.value,
      "image": toyInfo.image.value,
      "likes": 0
    })
  })
  .then(res => res.json())
  .then((toyObj) => {
    let newToy = createToy(toyObj)
    toyCollection.append(newToy)
  })
}

function createToy(toy){

  let title = document.createElement('h2')
  title.innerText = toy.name
  let image = document.createElement('IMG')
  image.src = toy.image
  image.className = "toy-avatar"
  let likes = document.createElement('p')
  likes.innerText = toy.likes
  let like = document.createElement('button')
  like.innerText = "Like <3"
  like.className = "like-btn"
  like.id = toy.id
  like.addEventListener("click", (e) => {
    console.log(e.target.dataset)
    likeToy(e)
})
let card = document.createElement('div')
card.className = 'card'
card.append(title, image, likes, like)
toyCollection.append(card)
}

function likeToy(e){
  e.preventDefault()
  let addOne = parseInt(e.target.previousElementSibling.innerText) + 1
  fetch(`http://localhost:3000/toys/${e.target.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      "likes": addOne
    })
  })
  .then(resp => resp.json() )
  // .then((likeToy => {
  //   e.target.previousElementSibling.innerText = `${addOne} likes`
  // }))
}

getToys().then(toys => {
  toys.forEach(toy => {
    createToy(toy)
  })
})