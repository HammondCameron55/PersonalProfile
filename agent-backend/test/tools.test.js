import { calculatorTool } from '../src/agent/tools/calculator.js';
import { webSearchTool } from '../src/agent/tools/webSearch.js';
async function run() {
    const results = [];
    results.push(await calculatorTool.invoke({ expression: '2 + 2 * 3' }));
    results.push(await calculatorTool.invoke({ expression: 'invalid + expression' }));
    results.push(await webSearchTool.invoke({ query: 'latest news about AWS cloud' }));
    return results;
}
run()
    .then((outputs) => {
    console.log(JSON.stringify({
        success: true,
        test: 'tools',
        outputs
    }, null, 2));
    process.exit(0);
})
    .catch((err) => {
    console.error(JSON.stringify({
        success: false,
        test: 'tools',
        error: err instanceof Error ? err.message : String(err)
    }, null, 2));
    process.exit(1);
});
