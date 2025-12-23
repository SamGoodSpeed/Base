const goPickUp = require("./goPickUp");
const findDeliveryTarget = require("./findDeliveryTarget");
const findPickUpTarget = require("./findPickUpTarget");
const goStore = require("./goStore");

module.exports = function roleTransporter(creep, spawnName) {
  const to = findDeliveryTarget(creep);
  const tower = creep.room.find(FIND_STRUCTURES, {
    filter: (structure) =>
      structure.structureType === STRUCTURE_TOWER &&
      structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
  })[0];

  if (creep.store[RESOURCE_ENERGY] === 0) {
    creep.memory.working = false;
  }
  if (!creep.memory.working && creep.store.getFreeCapacity() === 0) {
    creep.memory.working = true;
  }
  if (!creep.memory.working) {
    // Берем энергию только из хранилища
    if (creep.room.storage && creep.room.storage.store[RESOURCE_ENERGY] > 0) {
      goPickUp(creep.room.storage, creep, spawnName);
    } else {
      creep.say("⛔");
    }
  } else {
    if (!to) {
      // нет цели сдачи — отправляем в башню
      if (tower) {
        goStore(tower, creep, spawnName);
      } else {
        creep.say("⛔");
      }
      return;
    }
    goStore(to, creep, spawnName);
  }
};

// example usage:
/*
roleTransporter(creep, deliveryTarget, harvestTarget, spawnName);
*/
