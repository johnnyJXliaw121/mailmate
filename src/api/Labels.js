let gapi = window.gapi

/**
 * Gets list of available lables in user's inbox
 * @returns {*}
 */
export let getListOfLabels = () => {
    return gapi.client.gmail.users.labels.list({
        'userId': 'me'
    })
}