Alpine.store('log', {
  logs: [],
});

function rollD6(rollprompt) {
  const result = Math.floor(Math.random() * 6) + 1;
  if (rollprompt) {
    log(`${rollprompt} [${result}]`);
  }
  return result;
}

function rollD6s(amount = 1, rollprompt) {
  const results = [];
  for (let i = 0; i < amount; i++) {
    const result = Math.floor(Math.random() * 6) + 1;
    results.push(result);
  }
  if (rollprompt) {
    log(`${rollprompt} [${results.join(', ')}]`);
  }
  return results;
}

function rollD3(rollprompt) {
  const result = Math.floor(Math.random() * 3) + 1;
  if (rollprompt) {
    log(`${rollprompt} [${result}]`);
  }
  return result;
}

function log(msg) {
  Alpine.store('log').logs.push(msg);
}

function skipLogLine() {
  log('‎');
}