module.exports.routesConfig = {
  // Define your routes here
  transporter: {
    role: "transporter",
    from: {
      type: "container",
      filter: {
        storeType: RESOURCE_ENERGY,
        minAmount: 50,
        containerId: "69342f72224c1c2d0506f434",
      },
    },
    to: {
      type: "spawn_or_extension",
    },
  },
  transporter_storage: {
    role: "transporter",
    from: {
      type: "container",
      filter: {
        storeType: RESOURCE_ENERGY,
        minAmount: 50,
        containerId: "69317cab5aa32a0b2555ee88",
      },
    },
    to: {
      type: "storage",
    },
  },
  worker: {
    role: "worker",
    from: {
      type: "container",
      filter: {
        storeType: RESOURCE_ENERGY,
        minAmount: 50,
        containerId: "69317cab5aa32a0b2555ee88",
      },
    },
    to: {
      type: "spawn_or_extension",
    },
  },
  miner_1: {
    role: "miner__1",
    from: {
      type: "source",
      filter: {
        sourceId: "5bbcb0549099fc012e63bf76",
      },
    },
    to: {
      type: "container",
      filter: {
        containerId: "69314eec6d558e397181bcf5",
      },
    },
  },
  link: {
    role: "link",
    from: {
      type: "container",
      filter: {
        storeType: RESOURCE_ENERGY,
        minAmount: 50,
        containerId: "69342f72224c1c2d0506f434",
      },
    },
    to: {
      type: "link",
      filter: {
        linkId: "69367a9aea5febcd2c2c76dd",
      },
    },
  },
  link_to_storage: {
    role: "link_to_storage",
    from: {
      type: "link",
      filter: {
        linkId: "69366eea6adca2e6f4321e4e",
      },
    },
    to: {
      type: "storage",
    },
  },
};
