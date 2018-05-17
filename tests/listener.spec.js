import Listener from '../src/listener';

describe('Listener', () => {
  class ListenerClass extends Listener() {
    constructor() {
      super();
      this._document = window.document;
    }
  }
  class CustomListener extends Listener(Array) {}

  describe('constructor', () => {
    it('extends EventTarget if available', () => {
      const listener = new ListenerClass();
      expect(listener instanceof EventTarget).toBe(true);
    });

    it('uses a workaround if exending EventTarget is not possible', () => {
      const listener = new CustomListener();
      expect(listener instanceof EventTarget).toBe(false);
      expect(listener[Symbol.for('c_fragment')] instanceof DocumentFragment).toBe(true);
      expect(typeof listener.addEventListener === 'function').toBe(true);
      expect(typeof listener.removeEventListener === 'function').toBe(true);
      expect(typeof listener.dispatchEvent === 'function').toBe(true);
    });
  });

  describe('addEventListener', () => {
    it('attaches an event listener to EventTarget', () => {
      const spy = jest.fn();
      const listener = new ListenerClass();
      const event = new CustomEvent('a');
      listener.addEventListener('a', spy);
      listener.dispatchEvent(event);
      expect(spy).toBeCalled();
      expect(spy.mock.calls).toEqual([[event]]);
    });
    it('attaches an event listener to fragment', () => {
      const listener = new CustomListener();
      listener[Symbol.for('c_fragment')].addEventListener = jest.fn();
      listener.addEventListener(1, 2, 3);
      expect(listener[Symbol.for('c_fragment')].addEventListener.mock.calls).toEqual([[1, 2, 3]]);
    });
  });

  describe('removeEventListener', () => {
    it('removes an event listener from EventTarget', () => {
      const spy = jest.fn();
      const listener = new ListenerClass();
      const event = new CustomEvent('a');
      listener.addEventListener('a', spy);
      listener.dispatchEvent(event);
      listener.removeEventListener('a', spy);
      listener.dispatchEvent(new CustomEvent('a'));
      expect(spy.mock.calls).toEqual([[event]]);
    });
    it('removes an event listener from fragment', () => {
      const listener = new CustomListener();
      listener[Symbol.for('c_fragment')].removeEventListener = jest.fn();
      listener.removeEventListener(1, 2, 3);
      expect(listener[Symbol.for('c_fragment')].removeEventListener.mock.calls).toEqual([[1, 2, 3]]);
    });
  });

  describe('dispatchEvent', () => {
    it('dispatches an event', () => {
      const listener = new CustomListener();
      const event = new CustomEvent('a');
      listener[Symbol.for('c_fragment')].dispatchEvent = jest.fn();
      listener.dispatchEvent(event);
      expect(listener[Symbol.for('c_fragment')].dispatchEvent.mock.calls).toEqual([[event]]);
    });
  });
});
