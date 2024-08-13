const addTaskPopUpBackground = document.getElementById('addTaskPopUpBackground');
const addTaskPopUp = document.getElementById('addTaskPopUp');
const closePopUpBtn = document.getElementById('closePopUpBtn');
const closePopUpBtn_2 = document.getElementById('closePopUpBtn_editTask');
const editTaskPopUpBackground = document.getElementById('editTaskPopUpBackground');
const editTaskPopUp = document.getElementById('editTaskPopUp');
const todoColumn = document.getElementById('todoColumnContainer');
const inProgressColumn = document.getElementById('inProgressColumnContainer');
const awaitFeedbackColumn = document.getElementById('awaitFeedbackColumnContainer');
const doneColumn = document.getElementById('doneColumnContainer');
let todoCounter = 0;
let inProgressCounter = 0;
let awaitFeedbackCounter = 0;
let doneCounter = 0;
let assignedContacts = [];

loadBoard();

async function loadBoard() {
  await loadData();
  renderTasksIntoColumns();
}

/**
 * checks the state of task
 * render tasks in the specific columns.
 * calls a function, to check if there is no task in a specific column
 */

async function renderTasksIntoColumns() {
  clearAllColums();
  tasks.forEach((task, index) => {
    switch (task.state) {
      case 'todo':
        todoCounter++;
        todoColumn.innerHTML += renderTasksIntoColumnsHTML(index);
        break;
      case 'inprogress':
        inProgressCounter++;
        inProgressColumn.innerHTML += renderTasksIntoColumnsHTML(index);
        break;
      case 'awaitfeedback':
        awaitFeedbackCounter++;
        awaitFeedbackColumn.innerHTML += renderTasksIntoColumnsHTML(index);
        break;
      case 'done':
        doneCounter++;
        doneColumn.innerHTML += renderTasksIntoColumnsHTML(index);
        break;
      default:
        console.error(`Unknown state: ${task.state}`);
    }
  });
  checkIfColumnIsEmpty();
}

function clearAllColums() {
  todoColumn.innerHTML = '';
  inProgressColumn.innerHTML = '';
  awaitFeedbackColumn.innerHTML = '';
  doneColumn.innerHTML = '';
  todoCounter = 0;
  inProgressCounter = 0;
  awaitFeedbackCounter = 0;
  doneCounter = 0;
}

function renderSubTasksToHTML(i) {
  let subTasksTemplate = '';
  let calculatedWidth = calcWidthOfProgressBar(i);
  let subTasksDone = countSubTask(i);
  subTasksTemplate = checkSubTasksTemplate(i, calculatedWidth, subTasksDone);
  return subTasksTemplate;
}

function checkSubTasksTemplate(i, calculatedWidth, subTasksDone) {
  let task = tasks[i];
  let hasSubtasks = task && Array.isArray(task.subtasks) && task.subtasks.length > 0;
  let width = hasSubtasks ? `${calculatedWidth}%` : '0%';
  let counter = hasSubtasks ? `${subTasksDone}/${task.subtasks.length}` : '0/0';

  return `
    <span class="subtask-bar-half" style="width: ${width}"></span>
    </div>
    <div class="subtask-counter">${counter} Subtasks</div>
  `;
}

/**
 *
 * @param {number} i index
 * @returns HTML-Template for assigned user
 */

function renderAssignedUserToHTML(i) {
  let assignedUserTemplate = '';
  let assignedUsers = [];
  assignedUsers = tasks[i].assigned_user;
  if (tasks[i].assigned_user && assignedUsers.length > 0) {
    assignedUsers.forEach((user) => {
      let assignedUserBackgroundColor = getColorAssignedUser(user.name);
      assignedUserTemplate += `<div class="task-member-icon" style="background-color: ${assignedUserBackgroundColor}">${user.first_two_letters}</div>`;
    });
  }

  return assignedUserTemplate;
}

function getColorAssignedUser(name) {
  let assignedUser = contacts.find((contact) => contact.name.toLowerCase().includes(name.toLowerCase()));
  if (assignedUser) {
    return assignedUser.color;
  }
}

function countSubTask(i) {
  let subTasksDone = 0;
  if (tasks[i] && tasks[i].subtasks && Array.isArray(tasks[i].subtasks)) {
    tasks[i].subtasks.forEach((subtask) => {
      if (subtask.subtask_isdone) {
        subTasksDone++;
      }
    });
  }
  return subTasksDone;
}

function calcWidthOfProgressBar(i, calculatedWidth) {
  if (tasks[i].subtasks && tasks[i].subtasks.length > 0) {
    subTasksDone = countSubTask(i);
    calculatedWidth = (subTasksDone * 100) / tasks[i].subtasks.length;
  } else {
    calculatedWidth = 0;
  }

  return calculatedWidth;
}

/**
 * catch the edgecase, if a column is empty.
 * if a column is empty, it gets a "No tasks to do" sign
 */

function checkIfColumnIsEmpty() {
  if (todoCounter === 0) {
    todoColumn.innerHTML = checkIfColumnIsEmptyHTML();
  }
  if (inProgressCounter === 0) {
    inProgressColumn.innerHTML = checkIfColumnIsEmptyHTML();
  }
  if (awaitFeedbackCounter === 0) {
    awaitFeedbackColumn.innerHTML = checkIfColumnIsEmptyHTML();
  }
  if (doneCounter === 0) {
    doneColumn.innerHTML = checkIfColumnIsEmptyHTML();
  }
}

function checkIfColumnIsEmptyHTML() {
  return `<div class="task-card-nothing-to-do task-card">No tasks to do</div>`;
}

/**
 * render the right task in the pop up
 */

function formateDueDateEditPopUp(i) {
  if (!tasks[i].due_date) {
    return;
  }
  let formattedDuDate = tasks[i].due_date;
  formattedDuDate = formattedDuDate.split('/').reverse().join('-');
  return formattedDuDate;
}

function renderEditTask(i) {
  editTaskPopUpBackground.innerHTML = renderEditTaskHTML(i);
}

async function getEditedTask(i) {
  event.preventDefault();

  editedName = document.getElementById('taskName').value;
  editedDescription = document.getElementById('taskDescription').value;
  editedDueDate = document.getElementById('dueDate').value;

  tasks[i].name = editedName;
  tasks[i].description = editedDescription;
  tasks[i].due_date = await formatDueDateAfterEdit(editedDueDate);
  tasks[i].assigned_user = assignedContacts;
  editTaskPopUpBackground.innerHTML = renderTaskPopUpHTML(i);
  await updateTaskData(i);
  await loadData();
  await renderTasksIntoColumns();
}

function formatDueDateAfterEdit(editedDueDate) {
  editedDueDate = editedDueDate.split('-').reverse().join('/');
  return editedDueDate;
}

async function updateTaskData(i) {
  let updatedTaskData = {
    'assigned_user': updateTaskDataAssignedUser(i),
    'subtasks': updateTaskDataSubtasks(i),
    'name': tasks[i].name,
    'id': tasks[i].id,
    'priority': tasks[i].priority,
    'state': tasks[i].state,
    'category': tasks[i].category,
    'description': tasks[i].description,
    'due_date': tasks[i].due_date
  };
  updateDataDB('tasks/' + tasks[i].id, updatedTaskData);
}

async function updateDataDB(path, data) {
  await fetch(BASE_URL + path + '.json', {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

function updateTaskDataAssignedUser(i) {
  if (!tasks[i].assigned_user) {
    return [{}];
  }
  return tasks[i].assigned_user.map((user) => {
    return { 'name': user.name, 'first_two_letters': user.first_two_letters };
  });
}

function updateTaskDataSubtasks(i) {
  if (!tasks[i].subtasks) {
    return [{}];
  }
  return tasks[i].subtasks.map((subtask) => {
    return { 'subtask_name': subtask.subtask_name, 'subtask_isdone': subtask.subtask_isdone };
  });
}

function setPrioButton(prio, i) {
  changeButtonColorAndImg(prio, i);
}

function changeButtonColorAndImg(prio, i) {
  tasks[i].priority = prio;
  let prioBtnContainer = document.getElementById('prioBtnContainer');
  prioBtnContainer.innerHTML = `${getPrioButton(i)}`;
}

function getPrioButton(i) {
  if (tasks[i].priority === 'high') {
    return getPrioButtonHighHTML(i);
  }
  if (tasks[i].priority === 'medium') {
    return getPrioButtonMediumHTML(i);
  }
  if (tasks[i].priority === 'low') {
    return getPrioButtonLowHTML(i);
  }
}

// #######################
//        DELETE TASK
// #######################

async function deleteTask(id) {
  let taskToDeleteIndex = tasks.findIndex((task) => task.id === id);
  tasks.splice(taskToDeleteIndex, 1);
  await deleteTaskData(id);
  loadData();
  editTaskPopUpBackground.classList.add('d-none');
  renderTasksIntoColumns();
}

async function deleteTaskData(id) {
  await fetch(`${BASE_URL}/tasks/${id}.json`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

/**
 * checks how many assigned user in this task
 * @param {task} i
 * @returns assigned user template
 */

function popUpRenderAssignedUser(i) {
  let assignedUserTemplate = '';
  if (
    tasks[i] &&
    tasks[i].assigned_user &&
    Array.isArray(tasks[i].assigned_user) &&
    tasks[i].assigned_user.length > 0
  ) {
    tasks[i].assigned_user.forEach((user) => {
      let assignedUserBackgroundColor = getColorAssignedUser(user.name);
      assignedUserTemplate += `  
               <div class="popup-user">
                   <div class="task-member-icon" style="background-color: ${assignedUserBackgroundColor}">${user.first_two_letters}</div>
                   ${user.name}
               </div>
           `;
    });
  } else {
    assignedUserTemplate = `<div class="popup-user">No assigned users</div>`;
  }

  return assignedUserTemplate;
}

/**
 * checks if subtask is done
 * if done, box is checked
 * @param {task} i
 * @returns subtasktemplate
 */

async function popUpCheckmarkIsDone(taskIndex, subtaskIndex) {
  tasks[taskIndex].subtasks[subtaskIndex].subtask_isdone
    ? (tasks[taskIndex].subtasks[subtaskIndex].subtask_isdone = false)
    : (tasks[taskIndex].subtasks[subtaskIndex].subtask_isdone = true);
  await updateTaskData(taskIndex);
  renderTaskPopUp(tasks[taskIndex].id);
  await loadData();
  await loadBoard();
}

function renderTaskPopUp(id) {
  editTaskPopUpBackground.innerHTML = '';
  tasks.forEach((task, index) => {
    if (task.id == id) {
      editTaskPopUpBackground.innerHTML = renderTaskPopUpHTML(index);
    }
  });
}

function popUpRenderSubTasks(i) {
  let subTasksTemplate = '';
  if (tasks[i] && tasks[i].subtasks && Array.isArray(tasks[i].subtasks) && tasks[i].subtasks.length > 0) {
    let subTaskDone;
    tasks[i].subtasks.forEach((subtask, index) => {
      subtask.subtask_isdone ? (subTaskDone = 'task-done-state-checked') : (subTaskDone = '');
      subTasksTemplate += `   
               <div class="popup-subtask-task" onclick="popUpCheckmarkIsDone(${i}, ${index})">
                   <div class="task-done-state ${subTaskDone}"></div>
                   <div class="popup-subtask-name">${subtask.subtask_name}</div>
               </div>    
           `;
    });
  } else {
    subTasksTemplate = `<div class="popup-subtask-task">No subtasks</div>`;
  }

  return subTasksTemplate;
}

// ############################
//       HELPER FUNCTIONS
// ############################

function closeAddTaskPopUp() {
  if (event.target === addTaskPopUpBackground || event.target === closePopUpBtn) {
    addTaskPopUpBackground.classList.add('d-none');
  }
  loadBoard();
}

function closeAddTaskPopUpCross() {
  addTaskPopUpBackground.classList.add('d-none');
  loadBoard();
}

function openEditTaskPopUp(event, id) {
  let stateDropdownIcon = document.getElementById('stateDropdownIcon' + id);
  let stateDropdown = document.getElementById('stateDropdown' + id);
  let stateDropdownChild = stateDropdown.children;
  let isChild = false;

  for (let i = 0; i < stateDropdownChild.length; i++) {
    if (event.target === stateDropdownChild[i]) {
      isChild = true;
      break;
    }
  }
  if (event.target === stateDropdownIcon || event.target === stateDropdown || isChild) {
    return;
  }
  editTaskPopUpBackground.classList.remove('d-none');
  renderTaskPopUp(id);
  // loadBoard();
}

function closeEditTaskPopUp() {
  if (event.target === editTaskPopUpBackground || event.target === closePopUpBtn) {
    editTaskPopUpBackground.classList.add('d-none');
    loadBoard();
  }
}

function closePopUpOnClick() {
  editTaskPopUpBackground.classList.add('d-none');
  loadBoard();
}

addTaskPopUpBackground.addEventListener('click', closeAddTaskPopUp);
editTaskPopUpBackground.addEventListener('click', closeEditTaskPopUp);
closePopUpBtn_2.addEventListener('click', closeAddTaskPopUp);

// ############################
//       DRAG & DROP
// ############################

let currentDraggedElement;
let taskPosition;

function startDragging(id) {
  currentDraggedElement = id;
}

function onHover(ev) {
  ev.preventDefault();
  ev.target.classList.add('hovered');
}

function leaveHover(ev) {
  ev.target.classList.remove('hovered');
}

async function moveTo(state) {
  let foundItem = tasks.find((item) => item.id === currentDraggedElement);
  taskPosition = tasks.findIndex((item) => item.id === currentDraggedElement);
  foundItem.state = state;

  await updateTaskData(taskPosition);
  renderTasksIntoColumns();
}

function allowDrop(ev) {
  ev.preventDefault();
}

// ############################
//      CHANGE STATE
// ############################

function toggleChangeStateDropdown(id) {
  let changeStateDropdown = document.getElementById('stateDropdown' + id);
  changeStateDropdown.classList.toggle('d-none');
}

async function setNewState(i, newState) {
  tasks[i].state = newState;
  await updateTaskData(i);
  setTimeout(() => {
    renderTasksIntoColumns();
  }, 1);
}

