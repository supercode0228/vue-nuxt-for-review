export const workers = state => state.workers;

export const isSingleManTeam = (state, getters, rootState) => {
  const workersCount = getters.workers.length;

  if (workersCount > 1) return false;

  const workerId = (getters.workers.length) ? getters.workers[0].id : '';
  const userId = rootState.user.id;

  if (workerId === userId) return true;

  return false;
};

export const personalProfile = state => state.personalProfile;
