const History = function () {
  let states = [],
    stateId = -1;
  return {
    getStateId: function () {
      return stateId;
    },
    getLength: function () {
      return states.length;
    },
    saveState: function (state) {
      state = JSON.stringify(state);
      if (stateId > -1) {
        states = states.slice(0, stateId + 1);
      }
      states.push(state);
      stateId++;
    },
    clearStates: function () {
      states = [];
      stateId = -1;
    },
    nextState: function () {
      stateId =
        stateId + 1 < states.length - 1 ? stateId + 1 : states.length - 1;
      return JSON.parse(states[stateId]);
    },
    prevState: function () {
      console.log(stateId, states);
      stateId = stateId - 1 > -1 ? stateId - 1 : 0;
      return JSON.parse(states[stateId]);
    },
    currentState: function () {
      return JSON.parse(states[stateId]);
    },
  };
};

export default History;
