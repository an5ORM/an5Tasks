const { test } = require('node:test');
const { execFileSync } = require('node:child_process');
const path = require('node:path');

test('task execution initializes telemetry with the installed SDK', () => {
  execFileSync(process.execPath, ['-e', `
    (async () => {
      const assert = require('node:assert/strict');
      const {createTaskTool} = require(${JSON.stringify(path.resolve(__dirname, '../dist/index.js'))});
      const task = await createTaskTool({type:'BUG', description:'Runtime contract'});
      assert.equal(task.priority,'high');
      assert.equal(task.status,'todo');
      assert.ok(task.title.includes('Runtime contract'));
      process.exit(0);
    })().catch(error => {console.error(error);process.exit(1)});
  `], { stdio: 'pipe', timeout: 30000, env: { ...process.env, ENABLE_FIREBASE_MONITORING: 'false' } });
});
