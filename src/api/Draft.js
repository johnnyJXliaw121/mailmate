import base64 from "base-64";
import base64url from "base64url";

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
 * Creates a draft email
 * @param draftBody - in ascii plain text (normal english)
 * @returns {*}
 */
export let createDraftMail = (from, to, subject, message) => {
    // let encodedEmailBody = base64url(emailBody)
    let email = "From: "
    email += email + from + "\r\n" + "To: " + to + "\r\n" + "Subject: " + subject + "\r\n\r\n" + message
    console.log(email)
    email = base64url(email)

    let encodedEmailBody = email.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
    return gapi.client.gmail.users.drafts.create({
        'userId': 'me',
        'resource': {
            'message': {
                'raw': encodedEmailBody
            }
        }
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
        'format': 'raw'
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

/**
 * gets text info such as sender, subject, message id, body, from draft response
 * @param response - raw output from getDraftFromId
 * @returns {string} - string of info, regex needed
 */
// NOTES: works best with shorter drafts - regex still needed to separate subject, sending to, and body
export let getTextFromDraftMailById = (response) => {
    response = response.result.message.raw.replace(/-/g, '+').replace(/_/g, '/')
    let decoded = base64url.decode(response)
    return decoded
}

