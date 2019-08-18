import base64 from "base-64";

let gapi = window.gapi

/**
 * Gets the list of draft emails from gmail api, along with all metadata/data
 * @returns {*}
 */
export let getListOfDraftMails = () => {
    return gapi.client.gmail.users.drafts.list({
        'userId': 'me'
    })
}

/**
 * Gets the list of draft email ID's from getListOfDraftMails
 * @param response - raw output from getListOfDraftMails
 * @returns {Array} - array of draft email ID's
 */
export let getIdsFromDraftList = (response) => {
    let id = []
    response.result.drafts.forEach((obj) => {
        id.push(obj.id)
    })
    return id
}

/**
 * Gets the metadata/data associated with a specific draft email
 * @param id - id of a specific draft email in string format
 * @returns {*}
 */
export let getDraftFromId = (id) => {
    return gapi.client.gmail.users.drafts.get({
        'userId': 'me',
        'id': id,
        'format': 'full'
    })
}

/**
 * Gets the body content of a specific draft email
 * @param response - raw output from getDraftFromId
 * @returns {Array} - decoded body in string format
 */
export let getBodyFromDraftResponse = (response) => {
    let encodedMsg = JSON.parse(response.body).message.payload.parts[0].body.data
    encodedMsg = encodedMsg.replace(/-/g, '+') // replace '-' with '+'
    encodedMsg = encodedMsg.replace(/_/g, '/') // replcae '_' with '/'
    return base64.decode(encodedMsg)
}

/**
 * Gets the subject header of a specific draft email
 * @param response - raw output from getDraftFromId
 * @returns {*}
 */
export let getSubjectFromDraftResponse = (response) => {
    return JSON.parse(response.body).message.payload.headers[5].value
}

/**
 * Gets the sender information of a specific draft email
 * @param response - the raw output from getDraftFromId
 * @returns {*}
 */
export let getSenderFromDraftResponse = (response) => {
    return JSON.parse(response.body).message.payload.headers[5].value
    // return JSON.parse(response.body)
}