module.exports = function goHarvest(source, creep, spawnName) {
  const spawn = Game.spawns[spawnName];
  // 1. ПУСТОЙ → идём к ресурсу или копае
  // Проверка дистанции
  if (creep.pos.isNearTo(source)) {
    creep.harvest(source);
  } else {
    creep.moveTo(source);
  }
};
