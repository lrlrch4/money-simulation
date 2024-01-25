function inputSetup(){ 
    document.getElementById('numUsersValue').innerText = numUsers;

    document.getElementById('numUsersSlider').value = numUsers;

    document.getElementById('fpsValue').innerText = fps;

    document.getElementById('fpsSlider').value = fps;

    document.getElementById('startSimulation')
        .addEventListener('click', startSimulation);

    document.getElementById('pauseSimulation')
        .addEventListener('click', pauseSimulation);

    document.getElementById('resetSimulation')
        .addEventListener('click', resetSimulation);   
        
    document.getElementById('sortButton')
        .addEventListener('click', sortButton);

    document.getElementById('fitButton')
        .addEventListener('click', fitButton);
};

 
var selectedUser = '';
var selectedValue = '';
function circleClicked() {
    selectedUser = +this.id.slice(1);
    selectedValue = moneyDistribution[+this.id.slice(1)];

    svgSimulation.selectAll('circle').attr('stroke', 'white');

    for(let i = 0; i < numUsers; i++){
        svgChar.select(`#bar${i}`).attr('stroke', amountColor); 
    }

    svgSimulation.select(`#c${selectedUser}`).attr('stroke', 'yellow');
    svgChar.select(`#bar${selectedUser}`).attr('stroke', 'yellow'); 
    
    svgChar.select(`#text${2}`)
        .text(`selected user = c${selectedUser}`)
        .attr('fill', 'yellow');
    
    svgChar.select(`#text${3}`)
        .text(`selected value = ${selectedValue}`)
        .attr('fill', 'yellow');
}; 

function updateNumUsers(newNumUsers) {            
    document.getElementById('numUsersValue').innerText = newNumUsers;
    numUsers = newNumUsers;
    pauseSimulation();
    resetSimulation();
    svgSimulation.selectAll('line').remove();
    isSorted = false; 
    drawFrame();
}

function updateFps(newFps) {
    document.getElementById('fpsValue').innerText = newFps;
    fps = newFps;
}
