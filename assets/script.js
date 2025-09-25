const renderTasksProgressData = (tasks) => {
    let tasksProgress;
    const teskProgressDom = document.getElementById('tasks-progress');

    if (teskProgressDom) tasksProgress = teskProgressDom;
    else {
        const newTasksProgressDom = document.createElement('p');
        newTasksProgressDom.id = 'tasks-progress';
        document.getElementById('todo-list-section').appendChild(newTasksProgressDom);
        tasksProgress = newTasksProgressDom;
    }

    const doneTasks = tasks.filter(({ checked }) => checked).length;
    const totalTasks = tasks.length;
    // tasksProgress.innerHTML = `${doneTasks}/${totalTasks} concluídas`;
}

const getTasksLocalStorage = () => {
    const localTasks = JSON.parse(window.localStorage.getItem('tasks'));

    return localTasks ? localTasks : [];
}

const setTasksLocalStorage = (tasks) => {
    window.localStorage.setItem('tasks', JSON.stringify(tasks));
}

const removeTask = (taskId) => {
    const tasks = getTasksLocalStorage();
    const updatedTasks = tasks.filter(({ id}) => parseInt(id) !== parseInt(taskId));

    setTasksLocalStorage(updatedTasks);
    renderTasksProgressData(updatedTasks);

    document
        .getElementById('todo-list')
        .removeChild(document.getElementById(taskId));
}

const removeDoneTasks = () => {
    const tasks = getTasksLocalStorage();
    const tasksToRemove = tasks
        .filter(({ checked }) => checked)
        .map(({ id }) => id);

    const updatedTasks = tasks.filter(({ checked }) => !checked);
    setTasksLocalStorage(updatedTasks);
    renderTasksProgressData(updatedTasks);

    tasksToRemove.forEach((taskToRemove) => {
        document
            .getElementById('todo-list')
            .removeChild(document.getElementById(taskToRemove));
    });

}

const createTaskListItem = (task, checkbox) => {
    const list = document.getElementById('todo-list');
    const toDo = document.createElement('li');
    const removeButton = document.createElement('button');


    removeButton.innerText = 'X';
    removeButton.areaLabel = 'Remover tarefa';
    removeButton.onclick = () => removeTask(task.id);

    toDo.id = task.id;
    toDo.appendChild(checkbox);
    toDo.appendChild(removeButton);

    list.appendChild(toDo);

    return toDo;
}

const onCheckboxClick = (event) => {
    const [, idStr] = event.target.id.split('-');
    const id = Number(idStr);
    const tasks = getTasksLocalStorage();
    const updatedTasks = tasks.map((task) => {
        return parseInt(task.id) === parseInt(id)
            ? { ...task, checked: event.target.checked }
            : task;
    });

    setTasksLocalStorage(updatedTasks);
    renderTasksProgressData(updatedTasks);
}

const getCheckboxInput = ({id, description, checked}) => {
    const checkbox = document.createElement('input');
    const label = document.createElement('label');
    const wrapper = document.createElement('div');
    const checkboxId = `checkbox-${id}`;

    checkbox.type = 'checkbox';
    checkbox.id = checkboxId;
    checkbox.checked = checked || false;
    checkbox.addEventListener('change', onCheckboxClick);

    label.textContent = description;
    label.htmlFor = checkboxId;
    wrapper.className = 'checkbox-label-container';
    wrapper.appendChild(checkbox);
    wrapper.appendChild(label);

    return wrapper;
}

const getNewTaskId = () => {
    const tasks = getTasksLocalStorage();
    const lastTask = tasks[tasks.length -1]?.id;
    
    return lastTask ? lastTask + 1 : 1;
}

const getNewTaskData = (event) => {
    const description = event.target.elements.description.value;
    const id = getNewTaskId();

    return { description, id };
}

const getCreatedTaskDataInfo = (event) => new Promise((resolve) => { // simulando uma requisição assíncrona
    setTimeout(() => {
        resolve(getNewTaskData(event));
    }, 500);
});

const createTask = async (event) => {
    event.preventDefault();

    document.getElementById('save-task').disble = true;
    const newTaskData = await getCreatedTaskDataInfo(event);

    const checkbox = getCheckboxInput(newTaskData);
    createTaskListItem(newTaskData, checkbox);

    const tasks = getTasksLocalStorage();
    const updateTasks = [
        ...tasks,
        { id: newTaskData.id, description: newTaskData.description, checked: false }
    ];
    setTasksLocalStorage(updateTasks);
    renderTasksProgressData(updateTasks);

    document.getElementById('description').value = '';
    document.getElementById('save-task').disble = false;
}

window.onload = () => {
    const form = document.getElementById('create-todo-form');
    form.addEventListener('submit', createTask);

    const tasks = getTasksLocalStorage();
    tasks.forEach((task) => {
        const checkbox = getCheckboxInput(task);
        createTaskListItem(task, checkbox);
    })

    renderTasksProgressData(tasks);
}