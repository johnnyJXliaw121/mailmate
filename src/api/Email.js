import base64 from "base-64";
import base64url from 'base64url'
import btoa from 'btoa'

let gapi = window.gapi

/**
 * Gets list of unread emails in the user's inbox
 * @returns {*}
 */
export let getListOfUnreadMails = () => {
    return gapi.client.gmail.users.messages.list({
        'userId': 'me',
        'q': 'is:unread'
    })
}

/**
 * Gets list of urnead email ID's from raw output of getListOfUnreadMails
 * @param response - raw ouput from getListOfUnreadMails
 * @returns {Array} - array of unread email ID's
 */
export let getIdsFromUnreadList = (response) => {
    let id = []
    response.result.messages.forEach((obj) => {
        id.push(obj.id)
    })
    return id
}

/**
 * Gets the metadata/data for a specific unread email
 * @param id - id of the email
 * @returns {*}
 */
export let getMailFromId = (id) => {
    return gapi.client.gmail.users.messages.get({
        'userId': 'me',
        'id': id,
        'format': 'full'
    })
}

export let sendEmail = (emailBody) => {
    // let encodedEmailBody = base64url(emailBody)
    let encodedEmailBody = emailBody.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
    return gapi.client.gmail.users.messages.send({
        'userId': 'me',
        'resource': {
            'raw': encodedEmailBody
        }
    })
}
/**
 * Gets email body for an email id
 * @param response - output from getMailFromId
 */
export let getEmailBodyFromEmailResponse = (response) => {
    let encodedMsgArray = JSON.parse(response.body).payload.parts.map((obj) => {
        return obj.body.data
    })
    let emailBody = base64.decode(encodedMsgArray[0])
    return emailBody
}

/**
 * gets the subject from an email id
 * @param response - raw output from getMailFromId
 * @returns {*}
 */
export let getSubjectFromEmailResponse = (response) => {
    return JSON.parse(response.body).payload.headers[19]
}

/**
 * Gets the sender information from an email id
 * @param response - raw output from getMailFromid
 * @returns {*}
 */
export let getSenderFromEmailResponse = (response) => {
    return JSON.parse(response.body).payload.headers[16]
}

/**
 * Gets snippet from email id
 * @param response - raw output from an email ID
 * @returns {*}
 */
export let getSnippetFromEmailResponse = (response) => {
    return response.result.snippet
}