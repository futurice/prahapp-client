import { Linking } from 'react-native';

const FEEDBACK_EMAIL_ADDRESS = 'wappu@futurice.com';
const FEEDBACK_EMAIL_SUBJECT = 'Whappu Feedback';



function formatMailtoUrl(url = FEEDBACK_EMAIL_ADDRESS, subject = FEEDBACK_EMAIL_SUBJECT) {
  let feedbackUrl = 'mailto:' + url;
  // Subject (ID-hashtag to help searching from Flowdock inbox)
  feedbackUrl += '?subject=' + subject;
  // Body
  feedbackUrl += '&body=';

  return feedbackUrl;
}


// Send feedback via email
function sendEmail(url, subject) {

  const emailURL = formatMailtoUrl(url, subject);

  // Ship it
  Linking.openURL(emailURL);
}

export default {
  sendEmail,
}
