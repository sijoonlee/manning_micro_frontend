function downloadDocument(url, timeoutMs = 5000){
    url = url + '/index.html'
    const request = new XMLHttpRequest();
    request.timeout = timeoutMs;
    request.responseType = 'document';

    return new Promise((resolve, reject) => {
        request.onerror = () => reject(new Error(`An error occurred while downloading ${url}`));
        request.ontimeout = () => reject(new Error(`The following request did timeout: ${url}`));

        request.onload = () => {
            if (request.status >= 400) {
                reject(new Error(`Received HTTP Status ${request.status} for ${url}`));
            }
            resolve(request.response);
        };

        request.open('GET', url);
        request.send();
    });
};

function getUrlFromPathname(pathname = window.location.pathname) {
    console.log("browser currently on", pathname)
    const [ , microFrontendId ] = pathname.split('/');
    const microFrontends = [
        {
            name: 'welcome',
            pathnameId: 'hello',
        },
        {
            name: 'music',
            pathnameId: 'play'
        },
    ]
    const microFrontend = microFrontends.find(microFrontend => microFrontend.pathnameId === microFrontendId);

    if (!microFrontend) {
        console.log("Can't find microFrontend")
        return;
    }

    return `/mfe/${microFrontend.name}`
}

function moveNodeToDocument(parent, document) {
    return function moveNode(node) {
        // Cloning or Adopting <scripts> nodes doesn't re-evaluate them
        // Read more here: https://stackoverflow.com/questions/28771542/why-dont-clonenode-script-tags-execute
        if (node.tagName === 'SCRIPT') {
            const clonedNode = document.createElement(node.tagName);

            [...node.attributes].forEach(attribute => clonedNode.setAttribute(attribute.name, attribute.value));
            clonedNode.innerHTML = node.innerHTML;

            parent.appendChild(clonedNode);
            return;
        }

        const adoptedNode = document.adoptNode(node);
        parent.appendChild(adoptedNode);
    }
}

function addOrUpdateBaseTag(url) {
    const baseElement = document.createElement('base');
    baseElement.setAttribute('href', url);
    document.head.appendChild(baseElement);
}

function mount(url, microFrontendDocument) {
    addOrUpdateBaseTag(url)

    const microFrontendHeadNodes = microFrontendDocument.querySelectorAll('head>*');
    const microFrontendBodyNodes = microFrontendDocument.querySelectorAll('body>*');

    microFrontendHeadNodes.forEach(moveNodeToDocument(document.head, document))
    microFrontendBodyNodes.forEach(moveNodeToDocument(document.body, document))
}


// const url = getUrlFromPathname();
// console.log(url)

// downloadDocument(getUrlFromPathname())
//     .then(doc => mount(url, doc))
downloadDocument("music").then(doc => mount("music", doc))