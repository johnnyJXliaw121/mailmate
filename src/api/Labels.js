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

/**
 * Gets the label of an email from email ID
 * @param id - id of an email. does not being with an 'r'
 */
export let getLabelFromId = (id) => {

}

export let getAllMailWithLabel = (label) => {

}

export let updateLabelForMail = (id, label) => {

}