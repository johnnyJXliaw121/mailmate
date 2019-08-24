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
export let getEmailRawFromId = (id) => {
    return gapi.client.gmail.users.messages.get({
        'userId': 'me',
        'id': id,
        'format': 'full'
    })
}

/**
 * Gets the payload of a specific email
 * @param payload - full email message data
 * @returns {Array} - decoded body in JSON format
 */
const getJsonFromEmailResponse = (response) => {
    const json = JSON.parse(response.body)
    return {
        payload: json.payload,
        id: json.id,
        date: response.result.internalDate
    }
}

/**
 * Gets the body content of a specific email
 * @param response - raw output from getEmailRawFromId
 * @returns {Array} - decoded body in string format
 */
export const getBodyFromEmailResponse = (response) => {
    let encodedMsgArray = getJsonFromEmailResponse(response).payload.parts.map(obj=>{
        return obj.body.data
    })
    return base64.decode(encodedMsgArray[0])
}

/**
 * Gets the header content of a specific unread email
 * @param response - raw output from getEmailRawFromId
 * @returns {Array} - decoded body in string format
 */
export const getHeadersFromEmailResponse = (response) =>{
    const headersArray = response.result.payload.headers
    let headersObject = {}
    headersArray.forEach((field)=>{
        headersObject[field.name] = field.value
    })
    const newheadersObject = {
        From : headersObject.From,
        Date : headersObject.Date,
        Subject : headersObject.Subject,
        To: headersObject.To,
        Snippet : response.result.snippet
    }
    return newheadersObject;
}

/**
 * Gets the all relevant content of a specific draft email
 * @param response - raw output from getEmailRawFromId
 * @returns {Array} - decoded body in string format
 */
export const getEmailFromEmailResponse = (response) => {
    const emailObject = {
        ...getHeadersFromEmailResponse(response),
        body: getBodyFromEmailResponse(response),
        id:  getJsonFromEmailResponse(response)['id'],
        dateUTC: getJsonFromEmailResponse(response)['date']
    }
    return emailObject
}

/**
 * Gets the all relevant content of a specific draft email by id
 * @param response - draft id
 * @returns {Promise<Array>}- decoded body in string format
 */
export const getEmailById = (id) => {
    return new Promise(function (resolve, reject) {
        return getEmailRawFromId(id).then(draft => {
            resolve(getEmailFromEmailResponse(draft))
        })
    })
}

/**
 * Sends an email to to someone
 * @param from
 * @param to
 * @param subject
 * @param message
 * @returns {*}
 */
// Example Function call: sendEmail("MailMate <mailmate.aus@gmail.com>", "Johnny Liaw <johnnyliaw121@gmail.com>", "Mamamia", "hello world!").then(() => {
//           console.log("Mail Drafted!")
//         })
export let sendEmail = (from, to, subject, message) => {
    // let encodedEmailBody = base64url(emailBody)
    let email = "From: "
    email = email + from + "\r\n" + "To: " + to + "\r\n" + "Subject: " + subject + "\r\n\r\n" + message
    email = base64url(email)
    let encodedEmailBody = email.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
    return gapi.client.gmail.users.messages.send({
        'userId': 'me',
        'resource': {
            'raw': encodedEmailBody
        }
    })
}

