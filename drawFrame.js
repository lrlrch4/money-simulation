//Simulation setup  

var fps = 10;
var frame = 0; 

var numUsers = 16;
const initialValue = 10;

var moneyDistribution = Array.from({ length: numUsers }, (_, index) => initialValue);

var sortedDistribution = [...moneyDistribution]
sortedDistribution.sort(function(a,b) {return b-a;});

function simulate(){
    frame += 1; 
    svgSimulation.selectAll('line').remove();
    connectAll();
}

function drawFrame() {    

//Drawing simulation elements        
    svgSimulation.selectAll('#drawFrameGroup').remove();            
    const drawFrameGroup = svgSimulation.append('g')
        .attr('id', 'drawFrameGroup');          
       
    var maxColumns = 4;
    if(numUsers > 16 & numUsers <= 100){
        maxColumns = 10;
    }
    if(numUsers > 100 & numUsers < 400){
        maxColumns = 20;
    };   
    if(numUsers >= 400){
        maxColumns = 30;
    }         

    const separation = svgWidth / (maxColumns + 1);
    amountColor = '#00AAFF';
    radius = .34*separation;

    var id = 0;
    //Loop for drawing the circles
    for (let i = 0; i < numUsers; i++) {
        const row = Math.floor(i / maxColumns);
        const column = i % maxColumns;

        drawFrameGroup.append('circle')
            .attr('id', `c${id}`)
            .attr('cx', separation * (column + 1))
            .attr('cy', separation * (row + 1))
            .attr('r', radius)
            .attr('fill', 'rgb(26,26,26)')
            .attr('stroke', 'white')
            .attr('stroke-width', '1px')
            .on('mouseover', circleClicked); 


        const startAngle = 0;
        const endAngle = 2*Math.PI * moneyDistribution[id]/(initialValue * numUsers);
        
        const arc = d3.arc()
            .innerRadius(.15 * separation)  
            .outerRadius(.337 * separation)  
            .startAngle(startAngle)  
            .endAngle(endAngle); 
        
        drawFrameGroup.append("path")
            .attr('id', `arc${id}`)
            .attr("d", arc)
            .attr("transform", 
            `translate(
                ${ separation * (column + 1) },
                ${ separation * (row + 1) }
                )` 
            )  
            .style("fill", amountColor); 

        id += 1;
    };//drawing circles loop ended
    drawFrameGroup.select(`#c${selectedUser}`).attr('stroke', 'yellow')
    
//Drawing char elements
    svgChar.selectAll('#drawCharGroup').remove();            
    const drawCharGroup = svgChar.append('g')
        .attr('id', 'drawCharGroup');

    const totalValue = initialValue * numUsers;

    var maxScaleValue = .012 * totalValue;

    if(sortedDistribution[0] > .01 * totalValue & sortedDistribution[0] <= .05* totalValue){
        maxScaleValue = .05*totalValue;
    };
    if(sortedDistribution[0] > .05 * totalValue & sortedDistribution[0] <= .25* totalValue){
        maxScaleValue = .25*totalValue;
    };
    if(sortedDistribution[0] > .25 * totalValue & sortedDistribution[0] <= .5* totalValue){
        maxScaleValue = .5*totalValue;
    };
    if(sortedDistribution[0] > .5 * totalValue & sortedDistribution[0] <= .75* totalValue){
        maxScaleValue = .75*totalValue;
    };  
    if(sortedDistribution[0] > .75 * totalValue){
        maxScaleValue = totalValue;
    };                

    const moneyAxis = d3.scaleLinear()
        .domain([0, maxScaleValue])
        .range([.02*svgWidth, .7*svgWidth]);

    const usersAxis = d3.scaleLinear()
        .domain([0, numUsers - 1])
        .range([.02*svgHeight, .94*svgHeight]);
    
    const separationBars = (numUsers == 2) ? 0.02 : (numUsers > 2) ? 0.45 : undefined;
    for(let i = 0; i < moneyDistribution.length; i++){                
        drawCharGroup.append('line')
            .attr('id', `bar${i}`)
            .attr('x1', moneyAxis(0))
            .attr('y1', usersAxis(i))
            .attr('x2', moneyAxis(moneyDistribution[i]) )
            .attr('y2', usersAxis(i))
            .attr('stroke', amountColor)
            .attr('stroke-width', separationBars * (usersAxis(1) - usersAxis(0)) );
    };

    drawCharGroup.select(`#c${selectedUser}`).attr('stroke', 'yellow')

    drawCharGroup.append("g")
        .attr("transform", `translate(${0},${.95*svgHeight} )`)
        .call(d3.axisBottom(moneyAxis).ticks(10))
        .attr('color', 'white')
        .attr('font-size', `${0.02*svgSide}px`);

    drawCharGroup.append("g")
        .attr("transform", `translate(${moneyAxis(0)},${0} )`)
        .call(
            d3.axisLeft(usersAxis)
                .ticks(numUsers - 1)
                .tickFormat( 
                    (d,i) => {return }
                )
            )
        .attr('color', 'white');
        
//Draw sorted bars     
    if(isSorted){                
        for(let i = 0; i < sortedDistribution.length; i++){
            drawCharGroup.append('line')
                .attr('id', 'sortedBars')
                .attr('x1', moneyAxis(0))
                .attr('y1', usersAxis(i))
                .attr('x2', moneyAxis(sortedDistribution[i]) )
                .attr('y2', usersAxis(i))
                .attr('stroke', 'green')
                .attr('stroke-width', separationBars * (usersAxis(1) - usersAxis(0)) )
                .attr('opacity', .5);  
        };                
    };

//Draw fit function
    const logarithmDistribution = sortedDistribution.map(value => Math.log(value + 1));


    const tValues = d3.range(0, numUsers, 1);
    const data = tValues.map(t => [t, logarithmDistribution[t]]);
    const result = linearRegression(data);
    const m = result.m;
    const b = result.b;

    if(isFit){           
        const line = d3.line()
                .x(d => moneyAxis(d[1]))
                .y(d => usersAxis(d[0]));   

        const points = tValues.map(t => [t, Math.exp(m*t + b) - 1]);
        drawCharGroup.append("path")
            .datum(points)
            .attr("d", line)
            .attr("fill", "none")
            .attr("stroke", 'green' )
            .attr("stroke-width", 2);
    } 
    
//Write statisc data in char svg   
    const numLosers = moneyDistribution.filter(element => element === 0).length

    const standardDeviation = Math.sqrt(
        moneyDistribution.reduce((variance, value) => variance + (initialValue - value)**2, 0)
        );

    const entropy = calculateEntropy(moneyDistribution);

    statisticsText = [
        `iteration = ${frame}`,
        `total users = ${numUsers}`, 
        `selected user = c${selectedUser}`,
        `selected value = ${selectedValue}`, 
        `players = ${numUsers - numLosers}`,
        `num losers = ${numLosers}`,
        `total money = ${totalValue}`,
        `max value = ${sortedDistribution[0]}`,
        `sigma = ${standardDeviation.toFixed(2)}`, 
        `entropy = ${entropy.toFixed(2)}`, 
        `y = exp(${m.toFixed(2)}x + ${b.toFixed(2)}) - 1`                              
    ];

    for(let i = 0; i < statisticsText.length; i++){
        drawCharGroup.append('text')
            .text(statisticsText[i])
            .attr('id', `text${i}`)
            .attr('x', .72*svgWidth)
            .attr('y', (.2 + 0.05*i)*svgHeight)
            .attr('fill', 'white')
            .attr('font-size', `${0.020*svgSide}`)
            .attr('font-family', 'Courier New');
    }
    drawCharGroup.select(`#text${10}`).attr('fill', 'green');
}; 