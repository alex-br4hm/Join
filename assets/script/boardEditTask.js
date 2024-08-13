assignedContacts = [];

function initRenderAssignedContacts(i) {
  let assignedUserHTML = '';
  assignedContacts = [];
  if (tasks[i].assigned_user && tasks[i].assigned_user.length > 0) {
    tasks[i].assigned_user.forEach((user) => {
      let user_id = getUserIdByName(user.name);
      let assignedUser = getUserObjectById(user_id);
      assignedContacts.push(assignedUser);
      let assignedUserColor = getColorAssignedUser(user.name);
      assignedUserHTML += initRenderAssignedContactsHTML(assignedUserColor, user, user_id);
    });
  } else {
    assignedUserHTML = ``;
  }
  return assignedUserHTML;
}

function renderAssignedContactsPopUp(i) {
  assignedContacts = [];
  let assignedUser = '';
  tasks[i].assigned_user.forEach((user) => {
    let user_id = getUserIdByName(user.name);
    let assignedUser = getUserObjectById(user_id);
    assignedContacts.push(assignedUser);
    let assignedUserColor = getColorAssignedUser(user.name);
    assignedUser += `
       <div class="assigned-contacts-img" style="background-color: ${assignedUserColor}; color:white;" data-id="${user_id}">
          ${user.first_two_letters}
       </div>
       `;
  });
  return assignedUser;
}

function getUserObjectById(user_id) {
  return contacts.find((user) => user.id === user_id);
}
/**
 * render dropdown contactlist to assign user
 * checks, assigned user and marks them
 * @param {*} i
 */

function renderContactsDropdownPopUpEdit(i) {
  let dropdown = document.getElementById('assignedDropdown');
  dropdown.innerHTML = '';

  for (let j = 0; j < contacts.length; j++) {
    let isAssigned = false;
    let imgSrc = './assets/img/check_btn.png';

    if (tasks[i].assigned_user && tasks[i].assigned_user.length > 0) {
      for (let k = 0; k < tasks[i].assigned_user.length; k++) {
        let assigned_user_id = getUserIdByName(tasks[i].assigned_user[k].name);

        if (assigned_user_id === contacts[j].id) {
          isAssigned = true;
          imgSrc = './assets/img/checked_btn_white_svg.svg';
          break;
        }
      }
    }
    dropdown.innerHTML += renderContactsDropdownPopUpEditHTML(j, imgSrc, isAssigned);
  }
}

function getUserIdByName(userName) {
  const user = contacts.find((user) => user.name.includes(userName));
  return user ? user.id : null;
}

function markContactEditPopUp(contactId, i) {
  let contact = document.getElementById(`contact${contactId}`);
  let checkbox = document.getElementById(`contactCheckBtn${contactId}`);
  contact.classList.toggle('marked');
  renderAssignedContactsEditPopUp();

  if (contact.classList.contains('marked')) {
    contact.style.backgroundColor = '#2A3647';
    contact.style.color = 'white';
    checkbox.src = './assets/img/checked_btn_white_svg.svg';
    addContactToAssignedEditPopUp(contactId);
  } else {
    contact.style.color = 'black';
    contact.style.backgroundColor = 'white';
    checkbox.src = './assets/img/check_btn.png';
    removeContactFromAssignedEditPopUp(contactId);
  }
}

function addContactToAssignedEditPopUp(contactId) {
  let contact = contacts.find((c) => c.id === contactId);
  if (contact && !assignedContacts.some((c) => c.id === contactId)) {
    assignedContacts.push(contact);
    renderSingleAssignedContact(contact);
  }
}

function removeContactFromAssignedEditPopUp(contactId) {
  let index = assignedContacts.findIndex((c) => c.id === contactId);
  if (index !== -1) {
    assignedContacts.splice(index, 1);
    document.querySelector(`#assignedContacts .assigned-contacts-img[data-id="${contactId}"]`).remove();
  }
}

function renderSingleAssignedContact(contact) {
  let content = document.getElementById('assignedContacts');
  content.innerHTML += `
      <div class="assigned-contacts-img" data-id="${contact.id}" style="background-color: ${contact.color}; color: white;">
         ${contact.first_two_letters}
      </div>`;
}

function renderAssignedContactsEditPopUp() {
  let content = document.getElementById('assignedContacts');
  content.innerHTML = '';
  for (let i = 0; i < assignedContacts.length; i++) {
    const contact = assignedContacts[i];
    content.innerHTML += `
         <div class="assigned-contacts-img" data-id="${contact.id}" style="background-color: ${contact.color}; color: white;">
            ${contact.first_two_letters}
         </div>`;
  }
}

function showAssignedDropdown() {
  document.getElementById('assignedDropdown').classList.remove('d-none');
  showOpenedDropdownIcon();
}

function hideAssignedDropdown() {
  event.stopPropagation();
  document.getElementById('assignedDropdown').classList.add('d-none');
  hideOpenedDropdownIcon();
}

function showOpenedDropdownIcon() {
  document.getElementById('dropdown1').classList.add('d-none');
  document.getElementById('dropdown2').classList.remove('d-none');
}

function hideOpenedDropdownIcon() {
  document.getElementById('dropdown2').classList.add('d-none');
  document.getElementById('dropdown1').classList.remove('d-none');
}

// ___________________________________________
//             SUBTASK SECTION
// ___________________________________________

function showSubtasksIcons() {
  document.getElementById('subtasksPlusIcon').classList.add('d-none');
  document.getElementById('subtasksInputIcons').classList.remove('d-none');
}

function addNewSubtaskEditPopUp(i) {
  let input = document.getElementById('subtasksInput').value;
  let newSubTask = { 'subtask_name': input, 'subtask_isdone': false };
  if (!tasks[i].subtasks) {
    tasks[i].subtasks = [];
  }
  tasks[i].subtasks.push(newSubTask);
  let subtasksListContainer = document.getElementById('subtasksList');
  subtasksListContainer.innerHTML = `${renderSubtasksEditPopUp(i)}`;
}

function renderSubtasksEditPopUp(i) {
  let subtaskList = '';

  if (tasks[i].subtasks && tasks[i].subtasks.length > 0) {
    for (let j = 0; j < tasks[i].subtasks.length; j++) {
      let subTaskTitle = tasks[i].subtasks[j].subtask_name;
      subtaskList += renderSubtasksEditPopUpHTML(i, j, subTaskTitle);
    }
  } else {
    subtaskList = ``;
  }

  return subtaskList;
}

// SUBTASKS

function editSubtask(i, j, subTaskTitle) {
  let subtask = document.getElementById(`subtask${j}`);
  subtask.innerHTML = editSubtaskHTML(i, j, subTaskTitle);
  subtask.style.padding = '2px 0px 2px 0px';
}

function saveEditedSubtask(i, j) {
  input = document.getElementById(`onEditSubtaskInput${j}`);
  tasks[i].subtasks[j].subtask_name = input.value;
  renderSubtasksAfterEdit(i, j);
}

function deleteSubtask(i, j) {
  tasks[i].subtasks.splice(j, 1);
  renderSubtasksAfterEdit(i);
}

function renderSubtasksAfterEdit(i) {
  let subtasksList = document.getElementById('subtasksList');
  subtasksList.innerHTML = '';
  for (let j = 0; j < tasks[i].subtasks.length; j++) {
    let subTaskTitle = tasks[i].subtasks[j].subtask_name;
    subtasksList.innerHTML += renderSubtasksEditPopUpHTML(i, j, subTaskTitle);
  }
}

function showEditIcons(event, i) {
  let icons = document.getElementById(`subtask${i}Icons`);
  icons.classList.remove('d-none');
}

function hideEditIcons(i) {
  let icons = document.getElementById(`subtask${i}Icons`);
  icons.classList.add('d-none');
}

// __________________________________________________________________;
// Find Task

function handleKeyup(event) {
  let searchInput = ('onkeyup:', event.target.value);
  findTaskInBoard(searchInput);
}

let matchedTasks = [];
let matchedTasksIndex = [];

function findTaskInBoard(searchInput) {
  matchedTasks = [];
  matchedTasksIndex = [];
  searchInput = searchInput.trim().toLowerCase();
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].name.toLowerCase().includes(searchInput)) {
      matchedTasks.push(tasks[i]);
    }
  }

  for (let j = 0; j < matchedTasks.length; j++) {
    matchedTasksIndex.push(findTaskIndexById(matchedTasks[j].id));
  }

  renderTasksIntoColumnsSearching();
}

function findTaskIndexById(id) {
  let basicIndex = tasks.findIndex((task) => task.id === id);
  return basicIndex;
}

function renderTasksIntoColumnsSearching() {
  clearAllColums();
  for (let i = 0; i < matchedTasks.length; i++) {
    switch (matchedTasks[i].state) {
      case 'todo':
        todoCounter++;
        todoColumn.innerHTML += renderTasksIntoColumnsHTML(matchedTasksIndex[i]);
        break;
      case 'inprogress':
        inProgressCounter++;
        inProgressColumn.innerHTML += renderTasksIntoColumnsHTML(matchedTasksIndex[i]);
        break;
      case 'awaitfeedback':
        awaitFeedbackCounter++;
        awaitFeedbackColumn.innerHTML += renderTasksIntoColumnsHTML(matchedTasksIndex[i]);
        break;
      case 'done':
        doneCounter++;
        doneColumn.innerHTML += renderTasksIntoColumnsHTML(matchedTasksIndex[i]);
        break;
      default:
        console.error(`Unknown state: ${task.state}`);
    }
  }
  checkIfColumnIsEmpty();
}

document.getElementById('searchTask').addEventListener('input', function (event) {
  let searchInput = event.target.value;
  if (searchInput === '') {
    renderTasksIntoColumnsSearching();
  }
});
