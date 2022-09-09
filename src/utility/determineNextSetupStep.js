const determineNextSetupStep = (currentStep, progressionData) => {
    console.log('CURRENT STEP: ', currentStep)
    console.log('RECEIVED PROG DATA: ', progressionData)
    const nextStep = progressionData.find(step => step.stepNo > currentStep && step.isCompleted === 0);
    if (nextStep) {
        console.log('next found step: ', nextStep.routeName)
        return nextStep.routeName
    } else {
        console.log('next found step: DEFAULT')
        return 'SetupSubscription'
    }
};

export default determineNextSetupStep;