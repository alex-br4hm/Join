let contacts = [
   {
      "phonenumber": 876543221,
      "email": "ander@anders.de",
      "name": "Anders Anderson",
   },
   {
      "phonenumber": 555696969,
      "email": "bunny@lola.de",
      "name": "Lola Bunny",
   },
   {
      "phonenumber": 876543221,
      "email": "ander@anders.de",
      "name": "Anders Anderson",
   },
   {
      "phonenumber": 555696969,
      "email": "bunny@lola.de",
      "name": "Lola Bunny",
   },
   {
      "phonenumber": 876543221,
      "email": "ander@anders.de",
      "name": "Anders Anderson",
   },
   {
      "phonenumber": 555696969,
      "email": "bunny@lola.de",
      "name": "Lola Bunny",
   },
   {
      "phonenumber": 876543221,
      "email": "ander@anders.de",
      "name": "Anders Anderson",
   },
   {
      "phonenumber": 555696969,
      "email": "bunny@lola.de",
      "name": "Lola Bunny",
   },
   {
      "phonenumber": 876543221,
      "email": "ander@anders.de",
      "name": "Anders Anderson",
   },
   {
      "phonenumber": 555696969,
      "email": "bunny@lola.de",
      "name": "Lola Bunny",
   },
   {
      "phonenumber": 876543221,
      "email": "ander@anders.de",
      "name": "Anders Anderson",
   },
   {
      "phonenumber": 555696969,
      "email": "bunny@lola.de",
      "name": "Lola Bunny",
   },
];

let contactCardBigContainer = document.getElementById("contactCardBigContainer");

function renderContact() {
   for (let i = 0; i < contacts.length; i++) {
      let avatar;
      avatar = renderAvatar(i, avatar);
      document.getElementById("contactList").innerHTML += `<div class="contact" onclick="renderContactCardInfo(${i})">
           <div class="contactDetails">
           <div class="img-contacts">
              <div id="avatar${i}" class="avatar">${avatar}</div>
           </div>
           <div class="contacts-content-list">
              <span>${contacts[i]["name"]}</span>
              <a href="">Email: ${contacts[i]["email"]}</a>
           </div>
            </div>
        </div>
    `;
   }
}

function renderAvatar(i, avatar) {
   const username = contacts[i]["name"];
   const firstNameInitial = username[0];
   const secondNameInitial = username.split(" ")[1].split("")[0];
   avatar = firstNameInitial + secondNameInitial;
   return avatar;
}

function renderContactCardInfo(i) {
   let avatar;
   avatar = renderAvatar(i, avatar);
   contactCardBigContainer.innerHTML = `<div class="contact-card-name-container">
            <div class="avatar avatar-big">${avatar}</div>
            <div>
               <div class="contact-card-name">${contacts[i].name}</div>
               <div class="edit-delete-container">
                  <span class="edit-icon-wrapper">
                     <div class="edit-icon"></div><span class="edit-name">Edit</span>
                  </span>
                  <span class="delete-icon-wrapper">
                     <div class="trash-icon"></div><span class="delete-name">Delete</span>
                  </span>
               </div>
            </div>
         </div>

         <div id="contact-card-info-container" class="contact-card-info-container">
            <div class="headline-contact-information">Contact Information</div>
            <div class="contact-card-info-wrapper">
               <div class="contact-info-email-headline">Email</div>
               <div class="contact-info-email">${contacts[i].email}</div>
               <div class="contact-info-phone-headline">Phone</div>
               <div class="contact-info-phone">+${contacts[i].phonenumber}</div>
            </div>
         </div>`;
}

//** Helper Functions */

let popUpBackground = document.getElementById("popUpBackground");
let contentPopUp = document.getElementById("contentPopUp");
let closePopUpBtn = document.getElementById("closePopUpBtn");
popUpBackground.addEventListener("click", closePopUp);

function openPopUp() {
   popUpBackground.classList.remove("d-none");
}

function closePopUp() {
   if (event.target === popUpBackground || closePopUpBtn) {
      popUpBackground.classList.add("d-none");
   }
}
