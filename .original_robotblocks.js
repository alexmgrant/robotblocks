// instead of inguirer we could keep the process open with setTimeout
// var timeoutId = setTimeout(callback, 3600000);
// timeoutId.unref(); // Now, Node won't wait for this timeout to complete if it needs to exit earlier.


var inquirer = require('inquirer');
var Rx = require('rx-lite-aggregates');
var boxes = [[0], [1], [2], [3], [4]];
var _obs;

var prompts = Rx.Observable.create(
  obs => {
    _obs = obs;

    obs.onNext({
      type: 'rawlist',
      name: 'execute_selected',
      choices: [
        'move a onto b',
        'move a over b',
        'pile a onto b',
        'pile a over b',
        'exit'
      ],
      message: `Let\'s get started. You have ${boxes.length} boxes`,
      validate: answer => {
        console.log(answer)
      }
    });
  },
  error => ui.log.write(`An error occured ${error}`),
  onComplete => console.log('ONCOMPLETE!!!!'));

inquirer.prompt(prompts).then(answers => {
  var ans = answers;
  console.log(ans.execute_selected)
});

complete = () => _obs.onCompleted();

// puts block a onto block b
// returns any blocks stacked ontop of blocks a & b to their initial positions when resetting for ne block move
moveAOntoB = (blockA, blockB) => {

  for (var i = 0; i < boxes.length; i++) {
    if (boxes[i].indexOf(blockA) !== -1) {
      var boxAPosition = i;
      var stackAPosition = boxes[boxAPosition].indexOf(blockA);

      if (boxes[boxAPosition].length - 1 > stackAPosition) {
        var removedBlock = boxes[stackAPosition].splice(stackAPosition + 1);
        for (var j = 0; j < removedBlock.length; j++) {
          boxes[removedBlock[j]].push(removedBlock[j]);
        }
      }
    }

    if (boxes[i].indexOf(blockB) !== -1) {
      var boxBPosition = i;
      var stackBPosition = boxes[boxBPosition].indexOf(blockB);

      if (boxes[boxBPosition].length - 1 > stackBPosition) {
        var removedBlock = boxes[boxBPosition].splice(stackBPosition + 1);
        for (var j = 0; j < removedBlock.length; j++) {
          boxes[removedBlock[j]].push(removedBlock[j]);
        }
      }
    }
  }

  boxes[boxAPosition].pop();
  boxes[boxBPosition].push(blockA);
  // [[0, 1], [], [2], [3], [4]]; 
}

// moveAOntoB(1, 0);
// moveAOntoB(2, 0);
// moveAOntoB(0, 3);

process.on('exit', (code) => {
  console.log(`About to exit with code: ${code}`);
});