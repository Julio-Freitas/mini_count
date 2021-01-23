// @ts-nocheck
(() => {
  const BTN_RESET = 'resetButton';
  const ID_COUNT = 'count';
  const VALUE_COUNT = 100;
  const INTERVAL = 10;
  const $ = el => document.querySelector(el);

  class CountComponent {
    constructor() {
      this.init();
    }

    prepareCountProxy() {
      const handle = {
        set: (curentContext, propertyKey, newValue) => {
          console.log(curentContext, propertyKey, newValue);

          if (!curentContext.value) curentContext.effectStop();

          curentContext[propertyKey] = newValue;
          return true;
        }
      };

      const count = new Proxy(
        {
          value: VALUE_COUNT,
          effectStop: () => {}
        },
        handle
      );

      return count;
    }

    scheduleStopCount({ elmentCount, id_interval }) {
      return () => {
        clearInterval(id_interval);
        elmentCount.innerHTML = '';
        // @ts-ignore
        this.disableButton(false);
      };
    }

    updatedtext = ({ elmentCount, count }) => () => {
      const defaultText = `Começando em <strong>${count.value--}</strong> segundos...`;
      elmentCount.innerHTML = defaultText;
    };

    prepareButton(elementButton, initFunction) {
      elementButton.addEventListener('click', initFunction.bind(this));
      return (value = true) => {
        const attr = 'disabled';
        if (value) {
          elementButton.setAttribute(attr, value);
          return;
        }
        elementButton.removeAttribute(attr);
      };
    }

    reset = () => this.init();
    init() {
      const elmentCount = $(`#${ID_COUNT}`);
      const count = this.prepareCountProxy();
      const argumentsValue = {
        elmentCount,
        count
      };
      const fnClosure = this.updatedtext(argumentsValue);
      const id_interval = setInterval(fnClosure, INTERVAL);

      {
        const argumentsValue = { elmentCount, id_interval };
        const disableButton = this.prepareButton($(`#${BTN_RESET}`), this.init);
        disableButton();
        const stopCountFn = this.scheduleStopCount.apply({ disableButton }, [
          argumentsValue
        ]);

        count.effectStop = stopCountFn;
      }
    }
  }

  window.CountComponent = CountComponent;
})();
