/**
 * gets user profile info for the currently authenticated user
 * @return emailAddress - email address of authenticated user
 * @return messagesTotal - total messages in mailbox
 * @return threadsTotal - total number of threads in mailbox
 * @return historyId - ID of mailbox's current history record
 */

let gapi = window.gapi
/**
 * gets the list of unread messages in user's inbox
 * @param
 */

export let getListOfLabels = () => {
    return gapi.client.gmail.users.labels.list({
        'userId': 'me'
    })
}
