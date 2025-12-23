const isWorking = require("./utils_isWorking");

module.exports = function roleRepair(creep) {
  // 1. Обновляем состояние
  isWorking(creep);

  if (!creep.memory.working) {
    // Handle resource gathering (not shown in original, but needed for working state)
    return;
  }

  // 🛠 РЕЖИМ РЕМОНТ
  // Use personal target caching to avoid expensive operations every tick
  if (!creep.memory.repairTarget || Game.time % 5 === 0) {
    // Cache repair targets in room memory, refresh every 20 ticks (less frequent)
    if (
      !creep.room.memory.repairTargets ||
      !creep.room.memory.repairLastUpdate ||
      Game.time - creep.room.memory.repairLastUpdate > 20
    ) {
      creep.room.memory.repairTargets = creep.room
        .find(FIND_STRUCTURES, {
          filter: (structure) => {
            return (
              structure.hits < structure.hitsMax * 0.8 && // Only repair when below 80%
              structure.structureType !== STRUCTURE_WALL &&
              structure.structureType !== STRUCTURE_RAMPART
            );
          },
        })
        .map((s) => ({ id: s.id, hits: s.hits, hitsMax: s.hitsMax }));
      creep.room.memory.repairLastUpdate = Game.time;
    }

    // Find closest target from cached list (only every 5 ticks)
    if (creep.room.memory.repairTargets.length > 0) {
      let bestTarget = null;
      let bestDistance = Infinity;

      for (const target of creep.room.memory.repairTargets) {
        const structure = Game.getObjectById(target.id);
        if (structure && structure.hits < structure.hitsMax) {
          const distance = creep.pos.getRangeTo(structure);
          if (distance < bestDistance) {
            bestDistance = distance;
            bestTarget = target.id;
          }
        }
      }
      creep.memory.repairTarget = bestTarget;
    } else {
      creep.memory.repairTarget = null;
    }
  }

  // Work with cached target
  if (creep.memory.repairTarget) {
    const target = Game.getObjectById(creep.memory.repairTarget);
    if (target && target.hits < target.hitsMax) {
      if (creep.pos.inRangeTo(target, 3)) {
        creep.repair(target);
        // Clear target if fully repaired
        if (target.hits === target.hitsMax) {
          creep.memory.repairTarget = null;
        }
      } else {
        creep.moveTo(target, { reusePath: 5 }); // Reuse path for 5 ticks
      }
    } else {
      creep.memory.repairTarget = null; // Target no longer valid
    }
  } else {
    creep.say("✅");
  }
};
