module.exports = function goUpgrade(target, creep, spawnName) {
  const spawn = Game.spawns[spawnName];
  // 3. УЛУЧШАЕМ - начинаем как только попадаем в радиус действия
  if (creep.pos.inRangeTo(target, 3)) {
    creep.upgradeController(target);
  } else {
    creep.moveTo(target);
  }
};
