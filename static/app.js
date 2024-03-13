// Function to fetch available entities from the backend
async function fetchAvailableEntities() {
    const response = await fetch('/available_entities');
    const data = await response.json();
    return data.entities;
}

// Function to display available entities in the HTML
async function displayAvailableEntities() {
    const availableEntities = await fetchAvailableEntities();
    const availableEntitiesList = document.getElementById('available-entities');
    availableEntitiesList.innerHTML = '';
    console.table(availableEntities);
    availableEntities.forEach(entity => {
        // const listItem = document.createElement('li');
        // listItem.textContent = `${entity.type} - Config: ${JSON.stringify(entity.config)}`;
        const entityElement = document.createElement('div');
        entityElement.classList.add("entity-option"); // Set the entity class
        entityElement.id = `entity-option-${entity.type.replace("_", "-")}`; // Set the entity ID
        entityElement.textContent = entity.type;
        availableEntitiesList.appendChild(entityElement);
        // availableEntitiesList.appendChild(listItem);
    });
}

// Function to add an entity
async function addEntity(entityType, entityConfig) {
    const response = await fetch('/add_entity', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            type: entityType,
            config: entityConfig 
        })
    });
    const data = await response.json();
    console.log(data.message);
    updateCoffeeStationEntities();
}

// Function to fetch coffee station entities from the backend
async function fetchCoffeeStationEntities() {
    const response = await fetch('/entities');
    const data = await response.json();
    return data;
}

// Function to display coffee station entities in the HTML
// function displayCoffeeStationEntities(entities) {
//     const coffeeStationEntitiesList = document.getElementById('coffee-station-entities');
//     coffeeStationEntitiesList.innerHTML = '';

//     entities.forEach(entity => {
//         const listItem = document.createElement('li');
//         listItem.textContent = `${entity.id} (${entity.type})`;

//         const methodButtons = document.createElement('div');
//         entity.methods.forEach(method => {
//             const button = document.createElement('button');
//             button.textContent = method;
//             button.addEventListener('click', () => callEntityMethod(entity.id, method));
//             methodButtons.appendChild(button);
//         });

//         listItem.appendChild(methodButtons);
//         coffeeStationEntitiesList.appendChild(listItem);
//     });
// }

// Function to display coffee station entities in the HTML
// function displayCoffeeStationEntities(entities) {
//     const coffeeStationEntitiesList = document.getElementById('coffee-station-entities');
//     coffeeStationEntitiesList.innerHTML = '';

//     console.log(entities);
//     console.log("H");

//     entities.forEach(entity => {
//         const listItem = document.createElement('div');
//         listItem.classList.add('entity-card');
//         listItem.textContent = `${entity.id} (${entity.type})`;

//         const methodContainer = document.createElement('div');
//         entity.methods.forEach(method => {
//             const methodDiv = document.createElement('div');
//             methodDiv.classList.add('method');

//             const methodName = document.createElement('span');
//             methodName.textContent = method.name;
//             methodDiv.appendChild(methodName);

//             const toggleButton = document.createElement('button');
//             toggleButton.textContent = 'Show Arguments';
//             toggleButton.addEventListener('click', () => {
//                 argumentsDiv.style.display = argumentsDiv.style.display === 'none' ? 'block' : 'none';
//             });
//             methodDiv.appendChild(toggleButton);

//             const argumentsDiv = document.createElement('div');
//             argumentsDiv.classList.add('arguments');
//             argumentsDiv.style.display = 'none';

//             method.parameters.forEach(param => {
//                 const paramDiv = document.createElement('div');
//                 paramDiv.textContent = `${param.name} (${param.required ? 'Required' : 'Optional'})`;
//                 if (!param.required && param.default !== undefined) {
//                     paramDiv.textContent += ` - Default: ${param.default}`;
//                 }
//                 argumentsDiv.appendChild(paramDiv);
//             });

//             const executeButton = document.createElement('button');
//             executeButton.textContent = 'Execute';
//             executeButton.addEventListener('click', () => {
//                 const config = {};
//                 method.parameters.forEach(param => {
//                     const value = prompt(`Enter value for ${param.name}:`);
//                     if (value !== null) {
//                         config[param.name] = value;
//                     }
//                 });
//                 callEntityMethod(entity.id, method.name, config);
//             });
//             argumentsDiv.appendChild(executeButton);

//             methodDiv.appendChild(argumentsDiv);
//             methodContainer.appendChild(methodDiv);
//         });

//         listItem.appendChild(methodContainer);
//         coffeeStationEntitiesList.appendChild(listItem);
//     });
// }





function displayCoffeeStationEntities(entities) {
    const coffeeStationEntitiesList = document.getElementById('coffee-station-entities');
    coffeeStationEntitiesList.innerHTML = '';

    entities.forEach(entity => {
        const entityCard = document.createElement('div');
        entityCard.classList.add('entity-card');

        const entityHeader = document.createElement('div');
        entityHeader.classList.add('entity-header');
        entityHeader.textContent = `${entity.id} (${entity.type})`;
        entityCard.appendChild(entityHeader);

        const methodGrid = document.createElement('div');
        methodGrid.classList.add('method-grid');

        entity.methods.forEach(method => {
            const methodButton = document.createElement('button');
            methodButton.classList.add('method-button');
            methodButton.textContent = method.name;
            methodButton.addEventListener('click', () => {
                displayMethodArguments(method, entity.id);
            });
            methodGrid.appendChild(methodButton);
        });

        entityCard.appendChild(methodGrid);
        coffeeStationEntitiesList.appendChild(entityCard);
    });
}

function displayMethodArguments(method, entityId) {
    const argumentsContainer = document.getElementById('arguments-container');
    argumentsContainer.innerHTML = '';

    const methodName = document.createElement('h3');
    methodName.textContent = method.name;
    argumentsContainer.appendChild(methodName);

    const argumentForm = document.createElement('form');

    method.parameters.forEach(param => {
        const paramDiv = document.createElement('div');
        paramDiv.classList.add('parameter');

        const paramLabel = document.createElement('label');
        paramLabel.textContent = `${param.name}:`;
        paramDiv.appendChild(paramLabel);

        const paramInput = document.createElement('input');
        paramInput.type = 'text';
        paramInput.name = param.name;
        paramInput.required = param.required;
        if (param.default !== undefined) {
            paramInput.placeholder = `Default: ${param.default}`;
        }
        paramDiv.appendChild(paramInput);

        argumentForm.appendChild(paramDiv);
    });

    const executeButton = document.createElement('button');
    executeButton.textContent = 'Execute';
    executeButton.type = 'submit';
    argumentForm.appendChild(executeButton);

    argumentForm.addEventListener('submit', event => {
        event.preventDefault();
        const config = {};
        const formData = new FormData(argumentForm);
        for (const [name, value] of formData.entries()) {
            config[name] = value;
        }
        callEntityMethod(entityId, method.name, config);
    });

    argumentsContainer.appendChild(argumentForm);
}

// Function to call an entity method
async function callEntityMethod(entityId, method, config = null) {
    const response = await fetch(`/entity/${entityId}/${method}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
    });
    const data = await response.json();
    console.log(data.message || data.error);
    updateCoffeeStationReport();
}

// Function to fetch coffee station report from the backend
async function fetchCoffeeStationReport() {
    const response = await fetch('/report');
    const data = await response.json();
    return data;
}

// Function to display coffee station report in the HTML
function displayCoffeeStationReport(report) {
    const coffeeStationReportElement = document.getElementById('coffee-station-report');
    coffeeStationReportElement.textContent = JSON.stringify(report, null, 2);
}

// Function to create a chart using Chart.js library
function createChart(report) {
    const ctx = document.getElementById('coffee-station-chart').getContext('2d');

    const labels = Object.keys(report);
    const data = Object.values(report).map(entity => entity.hours_total || 0);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Total Hours of Operation',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Function to update coffee station entities
async function updateCoffeeStationEntities() {
    console.log("HERE");
    const coffeeStationEntities = await fetchCoffeeStationEntities();
    displayCoffeeStationEntities(coffeeStationEntities);
}

// Function to update coffee station report
async function updateCoffeeStationReport() {
    const coffeeStationReport = await fetchCoffeeStationReport();
    displayCoffeeStationReport(coffeeStationReport);
    // createChart(coffeeStationReport);
}



// Function to handle entity selection
function handleEntitySelection(event) {
    const clickedElement = event.target;
    if (clickedElement.classList.contains('entity-option')) {
        console.log(clickedElement.textContent);
      const entityType = clickedElement.textContent;
      addEntity(entityType, {});
    }
  }
  
  // Attach event listener to the parent element
  const availableEntitiesList = document.getElementById('available-entities');
  availableEntitiesList.addEventListener('click', handleEntitySelection);


// // Event listener for add entity button
// document.getElementById('add-entity-btn').addEventListener('click', async () => {
//     const availableEntities = await fetchAvailableEntities();
//     // const entityType = prompt('Enter entity type:', availableEntities[0].type);
//     const entityConfig = JSON.parse(prompt('Enter entity config:', JSON.stringify(availableEntities[0].config)));
//     entityConfig = {};
//     addEntity(entityType, entityConfig);
// });

// Event listener for refresh report button
document.getElementById('refresh-report-btn').addEventListener('click', updateCoffeeStationReport);

// Initial update of coffee station entities and report
updateCoffeeStationEntities();
updateCoffeeStationReport();
displayAvailableEntities();


console.log("Start");