const isWorking = require("./utils_isWorking");
module.exports = function upgraderDrop(creep) {
  const to = Game.flags["DROP"];
  const from = creep.room.storage;
  const dropped = to.pos.lookFor(LOOK_RESOURCES);
  const energyOnGround = dropped.find(
    (r) => r.resourceType === RESOURCE_ENERGY
  );

  isWorking(creep);

  if (creep.memory.working) {
    if (!to) {
      // нет цели сдачи — просто стоим
      creep.say("⛔");
      return;
    }
    if (energyOnGround && energyOnGround.amount >= 200) {
      creep.say("💤");
      return; // не дропаем
    }
    if (creep.pos.isNearTo(to) && creep.pos.isEqualTo(to.pos)) {
      creep.drop(RESOURCE_ENERGY, 20);
    } else {
      creep.moveTo(to.pos);
    }
  } else {
    // добываем из хранилища
    if (from && from.store[RESOURCE_ENERGY] > 0) {
      if (creep.pos.isNearTo(from)) {
        creep.withdraw(from, RESOURCE_ENERGY);
      } else {
        creep.moveTo(from);
      }
    } else {
      creep.say("⛔");
    }
  }
};
