const runTest = (name:string, fn: ()=> void) =>{
    try {
        fn();
        console.log(`✓ ${name}`);
    }
    catch(e) {
        console.error(`✗ ${name}`);
        console.error(e instanceof Error ? e.stack : e);
    }
}