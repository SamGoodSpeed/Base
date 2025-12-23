module.exports = function goPickUp(target, creep, spawnName) {
  const spawn = Game.spawns[spawnName];
  // 4. ПУСТОЙ → идём собирать или собираем
  if (creep.pos.isNearTo(target)) {
    creep.withdraw(target, target.resourceType || RESOURCE_ENERGY);
  } else {
    creep.moveTo(target);
  }
};
