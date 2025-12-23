const isWorking = require("./utils_isWorking");

module.exports = function roleMineralTransfer(creep) {
  const sourceContainer = Game.getObjectById("69490541dacbd0af92c13654");

  // Check if objects exist
  if (!sourceContainer) {
    creep.say("❌ No Container!");
    return;
  }

  isWorking(creep);

  if (!creep.memory.working) {
    // PICKUP MODE: Get minerals from container
    // Check if container has any mineral resources
    let hasMineral = false;
    let mineralType = null;

    for (const resourceType in sourceContainer.store) {
      if (resourceType !== RESOURCE_ENERGY) {
        hasMineral = true;
        mineralType = resourceType;
        break;
      }
    }

    if (hasMineral) {
      if (creep.pos.isNearTo(sourceContainer)) {
        const result = creep.withdraw(sourceContainer, mineralType);
        if (result === OK) {
          creep.say(`📦 ${mineralType}`);
        }
      } else {
        creep.moveTo(sourceContainer);
      }
    } else {
      creep.say("⛔ No minerals");
    }
  } else {
    // Find what mineral the creep is carrying
    let carriedMineral = null;
    for (const resourceType in creep.store) {
      if (creep.store[resourceType] > 0 && resourceType !== RESOURCE_ENERGY) {
        carriedMineral = resourceType;
        break;
      }
    }

    if (carriedMineral) {
      // DELIVERY MODE: Store minerals in storage
      if (creep.room.storage) {
        if (creep.pos.isNearTo(creep.room.storage)) {
          const result = creep.transfer(creep.room.storage, carriedMineral);
          if (result === OK) {
            creep.say(`🏪 ${carriedMineral}`);
          }
        } else {
          creep.moveTo(creep.room.storage);
        }
      } else {
        creep.say("❌ No Storage!");
      }
    } else {
      creep.say("⛔ No cargo");
    }
  }
};
