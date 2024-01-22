function connectAll() {

    const pairs = createPairsList();  

    for(let i = 0; i < numUsers/2; i++){
        Connect(pairs[i][0], pairs[i][1])
    } 

    function createPairsList() {
        var numbers =  Array.from({length: numUsers}, (_, i) => i);
        var pairsList = [];
    
        while (numbers.length > 0) {
        var randomIndex = Math.floor(Math.random() * numbers.length);
        var number1 = numbers.splice(randomIndex, 1)[0];
    
        randomIndex = Math.floor(Math.random() * numbers.length);
        var number2 = numbers.splice(randomIndex, 1)[0];
    
        var pair = [number1, number2];
        pairsList.push(pair);
        }
    
        return pairsList;
    }   

    //Connect two dots to represent de exchange
    function Connect(a,b){
        // Obtener las posiciones de los círculos
        const circlea = d3.select(`#c${a}`);
        const circleb = d3.select(`#c${b}`);

        const xa = parseFloat(circlea.attr("cx"));
        const ya = parseFloat(circlea.attr("cy"));
        const xb = parseFloat(circleb.attr("cx"));
        const yb = parseFloat(circleb.attr("cy"));


        var r =  (Math.random() < 0.5) ? -1 : 1;

        if(moneyDistribution[a] == 0 || moneyDistribution[b] == 0){
            r = 0;
        };       

        moneyDistribution[a] +=  r;
        moneyDistribution[b] -=  r;
        
        const winnerColor = '#00D26A';
        const loserColor = '#F8312F';

        if(r == 1){
            svgSimulation.select(`#c${a}`).style('fill', winnerColor);
            svgSimulation.select(`#c${b}`).style('fill', loserColor);
        };        
        if(r == -1){
            svgSimulation.select(`#c${a}`).style('fill', loserColor);
            svgSimulation.select(`#c${b}`).style('fill', winnerColor);
        };
        if(r == 0){
            svgSimulation.select(`#c${a}`).style('fill', 'rgb(26,26,26)');
            svgSimulation.select(`#c${b}`).style('fill', 'rgb(26,26,26)');
        };

        // Create the line
        svgSimulation.append("line")            
            .attr("x1", xa)
            .attr("y1", ya)
            .attr("x2", xb)
            .attr("y2", yb)
            .attr("stroke", "white")
            .attr("stroke-width", 1)
            .attr("opacity", .5 * Math.abs(r));
    };  

    sortedDistribution = [...moneyDistribution]
    sortedDistribution.sort(function(a,b) {return b-a;});

    if(sortedDistribution[0]  == initialValue * numUsers){
        pauseSimulation();
        drawFrame();
    }
    
};


