window.TerraMystica = window.TerraMystica || {};

window.TerraMystica.Modal = (() => {
  const TYPES = {
    INFO: 'info',
  };

  let animating = false;

  /**
   * Handles the click event over a modal close button
   * @param {Object=}   evt      - Click event
   * @param {Function=} callback - Callback function to be called when animation ends
   */
  const close = (evt, callback) => {
    if (typeof evt !== typeof undefined) {
      evt.preventDefault();
      evt.stopPropagation();
    }

    callback = callback || (() => {});

    if (animating === false) {
      const modal = document.getElementById('modal');

      if (modal !== null) {
        animating = true;

        modal.classList.add('anim-leave');

        modal
          .querySelector('.modal__background')
          .addEventListener('animationend', () => {
            animating = false;
            callback();
            modal.remove();
          });
      }
    }
  };

  /**
   * Shows a modal window with a custom message
   * @param {String} type - Type of the array to show
   * @param {Object} data - Custom data for the array to be filled with
   */
  const show = (type, data) => {
    const actions = {};

    actions[TYPES.INFO] = (modal) => {
      const { content } = data;

      modal.innerHTML = `
        <div class="modal__background" data-modal-close></div>
        <div class="modal__content">
          ${content}

          <button type="button" class="button button--close" data-modal-close></button>
        </div>
      `;
    };

    if (actions[type]) {
      close();

      const modal = document.createElement('aside');
      modal.id = 'modal';
      modal.className = `modal modal--${type}`;

      // Customize it
      actions[type](modal);

      // Handle clicks over the close button but also the background
      modal.querySelectorAll('[data-modal-close]').forEach((button) => {
        button.addEventListener('click', close);
      });

      // Append the modal DOM element into the document
      document.body.append(modal);
    }
  };

  return {
    TYPES,
    show,
  };
})();
