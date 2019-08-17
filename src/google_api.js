let gapi = window.gapi;

gapi.load('client:auth2', () => {
            console.log(gapi)
            gapi.client.init({
                apiKey: 'AIzaSyBOAlQDyCFJra5LDxVflNSQPDX_cIuOc7k',
                clientId: '602273574158-v2c8nla22vif44l6r5shhr45uuhrpdd3.apps.googleusercontent.com',
                discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"],
                scope: 'https://www.googleapis.com/auth/gmail.readonly'
            })
    })
export let callGAPI = (func)=>{
	gapi.load('client:auth2', func)
}

export default gapi
// window.gapi.load("client",)