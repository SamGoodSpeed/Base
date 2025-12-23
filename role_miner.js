const goHarvest = require("./goHarvest");
const findDeliveryTarget = require("./findDeliveryTarget");
const findPickUpTarget = require("./findPickUpTarget");
const isWorking = require("./utils_isWorking");

module.exports = function roleMiner(creep, containerId, sourceId, spawnName) {
  const targetContainer = Game.getObjectById(containerId);
  const targetSource = Game.getObjectById(sourceId);

  // Debug: Check if objects exist
  if (!targetContainer) {
    creep.say("❌ No Container/Link!");
    return;
  }
  if (!targetSource) {
    creep.say("❌ No Source/Mineral!");
    return;
  }

  // Auto-detect if this is a mineral or energy source
  const isMineral = targetSource && targetSource.mineralType !== undefined;

  // For minerals, check if extractor exists
  if (isMineral) {
    const extractor = targetSource.pos
      .lookFor(LOOK_STRUCTURES)
      .find((s) => s.structureType === STRUCTURE_EXTRACTOR);

    if (!extractor) {
      creep.say("🏗️ No Extractor!");
      return;
    }

    // Check if mineral is depleted
    if (targetSource.mineralAmount === 0) {
      creep.say("💎 Depleted");
      return;
    }
  }

  isWorking(creep);

  if (!creep.memory.working) {
    // if creep is on container/link position, then harvest
    if (creep.pos.isEqualTo(targetContainer.pos)) {
      if (isMineral) {
        creep.say("⛏️💎"); // Mining mineral
      } else {
        creep.say("⛏️⚡"); // Mining energy
      }
      goHarvest(targetSource, creep, spawnName);
    } else {
      // move to container/link position
      if (isMineral) {
        creep.say("🚶💎"); // Moving to mineral position
      } else {
        creep.say("🚶⚡"); // Moving to energy position
      }
      creep.moveTo(targetContainer);
    }
  } else {
    // This state probably shouldn't be reached for miners
    if (isMineral) {
      creep.say("💎✅");
    } else {
      creep.say("⚡✅");
    }
  }
};

// example usage:
/*
// For energy mining:
roleMiner(creep, "containerId123", "energySourceId456", "Spawn1");

// For mineral mining:
roleMiner(creep, "containerId789", "mineralId012", "Spawn1");
*/
