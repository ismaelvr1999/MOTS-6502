const runTest = (name: string, fn: () => void) => {
    return () => {
        try {
            fn();
            console.log(`✓ ${name}`);
        }
        catch (e) {
            console.error(`✗ ${name}`);
            console.error(e instanceof Error ? e.stack : e);
        }
    }
};

const describe = (name: string, fn: ()=> void ) => {
    fn();
}


export default runTest;