window.TerraMystica = window.TerraMystica || {};

window.TerraMystica.Utils = (() => {
  /**
   * Shuffles the elements of the given array
   * @param   {Object} array - Array to be shuffled
   * @returns {Object}
   */
  const shuffle = (array) => {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  };

  return {
    shuffle,
  };
})();
