//Aim function
const z_coeficients= [4,3,2];


//Restrictions
//The last value is the b, its the right of inequality
const restrictions = [
    [1,2,5,60], 
     [2,1,0,10]
]


//Configurations
let population = [];//Population array
let fitness = []; //Fitness array
//Simplex solver with generic algorithm
const SIZE_POPULATION = 10; //Population max size
const MUATATION_FACTOR = 0.4; //mutation factor


//BEST HISTORY
let best_history = [-1,-1];
let best_current = [-1,-1];
let value_best_history = 0;
let value_best_current = 0;


function setup() 
{
    createCanvas(1400,700);
    generateFirstPopulation();
    // calculateFitness();
    // generateGeneration();
}

function generateFirstPopulation()
{
    for(let i=0; i<SIZE_POPULATION;i++)
    {
        //Creando un genome randomizado de dos variables X1...Xn
        population[i] = initializeGenome();
    }
}

function initializeGenome()
{
    return Array(z_coeficients.length)
        .fill().map(() => Math.round(Math.random() * 10))
}

function calculateFitness()
{
    let sum = calculateSumFitness();
    value_best_current = 0;
    for(let i=0; i<SIZE_POPULATION; i++)
    {

        let valid = validateRestrictions(population[i]);
        if(valid)
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

                    console.log("if " + z + " > " + value_best_history);
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
        let valid = validateRestrictions(population[i]);
        //If is up to b1 we don't sum anything
        if(valid)
        {
            sum+=calculateZ(population[i]);
        }
    }
    return sum;
}

function validateRestrictions(genome)
{
    let valid = true;
    for(let i=0;i<restrictions.length;i++)
    {
        valid = valid & validateRestriction(restrictions[i], genome);
    }
    return valid;
}

function validateRestriction(restriction,genome)
{
    let b = 0;
    for(let i=0; i<restriction.length - 1;i++)
    {
        b +=restriction[i] * genome[i];
    }
    //Return if the restriction is valid with <=
    return b <= restriction[restriction.length - 1];
}

function calculateZ(genome)
{
    let sum = 0;
    for(let i=0; i<genome.length; i++)
    {
        sum+= genome[i] * z_coeficients[i];
    }
    return sum;
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
    new_genome = [];
    //Calculate the middle
    let n = z_coeficients.length;
    let middle = floor(n/2);
    //Assign the first bunch of coeficient
    for(let i=0;i<middle;i++)
    {
        new_genome[i] = g1[i];
    }
    //Assign the second bunch of coeficient
    for(let i=middle; i<n;i++)
    {
        new_genome[i] = g2[i];
    }
    return new_genome;    
}

function mutate(genome)
{
    let n = z_coeficients.length;
    if(random(1) < MUATATION_FACTOR)
    {
        index = int(random(n));
        genome[index] = random(0,10);
    }
}


function pickOne(list, prob) 
{
    var index = 0;
    var r = random(1);
    // console.log(list,prob)
    while (r > 0) 
    {
      r = r - prob[index];
      index++;
    }
    index--;
    // console.log(list[index])
    return list[index].slice();
}

function getFunctionString(z)
{
    let z_function = "Z = ";
    for (let i=0;i<z.length;i++)
    {
        z_function+= z[i] + "*" + "X"+i + " + ";
    }
    return z_function;
}

function getRestrictionTitle()
{
    let restriction_title = "With: \n";
    for(let i =0; i< restrictions.length;i++)
    {
        let restriction = restrictions[i];
        for (let j=0; j < restriction.length - 1; j++)
        {
            restriction_title += restriction[j] + "*X" + j + " + ";
        }

        restriction_title += "<= " + restriction[restriction.length - 1] + "\n"; 
    }
    return restriction_title;
}

function draw() 
{
    background(0);
    //DARWIN IS AWESOME
    calculateFitness();
    generateGeneration();

    fill(255)
    textSize(32);

    let z_function = getFunctionString(z_coeficients);
    let restriction_title = getRestrictionTitle();

    text(z_function, 0, 30);
    text(restriction_title, 0, 80);

    if(value_best_history>0)
    {
         //Show best
        text("Best History", 0,400);
        let best_history_string = getFunctionString(best_history);
        text(best_history_string, 0, 450);
    }

    if(value_best_current>0)
    {
        //Best current
        text("Best Current", 0,500);
        let best_current_string = getFunctionString(best_current);
        text(best_current_string, 0, 550);
    }
}