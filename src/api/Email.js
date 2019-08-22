import base64 from "base-64";
import base64url from 'base64url'
import btoa from 'btoa'

let gapi = window.gapi


/**
 * rturns a list of unread email body, sender, subject and id in an object
 * @param unreads - raw output from getListOfUnreadMails
 * @returns {Array}
 */
export let getUnreadMailInfo = (unreads) => {
    let obj_list = []
    let ids = getIdsFromUnreadList(unreads)
    ids.map((id) => {
        let obj = {}
        obj["id"] = id
        getMailFromId(id).then((response) => {
            obj["snippet"] = getSnippetFromEmailResponse(response)
            obj["body"] = getEmailBodyFromEmailResponse(response)
            obj["subject"] = getSubjectFromEmailResponse(response)[0].value
            obj["sender"] = getSenderFromEmailResponse(response)[0].value
        })
        obj_list.push(obj)
    })
    return obj_list
}

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
    email += email + from + "\r\n" + "To: " + to + "\r\n" + "Subject: " + subject + "\r\n\r\n" + message
    email = base64url(email)
    let encodedEmailBody = email.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
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
    let headers = response.result.payload.headers
    let subject = headers.filter((obj) => {
        return obj.name == "Subject"
    })
    return subject
}

/**
 * Gets the sender information from an email id
 * @param response - raw output from getMailFromid
 * @returns {*}
 */
export let getSenderFromEmailResponse = (response) => {
    let headers = response.result.payload.headers
    let sender = headers.filter((obj) => {
        return obj.name == "From"
    })
    return sender
}

/**
 * Gets snippet from email id
 * @param response - raw output from an email ID
 * @returns {*}
 */
export let getSnippetFromEmailResponse = (response) => {
    return response.result.snippet
}