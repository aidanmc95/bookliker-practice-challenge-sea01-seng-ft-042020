document.addEventListener("DOMContentLoaded", function() {
    const bookURL = "http://localhost:3000/books"
    const list = document.getElementById("list")
    const showdiv = document.getElementById("show-panel")
    const mainUser = {"id":"1", "username":"pouros"}

    function addBook(book) {
        const li = document.createElement("li")
        li.id = book.id
        li.innerText = book.title

        list.appendChild(li)

        const bookCard = document.createElement("div")
        bookCard.className = "card"
        bookCard.hidden = true

        addShowCardEvent(li, bookCard)

        const title = document.createElement("h3")
        title.innerText = book.title

        const image = document.createElement("img")
        image.src = book.img_url

        const description = document.createElement("p")
        description.innerText = book.description

        const userList = document.createElement("ul")
        userList.className = "user-likes"
        userList.id = book.id

        book.users.forEach(user => {
            const userLi = document.createElement("li")
            userLi.innerText = user.username
            userLi.id = user.id

            userList.appendChild(userLi)
        })

        const likeButton = document.createElement("button")
        likeButton.innerText = "Like"
        likeButton.id = book.id
        
        bookCard.appendChild(title)
        bookCard.appendChild(image)
        bookCard.appendChild(description)
        bookCard.appendChild(userList)
        bookCard.appendChild(likeButton)

        showdiv.appendChild(bookCard)

        addLikeEvent(likeButton)
    }

    function addShowCardEvent(title, card) {
        title.addEventListener("click", function() {
            const allCards = document.querySelectorAll(".card")
            allCards.forEach(bookCard => bookCard.hidden = true)
            card.hidden = false
        })
    }

    function addLikeEvent(likeButton) {
        likeButton.addEventListener("click", function(event) {
            const userHash = []
            const parent = event.target.parentNode
            parent.querySelectorAll("li").forEach(user => userHash.push({"id": user.id, "username": user.innerText}))

            if (userHash[userHash.length - 1].id != mainUser.id) {
                userHash.push(mainUser)
            } else {
                userHash.pop()
            }

            const configureObject = {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json"
                },
                body: JSON.stringify({
                    "users": userHash
                })
              }

            fetch(bookURL + `/${event.target.id}`, configureObject)
            .then(resp => resp.json())
            .then(json => {
                const userList = document.createElement("ul")
                userList.className = "user-likes"
                userList.id = json.id

                json.users.forEach(user => {
                    const userLi = document.createElement("li")
                    userLi.innerText = user.username
                    userLi.id = user.id
                        
                    userList.appendChild(userLi)
                })

                parent.replaceChild(userList, parent.querySelector("ul"))
            })
        })
    }

    function getBooks(){
        fetch(bookURL)
        .then(resp => resp.json())
        .then(json => json.forEach(book => addBook(book)))
    }

    getBooks();
});
