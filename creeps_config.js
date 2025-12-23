// this is interface for creeps configuration
module.exports.creepsConfig = {
  miner__1: {
    min: 1,
    body: [WORK, WORK, WORK, WORK, WORK, MOVE],
    memory: { role: "miner__1", working: false, routeName: "miner__1" },
  },
  miner__2: {
    min: 1,
    body: [WORK, WORK, WORK, WORK, WORK, MOVE],
    memory: { role: "miner__2", working: false, routeName: "miner__2" },
  },
  miner__3: {
    min: 1,
    body: [WORK, WORK, WORK, WORK, WORK, MOVE],
    memory: { role: "miner__3", working: false, routeName: "miner__3" },
  },
  builder: {
    min: 2,
    body: [
      WORK,
      WORK,
      WORK,

      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,

      MOVE,
      MOVE,
      MOVE,
      MOVE,
    ],
    memory: { role: "builder", working: false, routeName: "builder" },
  },
  upgrader: {
    min: 1,
    body: [
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,

      CARRY,
      CARRY,

      MOVE,
      MOVE,
    ],
    memory: { role: "upgrader", working: false, routeName: "upgrader" },
  },
  repairer: {
    min: 2,
    body: [WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
    memory: { role: "repairer", working: false, routeName: "repairer" },
  },
  transporter: {
    min: 2,
    body: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
    memory: {
      role: "transporter",
      working: false,
      routeName: "transporter_spawn",
    },
  },
  transporter_storage: {
    min: 0,
    body: [
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
    ],
    memory: {
      role: "transporter_storage",
      working: false,
      routeName: "container_storage",
    },
  },
  worker: {
    min: 0,
    body: [WORK, CARRY, MOVE],
    memory: { role: "worker", working: false, routeName: "worker" },
  },
  upgraderDrop: {
    min: 1,
    body: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
    memory: { role: "upgraderDrop", working: false, routeName: "upgraderDrop" },
  },
  link: {
    min: 1,
    body: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
    memory: { role: "link", working: false, routeName: "link" },
  },
  link_mineral_transfer: {
    min: 1,
    body: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
    memory: {
      role: "link_mineral_transfer",
      working: false,
      routeName: "link_mineral_transfer",
    },
  },
  link_to_storage: {
    min: 1,
    body: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
    memory: {
      role: "link_to_storage",
      working: false,
      routeName: "link_to_storage",
    },
  },
};
