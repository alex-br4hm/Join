let user = [];
let contacts = [];
let tasks = [];
const BASE_URL = 'https://joinalex-1e443-default-rtdb.europe-west1.firebasedatabase.app/';
loadData();

async function loadData() {
  let response = await fetch(BASE_URL + '.json');
  let responseAsJson = await response.json();
  try {
    user = Object.values(responseAsJson.users);
    contacts = Object.values(responseAsJson.contacts);
    tasks = Object.values(responseAsJson.tasks);
  } catch (error) {}
  pushUsersToContacts(user, contacts);
}

// COLOR-COLLECTION

const colorCodes = [
  '#FF6347', // Tomato
  '#40E0D0', // Turquoise
  '#7B68EE', // Medium Slate Blue
  '#3CB371', // Medium Sea Green
  '#FF1493', // Deep Pink
  '#00FA9A', // Medium Spring Green
  '#4169E1', // Royal Blue
  '#DB7093', // Pale Violet Red
  '#228B22', // Forest Green
  '#4682B4', // Steel Blue
  '#8A2BE2', // Blue Violet
  '#2E8B57', // Sea Green
  '#FF4500', // Orange Red
  '#20B2AA', // Light Sea Green
  '#9932CC', // Dark Orchid
  '#32CD32', // Lime Green
  '#FFD700', // Gold
  '#00BFFF', // Deep Sky Blue
  '#A0522D', // Sienna
  '#00CED1', // Dark Turquoise
  '#9932CC', // Dark Orchid
  '#8B4513', // Saddle Brown
  '#FFA07A', // Light Salmon
  '#2F4F4F', // Dark Slate Gray
  '#BA55D3', // Medium Orchid
  '#7FFF00', // Chartreuse
  '#00FFFF', // Cyan
  '#FF69B4', // Hot Pink
  '#ADFF2F', // Green Yellow
  '#FF8C00', // Dark Orange
  '#7CFC00', // Lawn Green
  '#00FF7F', // Spring Green
  '#FFDAB9', // Peach Puff
  '#FF6347', // Tomato
  '#6A5ACD', // Slate Blue
  '#FA8072', // Salmon
  '#FFC0CB', // Pink
  '#DDA0DD', // Plum
  '#4682B4', // Steel Blue
  '#FF4500', // Orange Red
  '#E9967A', // Dark Salmon
  '#8B008B', // Dark Magenta
  '#98FB98', // Pale Green
  '#BDB76B', // Dark Khaki
  '#FFB6C1', // Light Pink
  '#FFA500', // Orange
  '#FF00FF', // Magenta
  '#B0C4DE', // Light Steel Blue
  '#BA55D3', // Medium Orchid
  '#C71585' // Medium Violet Red
];



// This function is to sort the data in database in right way, to work with it correctly.
// ONLY NECESSARY WITH TESTDATA JSON. ONLY ONE TIME.
// USE ONE TIME IF DATA COMES FROM TESTDATA.JSON

async function uploadTestData() {
  await loadData();
  pushUsersToContacts(user, contacts);
  await uploadDataToHaveCorrectKeyInDB();
}

async function uploadDataToHaveCorrectKeyInDB() {
  const dataToUpload = {
    users: user.reduce((acc, u) => (u ? { ...acc, [u.id]: u } : acc), {}),
    tasks: tasks.reduce((acc, t) => (t ? { ...acc, [t.id]: t } : acc), {}),
    contacts: contacts.reduce((acc, c) => (c ? { ...acc, [c.id]: c } : acc), {})
  };

  try {
    let response = await fetch(BASE_URL + '.json', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataToUpload)
    });

    if (!response.ok) {
      throw new Error('Fehler beim Hochladen der Daten');
    }

    let responseData = await response.json();
    console.log('Daten erfolgreich hochgeladen', responseData);
  } catch (error) {
    console.error('Fehler:', error);
  }
}

function pushUsersToContacts(user, contacts) {
  eliminateNullinArray();
  user.forEach((singleUser) => {
    let { password, ...userWithoutPassword } = singleUser;
    const usernameExists = contacts.find((contact) => contact.name === userWithoutPassword.username);
    const idExists = contacts.find((contact) => contact.id === userWithoutPassword.id);
    if (!usernameExists && !idExists) {
      contacts.push(userWithoutPassword);
    }
  });
}

function eliminateNullinArray() {
  for (let i = contacts.length - 1; i >= 0; i--) {
    if (contacts[i] === null) {
      contacts.splice(i, 1);
    }
  }

  for (let i = user.length - 1; i >= 0; i--) {
    if (user[i] === null) {
      user.splice(i, 1);
    }
  }
}
// ____________________________________________________________________________
