window.TerraMystica = window.TerraMystica || {};

window.TerraMystica.App = (() => {
  const { gsap, Power4 } = window;

  const TOTAL_ROUNDS = 6;
  const MAX_PLAYERS = 5;

  let currentRound = 1;
  let selectedFactions = [];
  let playersPassed = 0;
  let currentView = 1;

  /**
   * Configures the current view behavior
   */
  const configureCurrentView = () => {
    const { Utils } = window.TerraMystica;

    const actions = {};

    // Faction selection
    actions[2] = () => {
      // Empty the selected faction array
      selectedFactions = [];
      updateTotalPlayerCount();

      // Add listeners for the factions being selected
      document.querySelectorAll('[data-faction-select]').forEach((button) => {
        button.classList.remove('is-active');
        button.removeEventListener('click', onFactionSelectClick);
        button.addEventListener('click', onFactionSelectClick);
      });
    };

    // Turn order
    actions[3] = () => {
      // Empty the faction turn orders
      let orderFactions = document.querySelectorAll('[data-order-faction]');

      orderFactions.forEach((element) => {
        element.remove();
      });

      // Randomize selected factions
      Utils.shuffle(selectedFactions);

      // Insert a faction turn order for each selected faction on previous step
      const col = document.querySelector('[data-order-col="odd"]');

      selectedFactions.forEach((faction) => {
        const turnOrderElement = document.createElement('button');
        turnOrderElement.type = 'button';
        turnOrderElement.classList.add('faction', `faction--${faction.slug}`);
        turnOrderElement.dataset.orderFaction = '';
        turnOrderElement.textContent = faction.name;

        col.append(turnOrderElement);
      });

      orderFactions = document.querySelectorAll('[data-order-faction]');

      orderFactions.forEach((element) => {
        element.removeEventListener('click', onOrderFactionClick);
        element.addEventListener('click', onOrderFactionClick);
      });

      currentRound = 1;

      const targetRound = document.querySelector(
        `[data-round-index="${currentRound}"]`
      );

      targetRound.classList.add('is-active');
    };

    if (actions[currentView]) {
      actions[currentView]();
    }
  };

  /**
   * Search for a faction with the given slug
   * @param   {String} slug - Identifier of the target faction
   * @returns {Object}      - Data object for the found faction
   */
  const findSelectedFactionBySlug = (slug) => {
    for (let i = 0, l = selectedFactions.length; i < l; i += 1) {
      const faction = selectedFactions[i];

      if (faction.slug === slug) {
        return faction;
      }
    }

    return null;
  };

  /**
   * Search for a faction with the given color
   * @param   {String} color - Color of the target faction
   * @returns {Object}       - Data object for the found faction
   */
  const findSelectedFactionByColor = (color) => {
    for (let i = 0, l = selectedFactions.length; i < l; i += 1) {
      const faction = selectedFactions[i];

      if (faction.color === color) {
        return faction;
      }
    }

    return null;
  };

  /**
   * Removes a faction with the given slug
   * @param  {String} slug - Identifier of the target faction
   */
  const removeSelectedFactionBySlug = (slug) => {
    selectedFactions = selectedFactions.filter((faction) => {
      return faction.slug !== slug;
    });
  };

  /**
   * Creates a copy of the target faction
   * @param  {String} slug - Identifier of the target faction
   * @return {Object}
   */
  const getFactionCloneBySlug = (slug) => {
    const { FACTIONS } = window.TerraMystica;

    for (let i = 0, l = FACTIONS.length; i < l; i += 1) {
      const faction = FACTIONS[i];

      if (faction.slug === slug) {
        return { ...faction };
      }
    }

    return null;
  };

  /**
   * Updates the total player value from the DOM counter element
   */
  const updateTotalPlayerCount = () => {
    const counter = document.querySelector('[data-number-players]');

    counter.innerHTML = selectedFactions.length;
  };

  /**
   * Handles the click event over a faction selection button
   * @param {Object} evt - Click event
   */
  const onFactionSelectClick = (evt) => {
    const button = evt.currentTarget;
    const slug = button.dataset.factionSelect;

    // Check if the current faction is already action
    const faction = findSelectedFactionBySlug(slug);

    if (faction === null) {
      const clone = getFactionCloneBySlug(slug);

      // Check if another faction of the same color is selected
      const existingColoredFaction = findSelectedFactionByColor(clone.color);

      // If it is, uncheck it
      if (existingColoredFaction !== null) {
        removeSelectedFactionBySlug(existingColoredFaction.slug);
        document
          .querySelector(
            `[data-faction-select="${existingColoredFaction.slug}"]`
          )
          .classList.remove('is-active');
      }

      // Check if we are already at max player count
      if (selectedFactions.length < MAX_PLAYERS) {
        // Mark current faction as active
        button.classList.add('is-active');

        selectedFactions.push(clone);
      }
    } else {
      removeSelectedFactionBySlug(slug);

      // Mark current faction as inactive
      button.classList.remove('is-active');
    }

    // Update total player count
    updateTotalPlayerCount();
  };

  /**
   * Navigates to the target view, making it visible
   * @param {Number} index - Index of the target view
   */
  const navigateToView = (index) => {
    const view = document.querySelector(`[data-nav-id="${index}"]`);

    if (view !== null) {
      const currentContent = document.querySelector(
        `[data-nav-id="${currentView}"] .view__content`
      );
      const targetContent = view.querySelector('.view__content');

      gsap.to(currentContent, {
        duration: 0.8,
        scale: 1.04,
        ease: Power4.easeInOut,
        clearProps: 'all',
      });

      gsap.from(targetContent, {
        duration: 0.8,
        delay: 0.2,
        scale: 1.04,
        ease: Power4.easeInOut,
      });

      const slider = document.getElementById('slider');
      slider.style.transform = `translateX(-${33.3 * (index - 1)}%)`;

      currentView = index;

      configureCurrentView();
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
    if (playersPassed === selectedFactions.length) {
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
      if (currentRound > TOTAL_ROUNDS) {
        navigateToView(2);
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
  };

  return {
    init,
  };
})();
