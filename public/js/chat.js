const url = window.location.hostname.includes("localhost")
  ? "http://localhost:8080"
  : "https://restserver-curso-fher.herokuapp.com";

let user = null;
let socket = null;

// Referencias HTML
const txtUid = document.querySelector("#txtUid");
const txtMessage = document.querySelector("#txtMessage");
const ulUsers = document.querySelector("#ulUsers");
const ulMessages = document.querySelector("#ulMessages");
const btnLogout = document.querySelector("#btnLogout");

// Validar el token del localstorage
const validateJWT = async () => {
  try {
    const token = localStorage.getItem("token") || "";

    if (token.length <= 10) {
      window.location = "index.html";
      throw new Error("There is not token in the server");
    }

    const resp = await fetch(`${url}/api/auth/validate-token`, {
      headers: { "x-token": token },
    });

    const { user: userDB, token: tokenDB } = await resp.json();

    localStorage.setItem("token", tokenDB);
    user = userDB;
    document.title = user.name;

    await conectarSocket();
  } catch (err) {
    window.location = "index.html";
    localStorage.removeItem("token");
    throw new Error("There is not token in the server");
  }
};

const conectarSocket = async () => {
  socket = io({
    extraHeaders: {
      "x-token": localStorage.getItem("token"),
    },
  });

  socket.on("connect", () => {
    console.log("Sockets online");
  });

  socket.on("disconnect", () => {
    console.log("Sockets offline");
  });

  socket.on("receive-messages", renderMenssages);
  socket.on("users-active", renderUsers);

  socket.on("private-message", (payload) => {
    console.log("Private:", payload);
  });
};

const renderUsers = (users = []) => {
  let usersHtml = "";
  users.forEach(({ name, uid }) => {
    usersHtml += `
            <li>
                <p>
                    <h5 class="text-success"> ${name} </h5>
                    <span class="fs-6 text-muted">${uid}</span>
                </p>
            </li>
        `;
  });

  ulUsers.innerHTML = usersHtml;
};

const renderMenssages = (messagges = []) => {
  console.log(messagges);
  let messagesHTML = "";
  messagges.forEach(({ name, message }) => {
    messagesHTML += `
            <li>
                <p>
                    <span class="text-primary">${name}: </span>
                    <span>${message}</span>
                </p>
            </li>
        `;
  });

  ulMessages.innerHTML = messagesHTML;
};

txtMessage.addEventListener("keyup", ({ keyCode }) => {
  const message = txtMessage.value;
  const uid = txtUid.value;

  if (keyCode !== 13) {
    return;
  }
  if (message.length === 0) {
    return;
  }

  socket.emit("send-message", { message, uid });

  txtMessage.value = "";
});

btnLogout.addEventListener("click", () => {
  localStorage.removeItem("token");

  const auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(() => {
    console.log("User signed out.");
    window.location = "index.html";
  });
});

const main = async () => {
  // Validar JWT
  await validateJWT();
};

(() => {
  gapi.load("auth2", () => {
    gapi.auth2.init();
    main();
  });
})();

// main();
