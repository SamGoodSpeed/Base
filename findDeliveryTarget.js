// findDeliveryTarget.js
const routesConfig = require("./routesConfig").routesConfig;

// ✦ главная функция
module.exports = function findDeliveryTarget(creep) {
  const route = creep.memory.routeName;
  if (route === "container_storage") {
    return creep.room.storage;
  }

  const cfg = routesConfig[creep.memory.role]; // ✦ сам реши, как назовёшь поле

  if (!cfg) {
    console.log(
      `No route config for creep ${creep.name}, routeName =`,
      creep.memory.role
    );
    return null;
  }

  if (route === "transporter_spawn") {
    // ✦ тут ты найдёшь все спавны и экстеншены с freeCapacity > 0
    //   и вернёшь ОДНУ цель (или null)
    const targets = creep.room.find(FIND_MY_STRUCTURES, {
      filter: (structure) =>
        (structure.structureType === STRUCTURE_SPAWN ||
          structure.structureType === STRUCTURE_EXTENSION) &&
        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
    });

    if (targets.length > 0) {
      // ✦ вернём ближайшую цель
      let nearest = creep.pos.findClosestByPath(targets);
      return nearest;
    } else {
      return null;
    }
  }

  // return cfg.role;

  // ✦ потом добавишь другие типы: storage, tower и т.п.
};
