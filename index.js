var prompt = require('prompt'),
  allBlocks = [];

for (var i = 0; i < Math.floor(Math.random() * 25) + 1; i++) {
  allBlocks.push([i]);
}

run = () => {
  console.log(
    `
    You have ${allBlocks.length} boxes \n
    1) move a onto b \n
    2) move a over b \n
    3) pile a onto b \n
    4) pile a over b \n
    5) exit \n
    6) run sample input
    `
  );
  getPrompt();
  prompt.start();
}

getPrompt = () => {
  prompt.get(['command'], (err, result) => {
    if (err) { return onErr(err); }
    // console.log('command: ' + result.command);

    if (result.command === '1' || result.command === 'move a onto b') {
      prompt.get(['blockA', 'blockB'], (err, result) => {
        console.log(result);
      });
    }

    if (result.command === '2' || result.command === 'move a over b')
      moveAOverB(0, 1);

    if (result.command === '3' || result.command === 'pile a onto b')
      pileAOntoB(0, 3);


    if (result.command === '4' || result.command === 'pile a over b')
      pileAOverB(0, 1)

    if (result.command === '5' || result.command === 'quit')
      prompt.stop();

    if (result.command === '6' || result.command === 'run sample input') {
      allBlocks = [];

      for (var i = 0; i < 10; i++) {
        allBlocks.push([i]);
      }

      moveAOntoB(9, 1);
      moveAOverB(8, 1);
      moveAOverB(7, 1);
      moveAOverB(6, 1);
      pileAOverB(8, 6);
      pileAOverB(8, 5);
      moveAOverB(2, 1);
      moveAOverB(4, 9);

      prompt.stop();
    }
  });
}

onErr = (err) => {
  console.log(err);
  return 1;
}

// util functions
getColumn = (block) => {
  for (var [index, value] of allBlocks.entries()) {
    if (allBlocks[index].indexOf(block) !== -1) {
      return index;
    }
  }
}

getStackPosition = (block) => {
  var position = getColumn(block);
  return allBlocks[position].indexOf(block);
}

moveBlock = (block, position) => {
  removeblock(block);
  allBlocks[position].push(block);
}

pushBlock = (block, position) => {
  allBlocks[position].push(block);
}

removeblock = (block) => {
  var position = getColumn(block);
  var index = getStackPosition(block);

  allBlocks[position].splice(index, 1);
  return position;
}

resetBlock = (block) => {
  var currentPosition = getColumn(block);
  if (currentPosition !== block) { // if block is not in it's original column put it back
    moveBlock(block, block); // because block value is same as it's initial position
  }
}

resetAfterBlock = (block) => {
  var position = getColumn(block);
  var stackPosition = getStackPosition(block);

  while (tempBlock = allBlocks[position][stackPosition + 1]) { // while there is a block ontop of current block reset everything above
    resetBlock(tempBlock);
  }
}

moveBlockStack = (block, toPosition) => {
  var position = getColumn(block);
  var stackPosition = getStackPosition(block);
  var tempStack = [];

  while (tempBlock = allBlocks[position][stackPosition]) { // loop over column array from (block) index and create new array (pile) 
    removeblock(tempBlock);
    tempStack.push(tempBlock);
  }

  tempStack.forEach(block => {
    pushBlock(block, toPosition);
  });
}

printResults = () => {
  allBlocks.forEach((col, index) => {
    console.log(`${index}: ${col.join(' ')}`);
  });
  console.log(`----------------`);
  run();
}

process.on('exit', (code) => {
  console.log(`About to exit with code: ${code}`);
});

// command functions
moveAOntoB = (from, to) => {
  console.log(`Move ${from} onto ${to}`);

  resetAfterBlock(from);
  resetAfterBlock(to);
  var toPosition = getColumn(to);

  moveBlock(from, toPosition);

  printResults();
}

moveAOverB = (from, to) => {
  resetAfterBlock(from);
  var toPosition = getColumn(to);
  moveBlock(from, toPosition);

  printResults();
}

pileAOntoB = (from, to) => {
  resetAfterBlock(to);
  var position = getColumn(from);
  var stackPosition = getStackPosition(from);
  var toPosition = getColumn(to);
  var tempStack = [];

  moveBlockStack(from, toPosition);

  printResults();
}

pileAOverB = (from, to) => {
  var position = getColumn(from);
  var stackPosition = getStackPosition(from);
  var toPosition = getColumn(to);
  var tempStack = [];

  moveBlockStack(from, toPosition);

  printResults();
}

run();