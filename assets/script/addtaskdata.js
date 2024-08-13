// let users;
// let contacts;
// let tasks;

// const BASE_URL = "https://join-61eb9-default-rtdb.europe-west1.firebasedatabase.app/";

async function updateData(path, data) {
    let response = await fetch(BASE_URL + path + ".json", {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  
    let responseAsJson = await response.json();
  }
 
  // test zum ändern der daten
  let updatedUserData = {
    "name": "Frodo Baggins",
    "id": 1,
    "email": "frodo@shire.com",
    "password": "newRingBearer1", 
    "phone": "1234567890",
    "first_two_letters": "FB",
    "color": "#1F3D7A", 
  };
  
  // updateData('users/0', updatedUserData);

