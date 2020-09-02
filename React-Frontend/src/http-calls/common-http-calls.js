export const BASEURL_PORT = "443";
//export const BASEURL_PORT_ML = "5000";

export default function getBaseURL(ml) {
  //var result = window.location.protocol + '//' + window.location.hostname + ':' + (ml? BASEURL_PORT_ML : BASEURL_PORT) + '/'

  var result =
    window.location.protocol +
    "//" +
    window.location.hostname +
    ":" +
    BASEURL_PORT +
    "/" +
    (ml ? "api/ml/" : "");

  //result = "https://mlmoviepredict.com/"

  return result;
}