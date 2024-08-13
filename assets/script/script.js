async function includeHTML() {
  let includeElements = document.querySelectorAll('[w3-include-html]');
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute('w3-include-html'); // "includes/header.html"
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = 'Page not found';
    }
  }
  showUserLetter();
}

document.addEventListener('click', (event) => {
  let headerNav = document.getElementById('headerNav');
  let headerUserIcon = document.getElementById('headerUserIcon');
  if (event.target == headerUserIcon) {
    headerNav.classList.toggle('d-none');
  } else if (event.target != headerNav && headerNav) {
    headerNav.classList.add('d-none');
  }
});

function checkUser(user) {
  console.log('Angemeldeter Benutzer:', user.name);
}


async function showUserLetter() {
  if (sessionStorage.length != 0) {
    currentUserAvatar = sessionStorage.getItem('loggedIn');
    document.getElementById('headerUserIcon').innerHTML = currentUserAvatar;
  } else {
    document.getElementById('headerUserIcon').innerHTML = 'G';
  }
}
