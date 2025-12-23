// Emergency defense script - all creeps collect energy and feed towers
module.exports = function emergencyDefense(creep) {
  // Find towers that need energy
  const towers = creep.room.find(FIND_MY_STRUCTURES, {
    filter: (structure) => 
      structure.structureType === STRUCTURE_TOWER &&
      structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
  });

  // Emergency energy collection - any source
  if (creep.store[RESOURCE_ENERGY] === 0) {
    // Priority 1: Dropped energy
    const droppedEnergy = creep.room.find(FIND_DROPPED_RESOURCES, {
      filter: (resource) => resource.resourceType === RESOURCE_ENERGY
    });
    
    if (droppedEnergy.length > 0) {
      const closest = creep.pos.findClosestByPath(droppedEnergy);
      if (creep.pos.isNearTo(closest)) {
        creep.pickup(closest);
      } else {
        creep.moveTo(closest);
      }
      return;
    }

    // Priority 2: Containers with any energy
    const containers = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) =>
        structure.structureType === STRUCTURE_CONTAINER &&
        structure.store[RESOURCE_ENERGY] > 0
    });

    if (containers.length > 0) {
      const closest = creep.pos.findClosestByPath(containers);
      if (creep.pos.isNearTo(closest)) {
        creep.withdraw(closest, RESOURCE_ENERGY);
      } else {
        creep.moveTo(closest);
      }
      return;
    }

    // Priority 3: Sources (mine directly)
    const sources = creep.room.find(FIND_SOURCES);
    if (sources.length > 0) {
      const closest = creep.pos.findClosestByPath(sources);
      if (creep.pos.isNearTo(closest)) {
        creep.harvest(closest);
      } else {
        creep.moveTo(closest);
      }
      return;
    }
  }

  // If has energy, go to closest tower
  if (creep.store[RESOURCE_ENERGY] > 0 && towers.length > 0) {
    const closestTower = creep.pos.findClosestByPath(towers);
    if (creep.pos.isNearTo(closestTower)) {
      creep.transfer(closestTower, RESOURCE_ENERGY);
    } else {
      creep.moveTo(closestTower);
    }
    creep.say("🔥DEFEND");
  } else {
    creep.say("⚠️HELP");
  }
};