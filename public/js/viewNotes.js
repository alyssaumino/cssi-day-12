let userId = "";
window.onload = event => {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
            console.log("Signed in as", user.displayName);
            const googleUserId = user.uid;
            userId = googleUserId;
            getNotes(googleUserId);
        } else {
            window.location = "index.html";
        }
    });
}

const getNotes = (userId) => {
    const notesRef = firebase.database().ref(`users0/${userId}`);
    notesRef.on('value', (snapshot) => {
        const data = snapshot.val();
        renderDataAsHtml(data);
    })
}

const renderDataAsHtml = (data) => {
    let cards = ``;
    for (const noteItem in data) {
        const note = data[noteItem];
        console.log(`${note.title} ${note.text}`);   
        cards += createCard(note);
    }
    document.querySelector("#app").innerHTML = cards;
}

const createCard = (note) => {
    return `
        <div class="column is-one-quarter">
            <div class="card">
                <header class="card-header">
                    <p class="card-header-title">${note.title}</p>
                </header>
                <div class="card-content">
                    <div class="content">${note.text}</div>
                </div>
                <div class="card-content">
                    <div class="button">${note.label}</div>
                </div>
            </div>
        </div>
    `;
}

const searchForLabels = () => {
    const search = document.querySelector("#search").value;

    if (search === "all") {
        getNotes(userId);
    }
    else {
        let cards = ``;

        const notesRef = firebase.database().ref(`users0/${userId}`);
        notesRef.on('value', (snapshot) => {
            const data = snapshot.val();
            for (const noteItem in data) {
                const note = data[noteItem];
                if (note.label === search) {
                    cards += createCard(note);
                    console.log("match");
            }   
        }
        });
        document.querySelector("#app").innerHTML = cards;
    }
    document.querySelector("#search").value = "";
}