import UserView from '../components/user/UserView';
import TermsView from '../components/terms/Terms';

const ROOT_URL = 'https://futurice.github.io/prahapp-site';

const links = [
  {title: 'My Prague Memories', icon: 'photo-library', component: UserView, subtitle: 'All photos during trip' },
  {title: 'Flight info', subtitle: 'When does my flight leave?', link: `https://docs.google.com/spreadsheets/u/1/d/1UqjyQCf7EPOekbC-59A9CSshDydilf_D8D2y2hMYq_Y/edit?usp=gmail#gid=1369902543`, icon: 'flight', showInWebview: false},
  {title: 'Airport transportation', subtitle: 'How to get to hotel?', link: `https://docs.google.com/spreadsheets/d/15wcfhNatqr3E6KZo7NG7DgCn6O4XCJ_YU3vgK2JJOws/edit#gid=0`, icon: 'directions-bus',  showInWebview: false },
  {title: 'Roommates', subtitle: 'Who am I sharing room with?', link: `https://docs.google.com/spreadsheets/d/1KJ6DfuDDP91cLhQ7L-Aw0IcUMH_U7JehcRXGUosyAvg/edit#gid=0`, icon: 'hotel', separatorAfter: false, showInWebview: false },
  {title: 'Saturday Activity', subtitle: 'What did I choose?', link: `https://docs.google.com/a/futurice.com/spreadsheets/d/1xWo0-zOjZi9vBKAcAvng_MeY-GfpDxzXYlHDXprFI7I/edit?usp=sharing`, icon: 'directions-walk', separatorAfter: true, showInWebview: false },

  {title: 'Feedback', mailto: 'futubohemia@futurice.com', icon: 'send'},

];

const terms = [
  {title: 'Terms of Service', link: `${ROOT_URL}/terms.html`, icon: 'info-outline', component: TermsView, showInWebview: false},
  {title: 'Privacy', link: `${ROOT_URL}/privacy.html`, icon: 'lock-outline', showInWebview: true},
  {title: 'Licenses', link: `${ROOT_URL}/licences.html`, icon: 'help-outline', showInWebview: true, last: true},
];



export default {
  links,
  terms,
};
