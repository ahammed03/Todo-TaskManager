const addBtnElement = document.getElementById('addBtn');
const tasksElement = document.getElementById('tasks');
const completedElement = document.getElementById('completedTasks');

// Function for Rendering tasks
const loadTasks = () => {
    let tasksArray = loadTasksFromLocalStorage();
    const completedTasksLength = tasksArray.filter(task => task.isCompleted === true).length;
    const tasksLength = tasksArray.length - completedTasksLength;
    tasksElement.innerHTML = `<p class="text-slate-800 font-bold">Tasks - ${tasksLength}</p>`;
    completedElement.innerHTML = (completedTasksLength > 0)
        ? `<div class="flex justify-between">
                <h2 class="text-slate-800 font-bold">Completed ${completedTasksLength}</h2> 
                <button class="transition-all hover:scale-125" type="button" onclick="deleteCompletedTasks()">🗑️</button>
           </div>`
        : `<p class="text-gray-400">You Completed 0 tasks</p>`;
    try {
        let count = 0;
        tasksArray.map((element, index) => {
            if (element.isCompleted) {
                completedElement.innerHTML += `
                <p class="text-slate-500">${element.name}</p>`
            } else {
                tasksElement.innerHTML +=
                    `<div class="taskBox flex py-0.5 justify-between border-b" id="${index}">
                <p class="task text-slate-600 w-3/5 overflow-x-auto">${element.name}</p>
                <button type="button" class="transition-all hover:scale-125 text-green-500" onclick="TaskCompleted(event,true)">
                &#x2714;
                </button>
                <button type="button" class="transition-all hover:scale-125" onclick="EditTask(event)" >
                ✏️
                </button>
                <button type="button" class="transition-all hover:scale-125" onclick="deleteTask(event)">
                🗑️
                </button>
                </div>`
            }
        })

    } catch (error) {
        alert(error);

    }

}

// Used to render tasks while page loading
loadTasks();

// Tasks storing in Local
function saveTasksToLocalStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// saveTasksToLocalStorage([])
function loadTasksFromLocalStorage() {
    const storedTasks = localStorage.getItem('tasks');
    return storedTasks ? JSON.parse(storedTasks) : [];
}

// function to delete task {single task}
function deleteTask(event) {
    const tasks = loadTasksFromLocalStorage();
    const taskIndex = event.target.parentNode.id;
    try {
        if (taskIndex !== -1 && taskIndex < tasks.length) {
            tasks.splice(taskIndex, 1)
            saveTasksToLocalStorage(tasks);
            loadTasks();
        }
    } catch (error) {
        console.log(error)

    }
}

// Fucntion to delete the completed tasks section
function deleteCompletedTasks() {
    let tasks = loadTasksFromLocalStorage();
    tasks = tasks.filter(element => !element.isCompleted);
    saveTasksToLocalStorage(tasks);
    loadTasks();

}

// Function for to change task from pending to completed
function TaskCompleted(event) {
    const taskId = event.target.parentNode;
    const taskIndex = taskId.id;
    const tasks = loadTasksFromLocalStorage();
    if (taskIndex !== -1) {
        tasks[taskIndex].isCompleted = true;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        loadTasks();
    }

}
// used to edit task
function EditTask(event) {
    try {
        const editInputEle = `<input class="px-1 w-3/5" type="text" placeholder="Enter" id="editTaskInput">
                              <button class="bg-green-500 px-1 text-white rounded-sm" type="button" onclick="EditTaskSubmit(event)">Save</button> 
                              <button class="rounded-sm border-2 px-1 text-red-500" type="button"  onclick="loadTasks()">Close</button>`
        event.target.parentNode.innerHTML = editInputEle;

    } catch (error) {
        console.log(error)

    }

}

// Works after click save btn after changing task name
function EditTaskSubmit(event) {
    const newTaskName = document.getElementById('editTaskInput').value;
    if (newTaskName.length > 0) {
        const tasks = loadTasksFromLocalStorage();
        tasks[event.target.parentNode.id].name = newTaskName;
        saveTasksToLocalStorage(tasks);
        loadTasks();
    } else {
        alert("Invalid New Name")
    }

}






// used to create new tasks
const createTask = () => {
    const taskInput = document.getElementById('newTask');
    const taskName = taskInput.value;
    if (taskName.length > 0) {
        try {
            let storedTasks = localStorage.getItem('tasks')
            storedTasks = storedTasks ? JSON.parse(storedTasks) : [];
            storedTasks.push({ 'name': taskName, 'isCompleted': false })
            saveTasksToLocalStorage(storedTasks);

        } catch (error) {
            console.log(error, 'Occured at storing locally')

        }
        loadTasks();
        taskInput.value = "";
    } else {
        alert("Invalid Task")
    }


}


