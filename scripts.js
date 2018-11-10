// const API_URL = '/example.json?domain=';

const API_URL = 'https://apis.is/isnic?domain=';



/**
* Leit að lénum á Íslandi gegnum apis.is
*/
const program = (() => {
  let domains;

  function displayError(error) {
    const container = domains.querySelector('.results');

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(document.createTextNode(error));
  }

  function elementCreation(propList, stringList) {
    const dl = document.createElement('dl');

    let i;
    for (i = 0; i < stringList.length; i += 1) {
      if (propList[i].length !== 0) {
        const domainElement = document.createElement('dt');
        domainElement.appendChild(document.createTextNode(stringList[i]));
        dl.appendChild(domainElement);

        const domainValueElement = document.createElement('dd');
        domainValueElement.appendChild(document.createTextNode(propList[i]));
        dl.appendChild(domainValueElement);

        const container = domains.querySelector('.results');

        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }
        container.appendChild(dl);
      }
    }
  }

  function displayDomain(domainsList) {
    if (domainsList.length === 0) {
      displayError('Fann ekki lén');
      return;
    }

    const [{
      domain, registered, lastChange, expires, registrantname, email, address,
      country
    }] = domainsList;

    const stringList = ['Lén', 'Skráð', 'Seinast breytt', 'Rennur út',
      'Skráningaraðili', 'Netfang', 'Heimilisfang', 'Land'];

    const registeredDate = new Date(registered);
    const registeredISO = registeredDate.toISOString().split('T')[0];

    const lastChangeDate = new Date(lastChange);
    const lastChangeISO = lastChangeDate.toISOString().split('T')[0];

    const expiresDate = new Date(expires);
    const expiresISO = expiresDate.toISOString().split('T')[0];

    const propList = [domain, registeredISO, lastChangeISO, expiresISO,
      registrantname, email, address, country];

    elementCreation(propList, stringList);
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
    domains = _domains;

    const form = domains.querySelector('form');
    form.addEventListener('submit', onSubmit);
  }

  return {
    init,
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  const domains = document.querySelector('.domains');

  program.init(domains);
});
