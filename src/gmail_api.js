import base64 from 'base-64'
import base64js from 'base64-js'

let gapi = window.gapi

export let getListOfUnreadMails = () => {
    return gapi.client.gmail.users.messages.list({
        'userId': 'me',
        'q': 'is:unread'
    })
}

// @param id = string - ID of a particular email
export let getMailFromId = (id) => {
    return gapi.client.gmail.users.messages.get({
        'userId': 'me',
        'id': id,
        'format': 'full'
    })
}

/**
 * The below API's extract useful information from the JSON object for a specific email Resposne
 * @param response
 */
export let getEmailBodyFromEmailResponse = (response) => {
    let encodedMsgArray = JSON.parse(response.body).payload.parts.map((obj) => {
        return obj.body.data
    })
    let emailBody = base64.decode(encodedMsgArray[0])
    return emailBody
}

export let getSubjectFromEmailResponse = (response) => {
    return JSON.parse(response.body).payload.headers[19]
}

export let getSenderFromEmailResponse = (response) => {
    return JSON.parse(response.body).payload.headers[16]
}

export let getSnippetFromEmailResponse = (response) => {
    return response.result.snippet
}