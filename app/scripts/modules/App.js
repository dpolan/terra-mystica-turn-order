window.TerraMystica = window.TerraMystica || {};

window.TerraMystica.App = (() => {
  const totalRounds = 6;
  let currentRound = 1;
  let totalPlayers = 5;
  let playersPassed = 0;

  /**
   * Navigates to the target view, making it visible
   * @param {Number} index - Index of the target view
   */
  const navigateToView = (index) => {
    const view = document.querySelector(`[data-nav-id="${index}"]`);

    if (view !== null) {
      const slider = document.getElementById('slider');
      slider.style.transform = `translateX(-${33.3 * (index - 1)}%)`;
    }
  };

  /**
   * Handles the click event over a navigation link
   * @param {Object} evt - Button click event
   */
  const onLinkClick = (evt) => {
    const link = evt.currentTarget;
    const id = link.dataset.navPage;

    // Check if we have a target id data attribute
    if (typeof id !== typeof undefined) {
      navigateToView(id);
    }
  };

  /**
   * Handles the click event over a faction on the game view
   * @param {Object} evt - Button click event
   */
  const onOrderFactionClick = (evt) => {
    const faction = evt.currentTarget;

    const columnOdd = document.querySelector('[data-order-col="odd"]');
    const columnEven = document.querySelector('[data-order-col="even"]');

    // Check if the current round is an odd or even number
    const isEven = currentRound % 2 === 0;
    const clone = faction.cloneNode(true);
    clone.addEventListener('click', onOrderFactionClick);
    clone.classList.add('is-inactive');

    // Hide the faction
    faction.classList.add('is-invisible');

    // Add a copy of the faction on the opposing column
    const targetCol = isEven ? columnOdd : columnEven;

    targetCol.append(clone);
    playersPassed += 1;

    // Check if all the factions have already passed
    if (playersPassed === totalPlayers) {
      currentRound += 1;
      playersPassed = 0;

      // Make the current round visible
      document
        .querySelector('[data-round-index].is-active')
        .classList.remove('is-active');

      const targetRound = document.querySelector(
        `[data-round-index="${currentRound}"]`
      );

      if (targetRound !== null) {
        targetRound.classList.add('is-active');
      }

      // Remove invisible elements
      document
        .querySelectorAll('[data-order-faction].is-invisible')
        .forEach((element) => {
          element.remove();
        });

      // Activate inactive elements
      document
        .querySelectorAll('[data-order-faction].is-inactive')
        .forEach((element) => {
          element.classList.remove('is-inactive');
        });

      // Check if the game has ended
      if (currentRound > totalRounds) {
        navigateToView(2);
        currentRound = 1;
        // totalPlayers = 0;
      }
    }
  };

  /**
   * Initializes the module
   */
  const init = () => {
    // Configure navigation links
    const links = document.querySelectorAll('[data-nav-page]');

    links.forEach((element) => {
      element.addEventListener('click', onLinkClick);
    });

    // TODO: Make this check only when factions are added to third view
    const orderFactions = document.querySelectorAll('[data-order-faction]');

    orderFactions.forEach((element) => {
      element.addEventListener('click', onOrderFactionClick);
    });
  };

  return {
    init,
  };
})();
