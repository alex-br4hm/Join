async function initPageSummary() {
    tasksInBoardCounter();
    getTimeOfDay();
    await countHighPriorityTasks();
    await getNextDueDate();
    await includeHTML();
}


let animationPlayed = false;
let toDoCounter = 0;
let inProgressCounter = 0;
let awaitFeedbackCounter = 0;
let doneCounter = 0;

async function tasksInBoardCounter() {
    const BASE_URL = 'https://joinalex-1e443-default-rtdb.europe-west1.firebasedatabase.app/';
    let response = await fetch(BASE_URL + '.json');
    let responseAsJson = await response.json();
    let tasks = Object.values(responseAsJson.tasks);

    tasks.forEach((task) => {
        switch (task.state) {
            case 'todo':
                toDoCounter++;
                break;
            case 'inprogress':
                inProgressCounter++;
                break;
            case 'awaitfeedback':
                awaitFeedbackCounter++;
                break;
            case 'done':
                doneCounter++;
                break;
            default:
                console.error(`Unknown state: ${task.state}`);
        }
    });

    let totalTasks = tasks.length;
    let totalTasksElement = document.getElementById('totalTasks');
    totalTasksElement.innerHTML = totalTasks;

    let taskToDoElement = document.getElementById('toDoTasks');
    taskToDoElement.innerHTML = toDoCounter;

    let inProgressElement = document.getElementById('progressTasks');
    inProgressElement.innerHTML = inProgressCounter;

    let feedbackTasksElement = document.getElementById('feedbackTasks');
    feedbackTasksElement.innerHTML = awaitFeedbackCounter;

    let doneTasksElement = document.getElementById('doneTasks');
    doneTasksElement.innerHTML = doneCounter;
}

function getTimeOfDay() {
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 5 && hour < 12) {
        return 'Good morning,';
    } else if (hour >= 12 && hour < 17) {
        return 'Good afternoon,';
    } else {
        return 'Good evening,';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const greetingText = document.getElementById('greetingText');
    const logInWelcomeGreetingText = document.getElementById('logInWelcomeGreetingText');
    greetingText.textContent = getTimeOfDay();
    logInWelcomeGreetingText.textContent = getTimeOfDay();
});

async function getNextDueDate() {
    let nextDueDate = null;
    let nextTask = null;

    tasks.forEach((task) => {
        const [day, month, year] = task.due_date.split('/').map(Number);
        const dueDate = new Date(year, month - 1, day);

        if (!nextDueDate || dueDate < nextDueDate) {
            nextDueDate = dueDate;
            nextTask = task;
        }
    });

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = nextDueDate.toLocaleDateString('en-US', options);
    document.getElementById('deadlineDate').innerHTML = formattedDate;
}

async function countHighPriorityTasks() {
    const BASE_URL = 'https://joinalex-1e443-default-rtdb.europe-west1.firebasedatabase.app/';
    const response = await fetch(BASE_URL + '.json');
    const responseAsJson = await response.json();

    const highPriorityTasks = Object.values(responseAsJson.tasks).filter(
        (task) => task.priority === 'high' || task.priority === 'urgent'
    );

    const priorityHighTasksElement = document.getElementById('priorityHighTasks');
    priorityHighTasksElement.innerHTML = `${highPriorityTasks.length}`;
}

function toBoard() {
    window.location.href = './board.html';
}

document.addEventListener('DOMContentLoaded', function () {
    let greetingElement = document.getElementById('userGreetingsLogIn');
    let greetingElementBigView = document.getElementById('userGreetingsLogInBigView');
    let username = sessionStorage.getItem('name');

    if (username) {
        greetingElement.innerText = username;
        greetingElementBigView.innerText = username;
    } else {
        greetingElement.innerText = 'Guest';
        greetingElementBigView.innerText = 'Guest';
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const loginAnimation = document.getElementById('loginAnimation');
    loginAnimation.classList.add('fadeOutAnimation');
    loginAnimation.classList.add('fadeOutAnimation.finished');
    loginAnimation.addEventListener(
        'animationend',
        function () {
           
            loginAnimation.style.display = 'none';
        },
        { once: true }
    ); 
});

