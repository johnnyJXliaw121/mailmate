let gapi = window.gapi


/**
 * Gets list of available lables in user's inbox in ARRAY
 * @param labelData - this is returned from getListLebelData.then((labelData)=>{})
 * @returns {Promise<Array>} Array of strings with label names
 */
export let getLabelNamesFromLabelData = (labelData) => {
    return labelData.map(labelObj=>{
        return labelObj.name
    })
}

/**
 * Returns an array of objects with Label_Name and associated Label_ID
 * @returns {Promise<labelData>}[{id: xxxxx, name: xxxxx}, ..., ...]
 */
export let getListOfLabelData = () => {
    const listPromise = new Promise(function(resolve,reject){
        getListOfLabelsRaw().then((response) => {
            resolve(response.result.labels)
        })
    })
    return listPromise
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
    return new Promise(function (resolve, reject) {
        getAllMailWithLabel(label_id).then((response) => {
            resolve(response.result.messages.map(mail=>{
                return mail.id
            }))
        }).catch(err=>{
            console.log("Error with getAllMailWithLabel in getAllMailIdWithlabel",err)
            reject([])
        })
    })
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



