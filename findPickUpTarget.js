const routesConfig = require("./routesConfig").routesConfig;

module.exports = function findPickUpTarget(creep) {
  const room = creep.room;
  const cfg = routesConfig[creep.memory.role];

  if (!cfg) {
    console.log(`No route config found for role: ${creep.memory.role}`);
    return null;
  }

  const fromRule = cfg.from;
  if (fromRule.type === "container") {
    // PERFORMANCE: Cache containers every 5 ticks instead of finding each time
    const cacheKey = `containerIds_${room.name}`;
    if (!Memory[cacheKey] || Game.time % 5 === 0) {
      Memory[cacheKey] = room
        .find(FIND_STRUCTURES, {
          filter: (structure) =>
            structure.structureType === STRUCTURE_CONTAINER &&
            structure.store[RESOURCE_ENERGY] > 100,
        })
        .map((s) => s.id);
    }

    const containers = Memory[cacheKey]
      .map((id) => Game.getObjectById(id))
      .filter(Boolean);
    if (containers.length > 0) {
      let nearest = creep.pos.findClosestByPath(containers);
      return nearest;
    } else {
      return null;
    }
  }
};
