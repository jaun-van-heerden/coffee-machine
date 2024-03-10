// Function to fetch available entities from the backend
async function fetchAvailableEntities() {
    const response = await fetch('/available_entities');
    const data = await response.json();
    return data.entities;
}

// Function to display available entities in the HTML
function displayAvailableEntities(entities) {
    const availableEntitiesList = document.getElementById('available-entities');
    availableEntitiesList.innerHTML = '';

    entities.forEach(entity => {
        const listItem = document.createElement('li');
        listItem.textContent = `${entity.type} - Config: ${JSON.stringify(entity.config)}`;
        availableEntitiesList.appendChild(listItem);
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
function displayCoffeeStationEntities(entities) {
    const coffeeStationEntitiesList = document.getElementById('coffee-station-entities');
    coffeeStationEntitiesList.innerHTML = '';

    entities.forEach(entity => {
        const listItem = document.createElement('li');
        listItem.textContent = `${entity.id} (${entity.type})`;

        const methodButtons = document.createElement('div');
        entity.methods.forEach(method => {
            const button = document.createElement('button');
            button.textContent = method;
            button.addEventListener('click', () => callEntityMethod(entity.id, method));
            methodButtons.appendChild(button);
        });

        listItem.appendChild(methodButtons);
        coffeeStationEntitiesList.appendChild(listItem);
    });
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
    const coffeeStationEntities = await fetchCoffeeStationEntities();
    displayCoffeeStationEntities(coffeeStationEntities);
}

// Function to update coffee station report
async function updateCoffeeStationReport() {
    const coffeeStationReport = await fetchCoffeeStationReport();
    displayCoffeeStationReport(coffeeStationReport);
    createChart(coffeeStationReport);
}

// Event listener for add entity button
document.getElementById('add-entity-btn').addEventListener('click', async () => {
    const availableEntities = await fetchAvailableEntities();
    const entityType = prompt('Enter entity type:', availableEntities[0].type);
    const entityConfig = JSON.parse(prompt('Enter entity config:', JSON.stringify(availableEntities[0].config)));
    addEntity(entityType, entityConfig);
});

// Event listener for refresh report button
document.getElementById('refresh-report-btn').addEventListener('click', updateCoffeeStationReport);

// Initial update of coffee station entities and report
updateCoffeeStationEntities();
updateCoffeeStationReport();