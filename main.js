const createCreeps = require("./creater");
const goHarvest = require("./goHarvest");
const goStore = require("./goStore");
const goUpgrade = require("./goUpgrade");
const countCreeps = require("./countCreeps");
const creepsConfig = require("./creeps_config").creepsConfig;
const roleTransporter = require("./role_transfer");
const goPickUp = require("./goPickUp");
const isWorking = require("./utils_isWorking");
const roleTransferStore = require("./role_tranfer_store");
const roleUpgraderDrop = require("./upgraderDrop");
const role_linker = require("./role_link");
const role_builder = require("./role_builder");
const roleMiner = require("./role_miner");
const roleMineralTransfer = require("./role_mineral_transfer");

module.exports.loop = function () {
  const startCPU = Game.cpu.getUsed();

  // 1. Объявляем параметры
  const room = Game.rooms["E55N28"];
  const count = {
    miner__1: countCreeps("miner__1"),
    miner__2: countCreeps("miner__2"),
    miner__3: countCreeps("miner__3"),
    builder: countCreeps("builder"),
    repairer: countCreeps("repairer"),
    upgrader: countCreeps("upgrader"),
    worker: countCreeps("worker"),
    transporter: countCreeps("transporter", "transporter_spawn"),
    transporter_storage: countCreeps("transporter_storage"),
    link_mineral_transfer: countCreeps("link_mineral_transfer"),
    upgraderDrop: countCreeps("upgraderDrop"),
    link: countCreeps("link"),
    link_to_storage: countCreeps("link_to_storage"),
  };
  for (const role in creepsConfig) {
    const config = creepsConfig[role];
    if (count[role] < config.min) {
      createCreeps("Spawn1", {
        name: `${role}_${Game.time}`,
        body: config.body,
        option: { memory: config.memory },
      });
    }
  }

  // Tower defense
  const towerStartCPU = Game.cpu.getUsed();
  const towers = room.find(FIND_STRUCTURES, {
    filter: (structure) => structure.structureType === STRUCTURE_TOWER,
  });

  for (const tower of towers) {
    const enemies = tower.room.find(FIND_HOSTILE_CREEPS);
    if (enemies.length > 0) {
      tower.attack(enemies[0]);
    }
  }
  console.log(
    `Tower defense CPU: ${(Game.cpu.getUsed() - towerStartCPU).toFixed(2)}`
  );

  // Link energy transfer
  const linkStartCPU = Game.cpu.getUsed();
  const links = room.find(FIND_STRUCTURES, {
    filter: (structure) => structure.structureType === STRUCTURE_LINK,
  });

  if (links.length >= 2) {
    const targetLink = links[0]; // First link is always the target

    // Loop through all other links and send energy to link[0]
    for (let i = 1; i < links.length; i++) {
      const sourceLink = links[i];

      // Check if target has space and source has energy
      if (
        targetLink.store.getFreeCapacity(RESOURCE_ENERGY) > 0 &&
        sourceLink.store[RESOURCE_ENERGY] > 0
      ) {
        const transferAmount = Math.min(
          targetLink.store.getFreeCapacity(RESOURCE_ENERGY),
          sourceLink.store[RESOURCE_ENERGY]
        );

        sourceLink.transferEnergy(targetLink, transferAmount);

        // Break if target is full after this transfer
        if (
          targetLink.store.getFreeCapacity(RESOURCE_ENERGY) <= transferAmount
        ) {
          break;
        }
      }
    }
  }
  console.log(
    `Link transfer CPU: ${(Game.cpu.getUsed() - linkStartCPU).toFixed(2)}`
  );

  const creepStartCPU = Game.cpu.getUsed();
  for (const name in Game.creeps) {
    const creep = Game.creeps[name];

    if (creep.memory.role === "repairer") {
      // repairers.push(creep);

      isWorking(creep);

      // 2. действуем по состоянию
      if (!creep.memory.working) {
        // 🔄 добываем из хранилища
        if (
          creep.room.storage &&
          creep.room.storage.store[RESOURCE_ENERGY] > 0
        ) {
          goPickUp(creep.room.storage, creep, "Spawn1");
        } else {
          creep.say("⛔");
        }
      } else {
        // 🛠 чиним
        const damaged = creep.room.find(FIND_STRUCTURES, {
          filter: (s) =>
            s.hits < s.hitsMax &&
            s.structureType !== STRUCTURE_WALL &&
            s.structureType !== STRUCTURE_RAMPART,
        });

        if (damaged.length > 0) {
          // можно потом сделать сортировку, пока берём первый
          const target = damaged[0];
          // тут напрашивается goRepair
          if (creep.pos.isNearTo(target)) {
            creep.repair(target);
          } else {
            creep.moveTo(target);
          }
        } else {
          // если чинить нечего — можно отправить его помогать апгрейду
          const controller = creep.room.controller;
          goUpgrade(controller, creep, "Spawn1");
        }
      }
    }
    if (creep.memory.role === "upgrader") {
      // upgraders.push(creep);
      const controller = creep.room.controller;
      const flagDrop = Game.flags["DROP"];
      const dropped = flagDrop.pos.lookFor(LOOK_RESOURCES);
      const energyOnGround = dropped.find(
        (r) => r.resourceType === RESOURCE_ENERGY
      );
      // обновляем состояние

      isWorking(creep);

      // действуем по состоянию
      if (!creep.memory.working) {
        // добываем из хранилища
        if (energyOnGround && energyOnGround.amount >= 100) {
          if (creep.pos.isNearTo(energyOnGround)) {
            creep.pickup(energyOnGround);
          } else {
            creep.moveTo(energyOnGround);
          }
        } else if (
          creep.room.storage &&
          creep.room.storage.store[RESOURCE_ENERGY] > 0
        ) {
          goPickUp(creep.room.storage, creep, "Spawn1");
        } else {
          creep.say("⛔");
        }
      } else {
        // апгрейдим
        goUpgrade(controller, creep, "Spawn1");
      }
    }

    // Role for upgraderDrop
    if (creep.memory.role === "upgraderDrop") {
      roleUpgraderDrop(creep);
    }
    // Role for transporter link
    if (creep.memory.role === "link") {
      role_linker(creep, "69367a9aea5febcd2c2c76dd", "container_to_link");
    }
    // Role for transporter to link
    if (creep.memory.role === "link_to_storage") {
      role_linker(creep, "69366eea6adca2e6f4321e4e", "link_to_storage");
    }
    // Role for mineral transfer link
    if (creep.memory.role === "link_mineral_transfer") {
      roleMineralTransfer(creep);
    }
    // Role for Workier // not using now
    if (creep.memory.role === "worker") {
    }
    // Role for transporter not using now
    if (creep.memory.role === "transporter") {
      roleTransporter(creep, "Spawn1");
    }
    // Role for transporter to storage
    if (creep.memory.role === "transporter_storage") {
      roleTransferStore(creep, "Spawn1");
    }
    // Role for builder
    if (creep.memory.role === "builder") {
      role_builder(creep);
    }
    if (creep.memory.role === "miner__2") {
      roleMiner(
        creep,
        "6948e339162b12c1b8949d8a",
        "5bbcb0549099fc012e63bf76",
        "Spawn1"
      );
    }
    if (creep.memory.role === "miner__1") {
      roleMiner(
        creep,
        "6948ed02ec12369ee25b9e17",
        "5bbcb0549099fc012e63bf77",
        "Spawn1"
      );
    }
    if (creep.memory.role === "miner__3") {
      roleMiner(
        creep,
        "69490541dacbd0af92c13654",
        "5bbcb703d867df5e54207c98",
        "Spawn1"
      );
    }
  }
  console.log(
    `Creep processing CPU: ${(Game.cpu.getUsed() - creepStartCPU).toFixed(2)}`
  );
  console.log(`TOTAL CPU: ${(Game.cpu.getUsed() - startCPU).toFixed(2)}`);
};
