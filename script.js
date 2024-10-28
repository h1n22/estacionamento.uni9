// Carregar veículos e histórico do localStorage
let vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
let history = JSON.parse(localStorage.getItem('history')) || [];

// Registrar veículo
document.getElementById('vehicleForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const vehicleName = document.getElementById('vehicleName').value;
    const plate = document.getElementById('plate').value;
    const hourlyRate = parseFloat(document.getElementById('hourlyRate').value);
    const entryTime = new Date();

    // Adiciona o veículo ao array
    vehicles.push({ vehicleName, plate, hourlyRate, entryTime });
    updateVehicleTable();
    document.getElementById('vehicleForm').reset();
    saveData();
});

// Atualiza a tabela de veículos estacionados
function updateVehicleTable() {
    const vehicleTableBody = document.querySelector('#vehicleTable tbody');
    vehicleTableBody.innerHTML = '';

    vehicles.forEach((vehicle, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${vehicle.vehicleName}</td>
            <td>${vehicle.plate}</td>
            <td>${vehicle.entryTime.toLocaleString()}</td>
            <td><button class="btn-exit" data-index="${index}">Registrar Saída</button></td>
        `;
        vehicleTableBody.appendChild(row);
    });

    // Adiciona evento de clique para os botões de registrar saída
    document.querySelectorAll('.btn-exit').forEach(button => {
        button.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            registerExit(index);
        });
    });
}

// Registra a saída de um veículo
function registerExit(index) {
    const exitTime = new Date();
    const vehicle = vehicles[index];
    const timeParked = (exitTime - vehicle.entryTime) / (1000 * 60 * 60); // tempo em horas
    const totalPrice = timeParked * vehicle.hourlyRate;

    // Adiciona o histórico de veículos
    history.push({ ...vehicle, timeParked, totalPrice });
    updateHistoryTable();

    // Remove o veículo da lista de veículos estacionados
    vehicles.splice(index, 1);
    updateVehicleTable();
    saveData();
}

// Atualiza a tabela de histórico de veículos
function updateHistoryTable() {
    const historyTableBody = document.querySelector('#historyTable tbody');
    historyTableBody.innerHTML = '';

    history.forEach((record) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.vehicleName}</td>
            <td>${record.plate}</td>
            <td>${record.timeParked.toFixed(2)} horas</td>
            <td>R$ ${record.totalPrice.toFixed(2)}</td>
        `;
        historyTableBody.appendChild(row);
    });
}

// Salvar dados no localStorage
function saveData() {
    localStorage.setItem('vehicles', JSON.stringify(vehicles));
    localStorage.setItem('history', JSON.stringify(history));
}

// Carregar dados ao iniciar a página
document.addEventListener('DOMContentLoaded', function() {
    updateVehicleTable();
    updateHistoryTable();
});
// Função para limpar o histórico
function clearHistory() {
    history = []; // Limpa o array de histórico
    localStorage.removeItem('history'); // Remove o histórico do localStorage
    updateHistoryTable(); // Atualiza a tabela para refletir as mudanças
}

// Adiciona o evento de clique para o botão de limpar histórico
document.getElementById('clearHistoryButton').addEventListener('click', function() {
    if (confirm('Tem certeza de que deseja limpar o histórico?')) {
        clearHistory();
    }
});

