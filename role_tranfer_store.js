const isWorking = require("./utils_isWorking");
const goPickUp = require("./goPickUp");
const findPickUpTarget = require("./findPickUpTarget");
const goStore = require("./goStore");

module.exports = function roleTransferStore(creep, spawnName) {
  const to = creep.room.storage;
  const from = findPickUpTarget(creep);
  isWorking(creep);
  if (!creep.memory.working) {
    // Берем энергию только из контейнеров
    if (
      from &&
      from.structureType === STRUCTURE_CONTAINER &&
      from.store[RESOURCE_ENERGY] > 0
    ) {
      goPickUp(from, creep, spawnName);
    } else {
      creep.say("⛔");
    }
  } else {
    if (!to) {
      // нет цели сдачи — просто стоим
      creep.say("⛔");
      return;
    }
    goStore(to, creep, spawnName);
  }
};
