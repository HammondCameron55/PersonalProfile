#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

const projectRoot = path.join(__dirname, '..');

function run(command, args) {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd: projectRoot,
      stdio: 'inherit',
      shell: process.platform === 'win32'
    });
    child.on('exit', (code) => resolve(code ?? 1));
  });
}

(async () => {
  const buildCode = await run('npm', ['run', 'build']);
  if (buildCode !== 0) {
    console.error(JSON.stringify({ success: false, test: 'build', code: buildCode }));
    process.exit(buildCode);
  }

  const testCode = await run('node', ['dist/test/tools.test.js']);

  if (testCode === 0) {
    console.log(JSON.stringify({ success: true, test: 'all' }));
  } else {
    console.error(JSON.stringify({ success: false, test: 'all', code: testCode }));
  }
  process.exit(testCode);
})();

