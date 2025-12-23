module.exports = function goBuild(target, creep, spawnName) {
  const spawn = Game.spawns[spawnName];
  // 3. СТРОИМ
  if (creep.pos.isNearTo(target)) {
    creep.build(target);
  } else {
    creep.moveTo(target);
  }
};
