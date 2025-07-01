const billboardInstances = new Map();

export class nsBillboard {
  constructor(config = {}) {
    const { containerId = 'ns-billboard' } = config;

    // Return existing instance if available
    if (billboardInstances.has(containerId)) {
      return billboardInstances.get(containerId);
    }

    // Initialize new instance
    this.config = {
      containerId,
      containerClass: config.containerClass || '',
      targetSelector: config.targetSelector || 'body',
      position: config.position || 'beforeend',
      columns: Math.max(1, parseInt(config.columns) || 1),
    };
    this.container = null;
    this.columnsContainer = null;

    // Store instance
    billboardInstances.set(containerId, this);
  }

  create() {
    // Check for existing billboard with same ID in DOM
    const existingBillboard = document.getElementById(this.config.containerId);
    if (existingBillboard) {
      this.container = existingBillboard;
      this.columnsContainer = this.container.querySelector(
        '.ns-billboard-columns',
      );
      return this.container;
    }

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
    if (!this.container && !this.create()) {
      console.error('Failed to create billboard container.');
      return null;
    }

    // Validate column index
    const validColumnIndex = Math.min(
      Math.max(0, parseInt(columnIndex) || 0),
      this.config.columns - 1,
    );

    // Get or create column container
    let column = this.columnsContainer.children[validColumnIndex];
    if (!column) {
      column = document.createElement('div');
      column.className = 'ns-billboard-column';
      this.columnsContainer.appendChild(column);
    }

    // Find or create the single content div
    let contentDiv = column.querySelector('.ns-billboard-content');
    if (!contentDiv) {
      contentDiv = document.createElement('div');
      contentDiv.className = 'ns-billboard-content';
      column.appendChild(contentDiv);
    }

    // Update content (appends to existing content)
    if (typeof content === 'string') {
      contentDiv.innerHTML += content; // Appends new content
    } else if (content instanceof Node) {
      contentDiv.appendChild(content.cloneNode(true));
    }

    return contentDiv;
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
