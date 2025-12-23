const isWorking = require("./utils_isWorking");
const goPickUp = require("./goPickUp");
const findPickUpTarget = require("./findPickUpTarget");
const goStore = require("./goStore");
// new universal roleLink u
module.exports = function role_linker(creep, id, type) {
  // and working logic is same  pick and store
  let from = null;
  let to = null;
  isWorking(creep);

  if (type === "link_to_storage") {
    from = Game.getObjectById(id);
    to = creep.room.storage;
  } else if (type === "container_to_link") {
    from = findPickUpTarget(creep);
    to = Game.getObjectById(id);
  } else if (type === "container_to_link") {
    from = Game.getObjectById(id);
    to = Game.getObjectById(id);
  }
  if (!creep.memory.working) {
    // 1. Нет from — просто ждем
    if (!from) {
      creep.say("❓");
      return;
    }

    // 2. Если рядом и есть энергия → pick
    if (from.store[RESOURCE_ENERGY] > 0 && creep.pos.isNearTo(from)) {
      goPickUp(from, creep, "Spawn1");
      return;
    }

    // 3. Если энергии нет → ждем рядом
    if (from.store[RESOURCE_ENERGY] === 0) {
      creep.moveTo(from);
      creep.say("⏳");
      return;
    }

    // 4. Иначе просто идём к from
    creep.moveTo(from);
    // Берем энергию только из контейнера или линка
    if (from && from.store[RESOURCE_ENERGY] > 0 && creep.pos.isNearTo(from)) {
      goPickUp(from, creep, "Spawn1");
    } else {
      creep.moveTo(from);
    }
  } else {
    if (!to) {
      // нет цели сдачи — просто стоим
      creep.say("⛔");
      return;
    }
    goStore(to, creep, "Spawn1");
  }
};
