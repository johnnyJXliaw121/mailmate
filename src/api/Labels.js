let gapi = window.gapi


/**
 * Gets list of available lables in user's inbox in ARRAY
 * @returns {*}
 */
export let getListOfLabelNames = () => {
    let labels = []
    getListOfLabelsRaw().then((response) => {
        response.result.labels.forEach((labelObj) => {
            labels.push(labelObj.name)
        })
    })
    return labels
}

/**
 * Returns an array of objects with Label_Name and associated Label_ID
 * @returns [{id: xxxxx, name: xxxxx}, ..., ...]
 */
export let getListOfLabelData = () => {
    var data = []
    getListOfLabelsRaw().then((response) => {
        response.result.labels.forEach((label) => {
            data.push(label)
        })
    })
    return data
}

/**
 * Gets list of available lables in user's inbox in RAW format.
 * @returns {*}
 */
export let getListOfLabelsRaw = () => {
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

/**
 * returns the id and thread_id of emails with a specific label_id
 * @param label_id
 * @returns {Array}
 */
export let getAllMailIdWithlabel = (label_id) => {
    let ids = []
    getAllMailWithLabel(label_id).then((response) => {
        response.result.messages.forEach((mail) => {
            ids.push(mail)
        })
    })
    return ids
}

/**
 * gets raw data of all mails with a specific label_id
 * @param label_id
 * @returns {*}
 */
export let getAllMailWithLabel = (label_id) => {
    return gapi.client.gmail.users.messages.list({
        'userId': 'me',
        'labelIds': label_id
    })
}

/**
 * Assign a label_id to a specific mail_id
 * @param label_id = array of string of label_id's
 * @param mail_id
 * @returns {*}
 */
export let assignLabelToMail = (label_id, mail_id) => {
    return gapi.client.gmail.users.messages.modify({
        'userId': 'me',
        'id': mail_id,
        'addLabelIds': label_id
    })
}

/**
 * Removes a specific label from a mail
 * @param label_id
 * @param mail_id
 * @returns {*}
 */
export let removeLabelFromMail = (label_id, mail_id) => {
    return gapi.client.gmail.users.messages.modify({
        'userId': 'me',
        'id': mail_id,
        'removeLabelIds': label_id
    })
}

export let createNewLabel = (label_name) => {
    return gapi.client.gmail.users.labels.create({
        'userId': 'me',
        'label': {
            'name': label_name
        }
    })
}



