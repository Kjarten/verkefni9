// const API_URL = '/example.json?domain=';
const API_URL = 'https://apis.is/isnic?domain=';

document.addEventListener('DomContentLoaded', () => {
  const domains = document.querySelector('.domains');

  program.init(domains);
});
/**
* Leit að lénum á Íslandi gegnum apis.is
*/
const program = (() => {
  let domains;

  function displayDomain(domainsList) {
    if (domainsList.length === 0) {
      displayError('Fann ekki lén');
      return;
    }

    const [{ domain, registered, lastChange, expires }] = domainsList;

    const dl = document.createElement('dl');

    const domainElement = document.createElement('dt');
    domainElement.appendChild(document.createTextNode('Lén'));
    dl.appendChild(domainElement);

    const domainValueElement = document.createElement('dd');
    domainValueElement.appendChild(document.createTextNode(domain));
    dl.appendChild(domainValueElement);

    const container = domains.querySelector('.results');

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    // registrantname: (fields.find(x => x.label === 'Registrant name:') || { val: '' }).val,
    // address: (fields.find(x => x.label === 'Address:') || { val: '' }).val,
    // country: (fields.find(x => x.label === 'Country:') || { val: '' }).val,
    // email: (fields.find(x => x.label === 'E-mail:') || { val: '' }).val,
  }

  function displayError(error) {
    const container = domains.querySelector('.results');

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(document.createTextNode(error));
  }

  function fetchData(domain) {
    fetch(`${API_URL}${domain}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Villa kom upp');
      })
      .then((data) => {
        displayDomain(data.results);
      })
      .catch((error) => {
        displayError('Villa!');
        console.error(error);
      })
  }

  function onSubmit(e) {
    e.preventDefault();
    const input = e.target.querySelector('input');

    // TODO höndla tómastreng

    fetchData(input.value);
  }

  function init(_domains) {
    domains = _domains

    const form = domains.querySelector('form');
    form.addEventListener('submit', onSubmit);
  }

  return {
    init,
  };
})();

//document.addEventListener('DOMContentLoaded', () => {
//  program.init(domains);
//});
