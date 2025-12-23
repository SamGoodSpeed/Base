// This is creep creation logic extracted to creater.js
module.exports = function createCreeps(spawnName, creepConfig) {
  // spawnName: string - name of the spawn
  // creepConfig: name and body array of creeps to create
  const spawn = Game.spawns[spawnName];
  if (!spawn) {
    console.log(`Spawn ${spawnName} not found!`);
    return;
  }
  Game.spawns[spawnName].spawnCreep(
    creepConfig.body,
    creepConfig.name,
    creepConfig.option
  );
};
// example usage:
/*
createCreeps("Spawn1", { name: "builder", body: [WORK, WORK, MOVE, CARRY] });
*/
