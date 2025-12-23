module.exports = function countCreeps(role, routeName) {
  if (routeName) {
    return _.filter(
      Game.creeps,
      (creep) =>
        creep.memory.role === role && creep.memory.routeName === routeName
    ).length;
  }
  return _.filter(Game.creeps, (creep) => creep.memory.role === role).length;
};
