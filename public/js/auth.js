const url = window.location.hostname.includes("localhost")
  ? "http://localhost:8080"
  : "https://restserver-caralo.herokuapp.com";

async function onSignIn(googleUser) {
  const profile = googleUser.getBasicProfile();
  console.log("ID: " + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log("Name: " + profile.getName());
  console.log("Image URL: " + profile.getImageUrl());
  console.log("Email: " + profile.getEmail()); // This is null if the 'email' scope is not present.
  try {
    const id_token = googleUser.getAuthResponse().id_token;
    const data = { id_token };
    const res = await fetch(`${url}/api/auth/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const value = await res.json();
    localStorage.setItem("token", token);
    window.location = "chat.html";
  } catch (err) {
    console.log("err", err);
  }
}
function signOut() {
  const auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log("User signed out.");
  });
}

const form = document.querySelector("form");

form.addEventListener("submit", async (ev) => {
  try {
    ev.preventDefault();
    const formData = {};

    for (let el of form.elements) {
      if (el.name.length > 0) formData[el.name] = el.value;
    }

    const res = await fetch(`${url}/api/auth/login`, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
    });
    const { msg, token } = await res.json();

    console.log(msg, token);

    localStorage.setItem("token", token);
    window.location = "chat.html";
  } catch (err) {
    console.log(err);
  }
});
