// Tableau pour le stockage des tâches
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Définition de la date et du temps où la tâche a été ajoutée
function displayDateTime() {
    const actualDate = new Date();
    const myDate = actualDate.toLocaleString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    const myTime = actualDate.toLocaleString('fr-FR', {
        hour: 'numeric',
        minute: 'numeric'
    });

    return `Le ${myDate} à ${myTime}`;
};

// Fonction pour effecer les champs renseignés dans l'intitulé
function resetText() {
    const input = document.getElementById("task");
    input.value = '';
    return input.value;
};

// Responsive et media queries
const output = document.getElementById("task-output");
output.style.display = "grid";
output.style.placeItems = "start center";
output.style.gap = "1.75rem";
const minLaptopResponsive = window.matchMedia("max-width: 1025px");
const tabletResponsive = window.matchMedia("(max-width: 900px)");
const phoneResponsive = window.matchMedia("(max-width: 684px)");

function handleMediaChange(a, b, c) {
    if (c.matches) {
        output.style.gridTemplateColumns = "repeat(auto-fit, minmax(260px, 1fr))";
        output.style.justifyContent = "center";
    } else if (b.matches) {
        output.style.gridTemplateColumns = "repeat(2, minmax(290px, 1fr))";
    } else {
        output.style.gridTemplateColumns = "repeat(3, 1fr)";
    }
};

handleMediaChange(minLaptopResponsive, tabletResponsive, phoneResponsive);
minLaptopResponsive.addEventListener('change', () => handleMediaChange(minLaptopResponsive, tabletResponsive, phoneResponsive));
tabletResponsive.addEventListener('change', () => handleMediaChange(minLaptopResponsive, tabletResponsive, phoneResponsive));
phoneResponsive.addEventListener('change', () => handleMediaChange(minLaptopResponsive, tabletResponsive, phoneResponsive));

// Fonction pour l'affichage de chaque tâche sous forme de liste
function displayTasks() {
    const taskList = document.getElementById('task-output');
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        // Création d'une div pour la tâche
        const taskDiv = document.createElement('div');
        taskDiv.setAttribute('id', `task-${task.id}`);
        // Ajout de styles pour la div
        taskDiv.style.display = "grid";
        taskDiv.style.gridTemplateRows = "subgrid"
        taskDiv.style.padding = ".9em";
        taskDiv.style.backgroundColor = "white";
        taskDiv.style.border = "2px dashed rgb(2, 117, 125)";
        taskDiv.style.borderRadius = "6px";
        taskDiv.style.boxShadow = "9px 9px rgb(245, 165, 60)";
        taskDiv.style.width = "clamp(260px, 27.5vw, 325px)";
        taskDiv.style.gridRow = "span 2";

        // Création d'une section qui va contenir l'intitulé et la date de création de la tâche
        const taskInfo = document.createElement('section');
        taskInfo.classList.add('task-info');
        // Ajout de styles pour la section
        taskInfo.style.display = "flex";
        taskInfo.style.flexFlow = "column wrap"
        taskInfo.style.gap = ".5rem";
        taskInfo.style.wordBreak = "break-word";
        taskInfo.style.overflowWrap = "break-word";
        taskInfo.style.whiteSpace = "normal";

        // Création des éléments de la tâche
        const taskName = document.createElement('p'); // Nom de la tâche
        taskName.textContent = task.name;
        taskName.contentEditable = false;
        // Stylisation
        taskName.style.fontSize = 'clamp(12px, 1.35vw, 16px)';
        taskName.style.textTransform = "uppercase";
        taskName.style.color = 'chocolate';
        taskName.style.fontWeight = 'bold';

        const taskPublication = document.createElement('p'); // Date de publication de la tâche
        taskPublication.textContent = task.date;
        // Stylisation
        taskPublication.style.fontSize = 'clamp(8px, 1vw, 12px)';

        // Ajout du nom et de la date de publication de la tâche à la section convenue
        taskInfo.appendChild(taskName);
        taskInfo.appendChild(taskPublication);

        // Création d'une div pour les prochains boutons d'option de la tâche
        const buttonDiv = document.createElement('div');
        buttonDiv.classList.add('options-btn');

        // Création du bouton "Supprimer"
        const deleteButton = document.createElement('button');
        deleteButton.textContent = "Supprimer";
        deleteButton.onclick = () => deleteTask(index);
        deleteButton.style.padding = ".25rem";
        deleteButton.style.fontSize = 'clamp(8px, 1vw, 12px)';

        // Création du bouton "Modifier"
        const editButton = document.createElement('button');
        editButton.textContent = "Modifier";
        editButton.onclick = () => editTask(index, taskName, buttonDiv);
        editButton.style.padding = ".25rem";
        editButton.style.fontSize = 'clamp(8px, 1vw, 12px)';

        // Ajout des boutons à la div convenue
        buttonDiv.appendChild(editButton);
        buttonDiv.appendChild(deleteButton);

        // Intégration de tous ces éléments à la div
        taskDiv.appendChild(taskInfo);
        taskDiv.appendChild(buttonDiv);

        // Intégration de la div à la liste de tâche
        taskList.appendChild(taskDiv);
    });
};

// Fonction pour l'ajout d'une nouvelle tâche
function addTasks() {
    const taskInput = document.getElementById('task');
    const task = taskInput.value.trim();

    if (task !== '') {
        const newTask = {
            name: task,
            date: displayDateTime(),
            id: new Date().toLocaleString(),
            creation: Date().toLocaleString(),
        };
        tasks.push(newTask);
        taskInput.value = '';
        saveTasks();
        displayTasks();
    } else {
        alert("Vous devez au moins écrire quelque chose...");
    };
};

// Fonction pour supprimer une tâche
function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    displayTasks();
};

// Fonction pour editer une tâche enregistrée
function editTask(index, taskName, buttonDiv) {
    taskName.contentEditable = true;
    taskName.focus();

    const existingButtons = buttonDiv.querySelectorAll('.edit-buttons');
    if (existingButtons.length > 0) {
        return;
    };

    // Création du bouton "Sauvegarder"
    const saveButton = document.createElement('button');
    saveButton.textContent = "Sauvegarder";
    saveButton.onclick = () => saveEditedTask(index, taskName, saveButton, buttonDiv);
    saveButton.style.padding = ".25rem";
    saveButton.style.fontSize = 'clamp(8px, 1vw, 12px)';
    saveButton.classList.add('edit-buttons');

    // Ajout d'une fonction pour éviter la saisie d'une tâche comportant plus de 40 caractères
    taskName.addEventListener('keydown', function (e) {
        const isControlKey = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'].includes(e.key);

        if (!isControlKey && taskName.textContent.length > 30) {
            e.preventDefault();
        };
    });

    // Création du bouton "Annuler"
    const cancelButton = document.createElement('button');
    cancelButton.textContent = "Annuler";
    cancelButton.onclick = () => cancelEdit(index, taskName, saveButton, cancelButton, buttonDiv);
    cancelButton.style.padding = ".25rem";
    cancelButton.style.fontSize = 'clamp(8px, 1vw, 12px)';
    cancelButton.classList.add('edit-buttons');

    buttonDiv.style.justifyContent = "space-between";

    // Intégration de ces boutons à la tâche
    buttonDiv.appendChild(saveButton);
    buttonDiv.appendChild(cancelButton);
};

// Fonction pour sauvegarder les modifications de la tâche
function saveEditedTask(index, taskName, saveButton, buttonDiv) {
    const updatedText = taskName.textContent.trim();
    if (updatedText === tasks[index].name) {
        alert("Aucune modification n'a été effectuée. Le nom de la tâche reste inchangé.");
        taskName.contentEditable = false;
        saveButton.remove();
        buttonDiv.querySelector('.edit-buttons').remove();
        buttonDiv.style.justifyContent = "normal";
        return;
    }

    tasks[index].name = taskName.textContent;
    tasks[index].date = displayDateTime() + ' (modifiée)';
    saveTasks();
    taskName.contentEditable = false;
    saveButton.remove();
    buttonDiv.querySelector('button').remove();
    buttonDiv.style.justifyContent = "normal";
    displayTasks();
}

// Fonction pour annuler les modifications de la tâche
function cancelEdit(index, taskName, saveButton, cancelButton, buttonDiv) {
    taskName.contentEditable = false;
    saveButton.remove();
    cancelButton.remove();
    buttonDiv.style.justifyContent = "normal";
    taskName.textContent = tasks[index].name;
}

// Fonction pour sauvegarder les tâches dans le LocalStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

displayTasks();