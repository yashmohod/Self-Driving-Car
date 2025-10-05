function p1(time) {

    return [
        new Car(road.getLaneCenter(0), -600, 30, 50, "DUMMY", 1),
        new Car(road.getLaneCenter(1), -600, 30, 50, "DUMMY", 1.5),
        new Car(road.getLaneCenter(2), -600, 30, 50, "DUMMY", 2),
    ]
}
function p2(time) {

    return [
        new Car(road.getLaneMove(0), -600, 30, 50, "DUMMY", 2),
        new Car(road.getLaneMove(1) + 15, -700, 30, 50, "DUMMY", 2),
        new Car(road.getLaneMove(2), -600, 30, 50, "DUMMY", 2),
        new Car(road.getLaneMove(0), -900, 30, 50, "DUMMY", 2),
        new Car(road.getLaneMove(1) - 40, -800, 30, 50, "DUMMY", 2),
        new Car(road.getLaneMove(2), -900, 30, 50, "DUMMY", 2),
    ]
}