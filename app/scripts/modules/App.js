window.TerraMystica = window.TerraMystica || {};

window.TerraMystica.App = (() => {
  /**
   * Handles the click event over a navigation link
   * @param {Object} evt - Button click event
   */
  const onLinkClick = (evt) => {
    const link = evt.currentTarget;
    const id = link.dataset.navPage;

    // Check if we have a target id data attribute
    if (typeof id !== typeof undefined) {
      const view = document.querySelector(`[data-nav-id="${id}"]`);

      if (view !== null) {
        const slider = document.getElementById('slider');
        slider.style.transform = `translateX(-${33.3 * (id - 1)}%)`;
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
