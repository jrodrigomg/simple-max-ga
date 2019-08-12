//Aim function
const a_x1 = 1; //First coeficient
const b_x2 = 4; //Second coeficient

//Restrictions
const c_x1 = 4;
const d_x2 = 3;
const b1 = 10;

//Configurations
let population = [];//Population array
let fitness = []; //Fitness array
//Simplex solver with generic algorithm
const SIZE_POPULATION = 200; //Population max size
const MUATATION_FACTOR = 0.4; //mutation factor


//BEST HISTORY
let best_history = [-1,-1];
let best_current = [-1,-1];
let value_best_history = 0;
let value_best_current = 0;


function setup() 
{
    createCanvas(1200,700);
    generateFirstPopulation();
}

function generateFirstPopulation()
{
    for(let i=0; i<SIZE_POPULATION;i++)
    {
        //Creando un genome randomizado de dos variables X1 y X2
        population[i] = [random(0,10), random(0,10)];
    }
}

function calculateFitness()
{
    let sum = calculateSumFitness();
    value_best_current = 0;
    for(let i=0; i<SIZE_POPULATION; i++)
    {

        b = calculateRestriction(population[i]);
        if(b<=b1)
        {
            let z = calculateZ(population[i]);
            let fit = z/ sum;
            fitness[i] = fit;
            if( z > value_best_current)
            {
                value_best_current = z;
                best_current = population[i];
                if( z > value_best_history )
                {

                    console.log("if " + z + " < " + value_best_history);
                    value_best_history = z;
                    best_history = population[i];
                }
            }
        }
        else
        {
            fitness[i] = 0;
        }
    }
}

function calculateSumFitness()
{
    let sum = 0;
    for(let i=0; i<SIZE_POPULATION; i++)
    {
        b = calculateRestriction(population[i]);
        //If is up to b1 we don't sum anything
        if(b<=b1)
        {
            sum+=calculateZ(population[i]);
        }
    }
    return sum;
}

function calculateRestriction(genome)
{
    return c_x1*genome[0] + d_x2*genome[1];
}

function calculateZ(genome)
{
    return a_x1*genome[0] + b_x2*genome[1];
}

function generateGeneration()
{
    let newPopulation = [];
    for(let i=0; i<SIZE_POPULATION; i++)
    {
        var genome1 = pickOne(population, fitness);
        var genome2 = pickOne(population, fitness);
        var genome_new = crossOver(genome1, genome2);
        mutate(genome_new);
        newPopulation[i] = genome_new;
    }
    population = newPopulation;
}

function crossOver(g1, g2)
{
    g_new = [g1[0], g2[1]];
    return g_new;    
}

function mutate(genome)
{
    if(random(1) < MUATATION_FACTOR)
    {
        index = int(random(2));
        genome[index] = random(0,10);
    }
}


function pickOne(list, prob) 
{
    var index = 0;
    var r = random(1);
  
    while (r > 0) 
    {
      r = r - prob[index];
      index++;
    }
    index--;
    return list[index].slice();
}


function draw() 
{
    background(0);
    //DARWIN IS AWESOME
    calculateFitness();
    generateGeneration();

    fill(255)
    textSize(32);
    text('Z = ' + a_x1 + "*X1 + " + b_x2 + "*X2 ", width / 3, 30);
    text('With: ' + c_x1 + "*X1 + " + d_x2 + "*X2 <= " + b1, width/4, 80);

    if(value_best_history>0)
    {
         //Show best
        text("Best History", width/3,110);
        text("Z = " + a_x1 + "*" + best_history[0] + " + " + b_x2 + "*" + best_history[1] + " = " + value_best_history, 0, 150);
    }

    if(value_best_current>0)
    {
        //Best current
        text("Best Current", width/3,200);
        text("Z = " + a_x1 + "*" + best_current[0] + " + " + b_x2 + "*" + best_current[1] + " = " + value_best_history, 0, 250);
    }
}