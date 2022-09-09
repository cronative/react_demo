## ready-hubb

## useEffect(() => {
##     const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
##    // When the component is unmounted, remove the listener
##    return () => unsubscribe();
##  }, []);