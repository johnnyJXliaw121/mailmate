import base64 from "base-64";
import base64url from "base64url";

let gapi = window.gapi

/**
 * Gets the list of draft emails from gmail api, along with all metadata/data
 * @returns {*}
 */
export const getListOfDraftMails = () => {
    return gapi.client.gmail.users.drafts.list({
        'userId': 'me'
    })
}

/**
 * Creates a draft email
 * @param draftBody - in ascii plain text (normal english)
 * @returns {*}
 */
export const createDraftMail = (from, to, subject, message) => {
    // let encodedEmailBody = base64url(emailBody)
    let email = "From: "
    email = email + from + "\r\n" + "To: " + to + "\r\n" + "Subject: " + subject + "\r\n\r\n" + message
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
export const getIdsFromDraftList = (response) => {
    let id = response.result.drafts.map((obj) => {
        return obj.id
    })
    return id
}

/**
 * Gets the metadata/data associated with a specific draft email
 * @param id - id of a specific draft email in string format
 * @returns {*}
 */
export const getDraftRawFromId = (id) => {
    return gapi.client.gmail.users.drafts.get({
        'userId': 'me',
        'id': id,
        'format': 'full'
    })
}

/**
 * Gets the payload of a specific draft email
 * @param payload - full email message data
 * @returns {Array} - decoded body in JSON format
 */
const getJsonFromDraftResponse = (response) => {
    const json = JSON.parse(response.body)
    return {
        payload: json.message.payload,
        snippet: json.message.snippet,
        id: json.id,
        date: json.message.internalDate
    }
}

/**
 * Gets the body content of a specific draft email
 * @param response - raw output from getDraftRawFromId
 * @returns {Array} - decoded body in string format
 */
export const getBodyFromDraftResponse = (response) => {
    let encodedMsg = getJsonFromDraftResponse(response).payload.body.data
    const filteredMsg = encodedMsg.replace(/-/g, '+')// replace '_' with '/'
        .replace(/_/g, '/'); // and replace '-' with '+'
    return base64.decode(filteredMsg)
}

/**
 * Gets the header content of a specific draft email
 * @param response - raw output from getDraftRawFromId
 * @returns {Array} - decoded body in string format
 */
export const getHeadersFromDraftResponse = (response) =>{
    const headersArray = getJsonFromDraftResponse(response).payload.headers
    let headersObject = {}
    headersArray.forEach((field)=>{
        headersObject[field.name] = field.value
    })
    return headersObject;
}

/**
 * Gets the all relevant content of a specific draft email
 * @param response - raw output from getDraftRawFromId
 * @returns {Array} - decoded body in string format
 */
export const getDraftFromDraftResponse = (response) => {
    const json_response = getJsonFromDraftResponse(response)
    const draftObject = {
        ...getHeadersFromDraftResponse(response),
        Snippet: json_response['snippet'],
        body: getBodyFromDraftResponse(response),
        id:  json_response['id'],
        dateUTC: json_response['date']
    }
    return draftObject
}

/**
 * Gets the all relevant content of a specific draft email by id
 * @param response - draft id
 * @returns {Promise<Array>}- decoded body in string format
 */
export const getDraftById = (id) => {
return new Promise(function(resolve,reject){
  return getDraftRawFromId(id).then(draft => {
    //console.log(getDraftFromDraftResponse(draft))
    resolve(getDraftFromDraftResponse(draft))
  })
})
}