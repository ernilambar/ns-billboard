export class nsBillboard {
  constructor({
    containerId = 'ns-billboard',
    containerClass = '',
    targetSelector = 'body',
    position = 'beforeend',
    columns = 1,
  } = {}) {
    // Configuration object stores all settings with defaults.
    this.config = {
      containerId,
      containerClass,
      targetSelector,
      position,
      columns: Math.max(1, parseInt(columns) || 1), // Ensures at least 1 column.
    };
    this.container = null;
    this.columnsContainer = null;
  }

  create() {
    // Returns existing container if already created.
    if (this.container) return this.container;

    // Creates main container element.
    this.container = document.createElement('div');
    this.container.id = this.config.containerId;
    // Combines base class with any custom classes provided.
    this.container.className =
      `ns-billboard ${this.config.containerClass}`.trim();

    // Creates columns wrapper with grid layout.
    this.columnsContainer = document.createElement('div');
    this.columnsContainer.className = 'ns-billboard-columns';
    this.columnsContainer.style.display = 'grid';
    // Sets grid columns based on configuration.
    this.columnsContainer.style.gridTemplateColumns = `repeat(${this.config.columns}, 1fr)`;
    this.columnsContainer.style.gap = '16px';

    this.container.appendChild(this.columnsContainer);

    // Finds target element in DOM.
    const targetElement = document.querySelector(this.config.targetSelector);
    if (!targetElement) {
      console.error(`Target element not found: ${this.config.targetSelector}`);
      return null;
    }

    // Validates position parameter.
    const validPositions = [
      'beforebegin',
      'afterbegin',
      'beforeend',
      'afterend',
    ];
    const insertPosition = validPositions.includes(this.config.position)
      ? this.config.position
      : 'beforeend';

    // Inserts billboard at specified position relative to target.
    targetElement.insertAdjacentElement(insertPosition, this.container);
    return this.container;
  }

  addContent(content, columnIndex = 0) {
    // Creates container if it doesn't exist.
    if (!this.container && !this.create()) {
      console.error('Failed to create billboard container.');
      return null;
    }

    // Validates and normalizes column index.
    const validColumnIndex = Math.min(
      Math.max(0, parseInt(columnIndex) || 0),
      this.config.columns - 1,
    );

    // Creates content node.
    const contentNode = document.createElement('div');
    contentNode.className = 'ns-billboard-content';
    contentNode.innerHTML = content;

    // Gets or creates column container.
    let column = this.columnsContainer.children[validColumnIndex];
    if (!column) {
      column = document.createElement('div');
      column.className = 'ns-billboard-column';
      this.columnsContainer.appendChild(column);
    }

    column.appendChild(contentNode);
    return contentNode;
  }

  clear() {
    // Clears all content from columns container.
    if (this.columnsContainer) {
      this.columnsContainer.innerHTML = '';
    }
  }

  destroy() {
    // Removes billboard from DOM completely.
    if (this.container) {
      this.container.remove();
      this.container = null;
      this.columnsContainer = null;
    }
  }
}
