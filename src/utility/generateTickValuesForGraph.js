const generateTickValuesForGraph = (data) => {
    let ticks = [0];

    const values = data.map(item => Number(item.y));
    // const max = Math.max(values);
    let max;
    if (values.length) {
        max = Math.max.apply(Math, values)

    } else {
        max = 0;
    }

    if (max === 0) {
        ticks = [0, 1, 2];
    }
    else {
        //difference between each tick value
        const step = getStep(Number(max));
        for (let i = 1; i <= max; i++) {
            if (i % step === 0) ticks.push(i);
        }
        ticks.push(ticks[ticks.length - 1] + step);
    }
    return ticks



}


const getStep = (max) => {
    if (max > 1500) return 1000;
    else if (max > 1000 && max <= 1500) return 500;
    else if (max > 500 && max <= 1000) return 200;
    else if (max > 300 && max <= 500) return 100;
    else if (max > 100 && max <= 300) return 50;
    else if (max > 50 && max <= 100) return 20;
    else if (max > 25 && max <= 50) return 10;
    else if (max <= 25) return 5;
    else return 5;
    // switch (max) {
    //     case max > 1500:
    //         return 1000;
    //     case max > 1000 && max <= 1500:
    //         return 500;
    //     case max > 500 && max <= 1000:
    //         return 200;
    //     case max > 300 && max <= 500:
    //         return 100;
    //     case max > 100 && max <= 300:
    //         return 50;
    //     case max > 50 && max <= 100:
    //         return 20;
    //     case max > 25 && max <= 50:
    //         return 10;
    //     case max <= 25:
    //         return 5;
    //     default:
    //         console.log('defaulttest')
    //         return 5;
    // }
}

export default generateTickValuesForGraph;