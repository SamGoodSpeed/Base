module.exports = function goStore(target, creep, spawnName) {
  // 2. ПОЛНЫЙ → идём сдавать или сдаём
  if (creep.pos.isNearTo(target)) {
    creep.transfer(target, RESOURCE_ENERGY);
  } else {
    creep.moveTo(target);
  }
};

// example usage:
/*
goStore(spawn, creep, "Spawn1");
*/
