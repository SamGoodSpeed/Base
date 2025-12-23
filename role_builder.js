const isWorking = require("./utils_isWorking");
const goPickUp = require("./goPickUp");
const goBuild = require("./goBuild");
const goUpgrade = require("./goUpgrade");

module.exports = function role_builder(creep) {
  // builders.push(creep);
  const sites = creep.room.find(FIND_CONSTRUCTION_SITES);
  // 1. Обновляем состояние
  isWorking(creep);
  // 2. Делаем действие по состоянию
  if (!creep.memory.working) {
    // 🔄 РЕЖИМ ДОБЫЧИ - сначала ищем упавшую энергию
    const droppedEnergy = creep.room.find(FIND_DROPPED_RESOURCES, {
      filter: (resource) => resource.resourceType === RESOURCE_ENERGY,
    });

    if (droppedEnergy.length > 0) {
      if (creep.pos.isNearTo(droppedEnergy[0])) {
        creep.pickup(droppedEnergy[0]);
      } else {
        creep.moveTo(droppedEnergy[0]);
      }
    } else {
      // Если нет упавшей энергии, берем из хранилища
      if (creep.room.storage && creep.room.storage.store[RESOURCE_ENERGY] > 0) {
        goPickUp(creep.room.storage, creep, "Spawn1");
      } else {
        creep.say("⛔");
      }
    }
  } else {
    // 🚧 РЕЖИМ СТРОИТЕЛЬСТВА
    if (sites.length > 0) {
      goBuild(sites[0], creep, "Spawn1");
    } else {
      // Если нет строек, сначала проверяем, есть ли что ремонтировать (кроме стен)
      // Use cached repair targets, refresh every 10 ticks
      if (
        !creep.room.memory.repairTargets ||
        !creep.room.memory.repairLastUpdate ||
        Game.time - creep.room.memory.repairLastUpdate > 10
      ) {
        creep.room.memory.repairTargets = creep.room
          .find(FIND_STRUCTURES, {
            filter: (structure) => {
              return (
                structure.hits < structure.hitsMax &&
                structure.structureType !== STRUCTURE_WALL &&
                structure.structureType !== STRUCTURE_RAMPART
              );
            },
          })
          .map((s) => s.id);
        creep.room.memory.repairLastUpdate = Game.time;
      }

      // Get actual structures from cached IDs, filter out destroyed ones
      const structuresToRepair = creep.room.memory.repairTargets
        .map((id) => Game.getObjectById(id))
        .filter((structure) => structure && structure.hits < structure.hitsMax);

      if (structuresToRepair.length > 0) {
        const closestStructure =
          creep.pos.findClosestByPath(structuresToRepair);
        if (closestStructure) {
          if (creep.pos.inRangeTo(closestStructure, 3)) {
            creep.repair(closestStructure);
          } else {
            creep.moveTo(closestStructure);
          }
        }
      } else {
        // Если нет ремонта и строек, можно отправить его помогать апгрейду
        const controller = creep.room.controller;
        goUpgrade(controller, creep, "Spawn1");
      }
    }
  }
};
