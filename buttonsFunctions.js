var isSimulating = false;  
var startButtonCount = 0;

function updateFrame() {
    if(isSimulating){
        setTimeout(
            function(){                        
                drawFrame();
                simulate();
                updateFrame();
            }, 
            1000/fps   
        );
    };
};

//Buttons functions
function startSimulation() {
    startButtonCount += 1;
    isSimulating = true;

    if(startButtonCount == 1){
        updateFrame();
    };

    isSorted = false;
    console.log('start');
};

function pauseSimulation() {
    startButtonCount = 0;
    isSimulating = false; 
    console.log('pause');
};

function resetSimulation() {            
    startButtonCount = 0;
    isSimulating = false;
    frame = 0;
    svgSimulation.selectAll('line').remove();

    moneyDistribution = Array.from({ length: numUsers }, (_, index) => initialValue);

    sortedDistribution = [...moneyDistribution];   
    sortedDistribution.sort(function(a,b) {return b-a;});        
    
    drawFrame();  
    console.log('reset');         
};     

var isSorted = false;
function sortButton() {
    isSorted = !isSorted;
    drawFrame();
};

var isLog = false; 
function logButton() {
    isLog = !isLog;
    drawFrame();
}

var isFit = false;
function fitButton() {
    isFit = !isFit; 
    drawFrame();
}
        
