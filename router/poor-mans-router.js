class PoorMansRouter {

  /**
   * @constructor
   * @param {Object} [options]
   * @param {String} [options.routableClass]
   * @param {String[]} [options.selectedClasses]
   * @param {String} [options.title]
   * @param {String} [options.titleSeparator]
   * @return {PoorMansRouter}
   */
  constructor(options = {}) {
    const defaults = {
      routableClass: 'routable',
      selectedClasses: ['selected'],
      title: 'Poor Man\'s Router',
      titleSeparator: ' | '
    }
    this.options = Object.assign({}, defaults, options)
    this.routableElements = document.querySelectorAll(`.${this.options.routableClass}`)
    this.routableElements.forEach(routableElement => {
      routableElement.addEventListener('click', this.clickEventHandler.bind(this))
    })
    window.addEventListener('popstate', this.popStateEventHandler.bind(this))
  }

  /**
   * @param {HTMLElement} element
   * @return {undefined}
   */
  selectElement(element) {
    this.routableElements.forEach(routableElement => routableElement.classList.remove(...this.options.selectedClasses))
    element.classList.add(...this.options.selectedClasses)
  }

  /**
   * @param {String} title
   * @return {undefined}
   */
  setTitle(title) {
    document.title = [this.options.title, title]
                       .filter(piece => piece) // Get rid of falsey stuff (null, undefined, '', etc.)
                       .join(this.options.titleSeparator)
  }

  /**
   * @param {MouseEvent} mouseEvent
   * @return {undefined}
   */
  clickEventHandler(mouseEvent) {
    mouseEvent.preventDefault()
    const { id, dataset, classList } = mouseEvent.target
    let { pathname } = mouseEvent.target
    if (!this.elementIsAnchor(mouseEvent.target)) {
      pathname = this.buildUrl(mouseEvent.target)
    }
    const state = { id }
    this.selectElement(mouseEvent.target)
    this.setTitle(dataset.title)
    window.history.pushState(state, '', pathname)
  }

  /**
   * @param {PopStateEvent} popStateEvent
   * @return {undefined}
   */
  popStateEventHandler(popStateEvent) {
    if (!popStateEvent.state) return
    const element = document.querySelector(`#${popStateEvent.state.id}`)
    this.selectElement(element)
    this.setTitle(element.dataset.title)
  }

  /**
   * @param {HTMLElement} element
   * @return {String}
   */
  buildUrl(element) {
    const url = element.dataset.href
    return url
  }

  /**
   * @param {HTMLElement} element
   * @return {Boolean}
   */
  elementIsAnchor(element) {
    return element.tagName === 'A'
  }

}
