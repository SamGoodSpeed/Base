// This function handles the respawning of creeps in the game.
// Body = The body parts assigned to the creep.
// Memory = The memory attributes assigned to the creep, such as role and working status.
// Summ of existing creeps
// Needed creeps by role
// Spawn name = The name of the spawn point where the creep will be created.
// Name of the creep will be generated within the function based on its role.
module.exports = function respawnCreeps(
  body,
  memory,
  sumCreeps,
  neededCreeps,
  spawnName,
  name
) {
  const creep = Game.creeps[name];
  if (creep) {
    creep.memory = memory;
    creep.body = body;
  } else {
    const spawn = Game.spawns[spawnName];
    if (spawn) {
      spawn.spawnCreep(body, name, { memory });
    }
  }
  return sumCreeps < neededCreeps;
};

// Example usage:
// respawnCreeps(
//   [WORK, CARRY, CARRY, MOVE, MOVE],
//   { role: 'harvester', working: false },
//   buildersCount ,
//   10,
//   'Spawn1',
//   'Harvester1'
// );
