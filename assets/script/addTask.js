let assignedContacts = [];
let tempSubtasks = [];
let currentButtonPrio = "";

let newTask = [];

function setDefaultPriority() {
  setPrioButton("medium");
}

function setPrioButton(prio) {
  changeButtonColorAndImg(prio);
  currentButtonPrio = prio;
}

function changeButtonColorAndImg(prio) {
  const priorities = ["urgent", "medium", "low"];
  const colors = {
    urgent: "#FF3D00",
    medium: "#FFA800",
    low: "#7AE229",
  };

  priorities.forEach((priority) => {
    let button = document.getElementById(priority + "Button");
    let img = document.getElementById(priority + "ButtonImg");
    if (priority === prio) {
      img.src = `./assets/img/prio_${priority}_white_svg.svg`;
      button.style.backgroundColor = colors[priority];
    } else {
      img.src = `./assets/img/prio_${priority}_svg.svg`;
      button.style.backgroundColor = "white";
    }
  });
}

// subtasks

// Verhindert Formularübermittlung beim Drücken der Enter-Taste im Subtasks-Feld und fügt stattdessen einen Subtask hinzu
document.getElementById("subtasksInput").addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    addNewSubtask();
  }
});

function showSubtasksIcons() {
  document.getElementById("subtasksPlusIcon").classList.add("d-none");
  document.getElementById("subtasksInputIcons").classList.remove("d-none");
}

function hideSubtasksIcons(event) {
  event.stopPropagation(); // Verhindert, dass das Klick-Event weitergeleitet wird
  document.getElementById("subtasksInputIcons").classList.add("d-none");
  document.getElementById("subtasksPlusIcon").classList.remove("d-none");
}

function clearSubtasksInput() {
  let input = document.getElementById("subtasksInput");
  input.value = "";
  hideSubtasksIcons(event);
}

function addNewSubtask() {
  let input = document.getElementById("subtasksInput").value;
  if (input.trim() !== "") {
    // Überprüft, ob das Eingabefeld nicht leer ist
    tempSubtasks.push(input);
    renderSubtasks();
    clearSubtasksInput();
    document.getElementById("subtasksInput").focus(); // Setzt den Fokus auf das Input-Feld
  }
}

document.getElementById("subtasksDiv").addEventListener("click", function () {
  document.getElementById("subtasksInput").focus(); // Setzt den Fokus auf das Input-Feld
});

function renderSubtasks() {
  let subtasksList = document.getElementById("subtasksList");
  subtasksList.innerHTML = "";
  for (let i = 0; i < tempSubtasks.length; i++) {
    const subtask = tempSubtasks[i];
    subtasksList.innerHTML += `<div id="subtask${i}">
    <div class="subtask-div" onmouseover="showEditIcons(event, ${i})" onmouseout="hideEditIcons(${i})"><p class="subtask-text">• ${subtask}</p>
  <div id="subtask${i}Icons" class="edit-subtask-icons d-none">
  <img onclick="editSubtask(${i})" src="./assets/img/edit_pen_icon.png" alt="">
  <div class="subtasks-seperator"></div>
  <img onclick="deleteSubtask(${i})" src="./assets/img/delete_trashcan_icon.png" alt="">
  </div>
  </div>`;
  }
}

function showEditIcons(event, i) {
  let DivElement = event.target;
  let icons = document.getElementById(`subtask${i}Icons`);
  icons.classList.remove("d-none");
}

function hideEditIcons(i) {
  let icons = document.getElementById(`subtask${i}Icons`);
  icons.classList.add("d-none");
}

function editSubtask(i) {
  let subtask = document.getElementById(`subtask${i}`);
  subtask.innerHTML = `
  <div class="edit-subtask-div">
    <input id="onEditSubtaskInput${i}" class="edit-subtask-input">
  <div class="on-edit-subtask-icons">
    <img onclick="deleteSubtask(${i})" src="./assets/img/delete_trashcan_icon.png" alt="">
    <div class="subtasks-seperator"></div>
    <img onclick="saveEditedSubtask(${i})" src="./assets/img/addtask_check.svg" alt="">
  </div>`;
  subtask.style.padding = "2px 0px 2px 0px";
  subtask.style.width = "432px";
  let input = document.getElementById(`onEditSubtaskInput${i}`);
  input.value = tempSubtasks[i];

  // Füge den Event-Listener hinzu, um Enter-Taste zu behandeln
  input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      saveEditedSubtask(i);
    }
  });
}

function saveEditedSubtask(i) {
  let input = document.getElementById(`onEditSubtaskInput${i}`).value;
  if (input.trim() !== "") {
    // Überprüft, ob das Eingabefeld nicht leer ist
    tempSubtasks.splice(i, 1, input);
    renderSubtasks();
  }
}

function deleteSubtask(i) {
  tempSubtasks.splice(i, 1);
  renderSubtasks();
}

// Assigned to

document.addEventListener("click", function (event) {
  const assignedDiv = document.querySelector(".assigned-to-div");
  const assignedDropdown = document.getElementById("assignedDropdown");
  const dropdown2 = document.getElementById("dropdown2");

  if (!assignedDiv.contains(event.target) && !assignedDropdown.contains(event.target)) {
    hideAssignedDropdown();
  }
});

function showAssignedDropdown() {
  const assignedDiv = document.querySelector(".assigned-to-div");
  assignedDiv.style.zIndex = 8;
  document.getElementById("assignedDropdown").classList.remove("d-none");
  showOpenedDropdownIcon();
}

function hideAssignedDropdown() {
  const assignedDiv = document.querySelector(".assigned-to-div");
  assignedDiv.style.zIndex = 5;
  document.getElementById("assignedDropdown").classList.add("d-none");
  hideOpenedDropdownIcon();
}

function showOpenedDropdownIcon() {
  document.getElementById("dropdown1").classList.add("d-none");
  document.getElementById("dropdown2").classList.remove("d-none");
}

function hideOpenedDropdownIcon() {
  document.getElementById("dropdown2").classList.add("d-none");
  document.getElementById("dropdown1").classList.remove("d-none");
}

document.getElementById("assignedDiv").addEventListener("click", function (event) {
  event.stopPropagation(); // Stoppt die Ausbreitung des Ereignisses
  document.getElementById("assignedInput").focus(); // Setzt den Fokus auf das Input-Feld
  showAssignedDropdown(); // Zeigt das Dropdown an
});

document.getElementById("dropdown2").addEventListener("click", function (event) {
  event.stopPropagation();
  hideAssignedDropdown();
});

function renderContacts() {
  let dropdown = document.getElementById("assignedDropdown");
  let searchInput = document.getElementById("assignedInput").value.toLowerCase(); // Wert des Suchfelds
  dropdown.innerHTML = ""; // Bereinigen des Dropdown-Inhalts

  // Sortieren der Kontakte alphabetisch nach Namen
  const sortedContacts = contacts.sort((a, b) => a.name.localeCompare(b.name));

  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    const isAssigned = assignedContacts.includes(contact); // Prüfen, ob der Kontakt markiert ist
    const contactClass = isAssigned ? "assigned-to-contact marked" : "assigned-to-contact"; // Klasse basierend auf Zuweisungsstatus
    const imgSrc = isAssigned ? "./assets/img/checked_btn_white_svg.svg" : "./assets/img/check_btn.png";

    // Überprüfen, ob der Kontaktname dem Suchkriterium entspricht
    if (contact.name.toLowerCase().includes(searchInput)) {
      // Erstellen des HTML-Strings für jeden Kontakt
      dropdown.innerHTML += `
        <div id="contact${contact.id}" class="${contactClass}" onclick="markContact(${contact.id}, ${i}); event.stopPropagation();">
          <div class="contact-img-name">
            <div class="two-letters-img" style="background-color: ${contact.color}; color: white;">
              ${contact.first_two_letters}
            </div>
            <span>${contact.name}</span>
          </div>
          <img id="contactCheckBtn${contact.id}" class="check-btn-img" src="${imgSrc}" alt="" />
        </div>`;
    }
  }
  if (dropdown.innerHTML == "") {
    dropdown.innerHTML = "<span class='no-contacts-text'>No contacts found.</span><div class='add-contact-div' onclick='locateToContacts()'>Add new contact <img class='add-contact-img' src='./assets/img/person_add_icon.png'</div>";
  }
}

function locateToContacts() {
  window.location.href = "contacts.html";
}

function addContactToAssigned(i) {
  let contact = contacts[i];
  assignedContacts.push(contact);
  renderAssignedContacts();
}

function removeContactFromAssignedById(contactId) {
  // Index des Kontakts im 'assignedContacts' Array finden
  let index = assignedContacts.findIndex((c) => c.id === contactId);

  // Prüfen, ob der Kontakt gefunden wurde, und nur dann entfernen
  if (index !== -1) {
    assignedContacts.splice(index, 1);
  }

  // Aktualisieren der Anzeige
  renderAssignedContacts();
  renderContacts(); // Aktualisieren des Dropdowns, um die Änderungen widerzuspiegeln
}

function renderAssignedContacts() {
  let content = document.getElementById("assignedContacts");
  content.innerHTML = "";
  for (let i = 0; i < assignedContacts.length; i++) {
    const contact = assignedContacts[i];
    content.innerHTML += `
      <div class="assigned-contacts-wrapper">
        <div class="assigned-contacts-img" onclick="removeContactFromAssignedById(${contact.id})" style="background-color: ${contact.color}; color: white">
          ${contact.first_two_letters}
        </div>
        <span class="tooltip">${contact.name}</span>
      </div>
    `;
  }
}

function markContact(contactId, i) {
  let contact = document.getElementById(`contact${contactId}`);
  let checkbox = document.getElementById(`contactCheckBtn${contactId}`);

  // Umschalten der Markierungsklasse
  contact.classList.toggle("marked");

  // Prüfen, ob die Klasse vorhanden ist, und dementsprechend das Bild ändern
  if (contact.classList.contains("marked")) {
    contact.style.backgroundColor = "#2A3647";
    contact.style.color = "white";
    checkbox.src = "./assets/img/checked_btn_white_svg.svg";
    addContactToAssigned(i);
  } else {
    contact.style.color = "black";
    contact.style.backgroundColor = "white";
    checkbox.src = "./assets/img/check_btn.png";
    removeContactFromAssignedById(contactId);
  }
}

// category

// Add global click event listener
document.addEventListener("click", function (event) {
  const categoryDiv = document.getElementById("categoryDiv");
  const categoryDropdown = document.getElementById("categoryDropdown");

  if (!categoryDiv.contains(event.target) && !categoryDropdown.contains(event.target)) {
    categoryDropdown.classList.add("d-none"); // Hide dropdown
    hideOpenedCategoryIcon();
  }
});

document.getElementById("categoryDiv").addEventListener("click", function (event) {
  event.stopPropagation(); // Stop propagation to prevent immediate re-closing
  let dropdown = document.getElementById("categoryDropdown");
  let categoryDiv = document.getElementById("categoryDiv");
  let requiredText = document.getElementById('requiredText3');

  if (dropdown.classList.contains("d-none")) {
    dropdown.classList.remove("d-none"); // Show dropdown
    showOpenedCategoryIcon();
  } else {
    dropdown.classList.add("d-none"); // Hide dropdown
    hideOpenedCategoryIcon();
  }

  if (categoryDiv.style.border !== "1px solid #FF8190") {
    categoryDiv.style.border = "1px solid #d1d1d1"; // Set default border
    requiredText.innerHTML = "";
  } 
});

function selectOption(option) {
  let selection = document.getElementById("categorySelection");
  let hiddenInput = document.getElementById("selectedCategory");

  if (option == 1) {
    selection.innerHTML = "Technical Task";
    hiddenInput.value = "Technical Task";
  } else if (option == 2) {
    selection.innerHTML = "User Story";
    hiddenInput.value = "User Story";
  }

  let dropdown = document.getElementById("categoryDropdown");
  dropdown.classList.add("d-none");
  hideOpenedCategoryIcon();
}

function showOpenedCategoryIcon() {
  document.getElementById("categoryIcon1").classList.add("d-none");
  document.getElementById("categoryIcon2").classList.remove("d-none");
}

function hideOpenedCategoryIcon() {
  document.getElementById("categoryIcon2").classList.add("d-none");
  document.getElementById("categoryIcon1").classList.remove("d-none");
}

// submit/add a task

// Verhindert die Standard-Formularübermittlung und ruft addTask() auf

function resetForm() {
  location.reload();
}

document.addEventListener("DOMContentLoaded", function () {
  // Funktion zur Validierung der Kategorie und gegebenenfalls Verhindern des Submit
  function validateCategory(event) {
    let requiredText = document.getElementById('requiredText3');
    let hiddenInput = document.getElementById("selectedCategory");
    let categoryDiv = document.getElementById("categoryDiv");
    if (hiddenInput.value === "") {
      categoryDiv.style.border = "1px solid #FF8190";
      requiredText.innerHTML = "This field is required"; // required Text wird hier eingefügt und angezeigt, bei category wird es dann entfernt
      event.preventDefault(); // Verhindert das Abschicken des Formulars
    } else {
      categoryDiv.style.border = "1px solid #d1d1d1";
    }
  }

  // Formular-Event-Listener zur Behandlung des Formular-Submit
  document.getElementById("addTaskForm").addEventListener("submit", function (event) {
    validateCategory(event);
    if (!event.defaultPrevented) {
      addTask(event);
    }
  });

  // Globaler Event-Listener für Enter-Taste, um das Formular abzusenden, wenn der Fokus nicht auf einem Eingabefeld liegt
  document.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
      event.preventDefault();
      // Manuelles Absenden des Formulars, um die native Validierung zu nutzen
      document.getElementById("addTaskForm").requestSubmit();
    }
  });
});

function formatDueDate(dueDate) {
  return dueDate.split("-").reverse().join("/");
}

async function addTask(event) {
  event.preventDefault(); // Verhindert das Standardverhalten des Formulars

  const createTaskButton = document.getElementById("createTaskButton");
  createTaskButton.disabled = true; // Button deaktivieren um die Erstellung von mehreren gleichen Tasks zu vermeiden

  let title = document.getElementById("titleInput").value;

  // Check for duplicate task titles
  if (tasks.some((task) => task.name === title)) {
    pendingTaskData = {
      title: title,
      description: document.getElementById("descriptionText").value,
      category: document.getElementById("categorySelection").innerHTML,
      dueDate: document.getElementById("dueDate").value,
      assignedUsers: assignedContacts.map((contact) => ({
        name: contact.name,
        first_two_letters: contact.first_two_letters,
      })),
      subtasks: tempSubtasks.map((subtask) => ({
        subtask_name: subtask,
        subtask_isdone: false,
      })),
    };
    showDuplicateTaskModal();
    createTaskButton.disabled = false; // Re-enable the button if duplicate is found
    return; // Exit the function to prevent creating a duplicate task
  }

  let newId = generateId();
  let description = document.getElementById("descriptionText").value;
  let category = document.getElementById("categorySelection").innerHTML;
  let dueDate = document.getElementById("dueDate").value;
  let formattedDueDate = formatDueDate(dueDate);

  // Dynamisch zugewiesene Kontakte aus assignedContacts Array
  let assignedUsers = assignedContacts.map((contact) => ({
    name: contact.name,
    first_two_letters: contact.first_two_letters,
  }));

  // Dynamisch erstellte Unteraufgaben aus tempSubtasks Array
  let subtasks = tempSubtasks.map((subtask) => ({
    subtask_name: subtask,
    subtask_isdone: false,
  }));

  let newTask = {
    name: title,
    id: newId,
    description: description,
    category: category,
    priority: currentButtonPrio,
    due_date: formattedDueDate,
    state: "todo",
    assigned_user: assignedUsers,
    subtasks: subtasks,
  };

  // Aufgabe zum lokalen Array hinzufügen
  tasks.push(newTask);

  // Aufgabe in Firebase speichern
  await updateData(`tasks/${newId}`, newTask);

  showToast();

  // Schließen des Popups nach dem Erstellen der Aufgabe
  closeModal();
}

function closeModal() {
  const modal = document.getElementById("duplicateTaskModal");
  modal.style.display = "none";
}

function showDuplicateTaskModal() {
  const modal = document.getElementById("duplicateTaskModal");
  modal.style.display = "block";

  const span = document.getElementsByClassName("task-close")[0];

  span.onclick = function () {
    closeModal();
  };

  document.getElementById("cancelDuplicateTask").onclick = function () {
    closeModal();
  };

  document.getElementById("confirmDuplicateTask").onclick = async function () {
    if (pendingTaskData) {
      await createNewTask(pendingTaskData);
      closeModal();
      pendingTaskData = null;
    }
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      closeModal();
    }
  };
}

async function createNewTask(taskData) {
  const newId = generateId();
  const formattedDueDate = formatDueDate(taskData.dueDate);

  let newTask = {
    name: taskData.title,
    id: newId,
    description: taskData.description,
    category: taskData.category,
    priority: currentButtonPrio,
    due_date: formattedDueDate,
    state: "todo",
    assigned_user: taskData.assignedUsers,
    subtasks: taskData.subtasks,
  };

  // Aufgabe zum lokalen Array hinzufügen
  tasks.push(newTask);

  // Aufgabe in Firebase speichern
  await updateData(`tasks/${newTask.id}`, newTask).then(() => {
    showToast("Task added to board");
  });

  // Schließen des Popups nach dem Erstellen der Aufgabe
  closeModal();
}

// Function to show toast message
// Funktion zum Anzeigen des Toast-Divs
function showToast() {
  let toastDiv = document.getElementById("toastDiv");
  toastDiv.classList.remove("d-none");
  toastDiv.classList.add("show");

  // Nach 1.3 Sekunden die Animation zurücksetzen und das Div ausblenden, dann weiterleiten
  setTimeout(function () {
    toastDiv.classList.remove("show");
    toastDiv.classList.add("d-none");
    window.location.href = "board.html"; // Weiterleitung zu board.html
  }, 1300);
}

// Funktion zum Aktualisieren der Daten in Firebase
async function updateData(path, data) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  let responseAsJson = await response.json();
}

function generateId() {
  let generatedId;
  let isUnique = false;

  while (!isUnique) {
    // Generiere eine zufällige 6-stellige Zahl
    generatedId = Math.floor(100000 + Math.random() * 900000);

    // Überprüfen, ob die ID bereits existiert
    isUnique = !tasks.some((task) => task.id === generatedId);
  }

  return generatedId;
}

// due date, generiert aktuelles Datum

function setDefaultDate() {
  const today = new Date();
  const day = ("0" + today.getDate()).slice(-2);
  const month = ("0" + (today.getMonth() + 1)).slice(-2);
  const year = today.getFullYear();
  const formattedDate = `${year}-${month}-${day}`;

  document.getElementById("dueDate").value = formattedDate;
}

const dueDateInput = document.getElementById('dueDate');

// Heutiges Datum als String im Format JJJJ-MM-TT erhalten
const today = new Date().toISOString().split('T')[0];

// Minimales Datum auf heute setzen
dueDateInput.setAttribute('min', today);

// Event-Listener hinzufügen, um Änderungen im Datum zu überwachen
dueDateInput.addEventListener('input', function() {
  const selectedDate = new Date(this.value);
  const currentDate = new Date();

  // Wenn das ausgewählte Datum in der Vergangenheit liegt, wird es auf das heutige Datum zurückgesetzt
  if (selectedDate < currentDate) {
    this.value = today;
  }
});
