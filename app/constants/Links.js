import UserView from '../components/user/UserView';
import TermsView from '../components/terms/Terms';

const ROOT_URL = 'https://wappu.futurice.com';

const links = [
  {title: 'My Prague Memories', icon:'person-outline', component: UserView, subtitle: 'All photos during trip' },
  {title: 'Flight info', subtitle: 'When does my flight leave?', link: `https://docs.google.com/spreadsheets/u/1/d/1UqjyQCf7EPOekbC-59A9CSshDydilf_D8D2y2hMYq_Y/edit?usp=gmail#gid=1369902543`, icon: 'flight'},
  {title: 'Airport transportation', subtitle: 'How to get to hotel?', link: `https://docs.google.com/spreadsheets/d/15wcfhNatqr3E6KZo7NG7DgCn6O4XCJ_YU3vgK2JJOws/edit#gid=0`, icon: 'directions-bus', separatorAfter: true},

  {title: 'Feedback', mailto: 'wappu@futurice.com', icon: 'send'},

];

const terms = [
  {title: 'Terms of Service', link: `${ROOT_URL}/terms`, icon: 'info-outline', component: TermsView, showInWebview: false},
  {title: 'Privacy', link: `${ROOT_URL}/privacy`, icon: 'lock-outline', showInWebview: false},
  {title: 'Licenses', link: `${ROOT_URL}/licenses`, icon: 'help-outline', showInWebview: false, last: true},
];



export default {
  links,
  terms,
};
