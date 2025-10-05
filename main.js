

const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;
const carCtx = carCanvas.getContext("2d");

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 400;
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
const N = 1000
// const car = new Car(road.getLaneCenter(1), 100, 30, 50, "AI");
const cars = generateCars(N)
let bestCar = cars[0]
if (localStorage.getItem("bestBrain")) {
    for (let i = 0; i < cars.length; i++) {
        cars[i].brain = JSON.parse(
            localStorage.getItem("bestBrain"));
        if (i != 0) {
            NeuralNetwork.mutate(cars[i].brain, 0.15);
        }
    }
}

function p3(time) {

    return [
        new Car(road.getLaneCenter(0), -600, 30, 50, "DUMMY", 1),
        new Car(road.getLaneMove(1, time), -600, 30, 50, "DUMMY", 1.5),
        new Car(road.getLaneMove(2, -time), -600, 30, 50, "DUMMY", 0.9),
    ]
}
const traffic = [
    // new Car(road.getLaneCenter(0), -600, 30, 50, "DUMMY", 1),
    // new Car(road.getLaneCenter(1), -600, 30, 50, "DUMMY", 1.5),
    // new Car(road.getLaneCenter(2), -600, 30, 50, "DUMMY", 0.9),
]



animate();

function save() {
    localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain))
}


function discard() {
    localStorage.removeItem("bestBrain")
}

function generateCars(N) {
    const cars = []

    for (let i = 1; i <= N; i++) {
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI", 3))
    }
    return cars
}
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function animate(time) {

    while (traffic.length < 6) {
        let CurLane = getRandomInt(road.laneCount)
        let posY = getRandomInt(3) * 100
        let speed = Math.random() * 2
        let newTC = new Car(road.getLaneCenter(CurLane), bestCar.y - 900 - posY, 30, 50, "DUMMY", speed);
        let conflict = false
        if (traffic == 0) {
            for (let i = 0; i < traffic.length; i++) {
                if (polysIntersect(newTC.polygon, traffic[i].polygon)) {
                    conflict = true
                }
            }
        }

        if (!conflict) {
            traffic.push(newTC)
        }
    }

    let nextT = []
    while (traffic.length > 0) {
        let curT = traffic.pop()
        if (bestCar.y - curT.y > -300) {
            curT.update(road.borders, [])
            nextT.push(curT)
        }
    }
    while (nextT.length > 0) {
        let curT = nextT.pop()
        traffic.push(curT)
    }
    /////////////////////////////////////

    // if (time % 10000 == 0) {
    // let nextC = []
    // while (cars.length > 0) {
    //     let curC = cars.pop()
    //     if ((!curC.damaged) && curC > 0) {
    //         nextC.push(curC)
    //     }
    // }
    // while (nextC.length > 0) {
    //     let curT = nextC.pop()
    //     cars.push(curT)
    // }

    // while (cars.length < 10) {
    //     let nc = new Car(road.getLaneCenter(1), bestCar.y, 30, 50, "AI", 2)
    //     nc.brain = bestCar.brain
    //     NeuralNetwork.mutate(nc.brain, 0.2);
    //     cars.push(nc)
    // }
    // }



    ///////////////////////////////////////

    for (let i = 0; i < cars.length; i++) {
        cars[i].update(road.borders, traffic);
    }


    let minY = Math.min(
        ...cars.map(c => c.y)
    )

    bestCar = cars.find(
        c => c.y == minY
    )

    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;
    carCtx.save();
    carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7 + 200);
    // carCtx.translate(0, -traffic[0].y + carCanvas.height * 0.7);
    road.draw(carCtx);
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carCtx, "red")
    }
    carCtx.globalAlpha = 0.2
    for (let i = 0; i < cars.length; i++) {
        cars[i].draw(carCtx, "blue");
    }
    carCtx.globalAlpha = 1
    bestCar.draw(carCtx, "blue", true);
    carCtx.restore();


    // console.log(traffic[0].y)
    networkCtx.lineDashOffset = -time / 50
    Visualizer.drawNetwork(networkCtx, bestCar.brain)
    requestAnimationFrame(animate);
}