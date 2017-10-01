import UserView from '../components/user/UserView';
import TermsView from '../components/terms/Terms';

const ROOT_URL = 'https://futurice.github.io/prahapp-site';

const links = [
  { title: 'Memories', icon: 'photo-library', component: UserView, subtitle: 'All your photos', separatorAfter: true },
// { title: 'Futuhours', subtitle: 'Remember to mark your hours everyday', link: 'https://hours.app.futurice.com/', icon: 'timelapse', showInWebview: true, separatorAfter: true, },
// {title: 'Feedback', mailto: 'futubohemia@futurice.com', icon: 'send'},
];

const terms = [
  // {title: 'Terms of Service', link: `${ROOT_URL}/terms.html`, icon: 'info-outline', component: TermsView, showInWebview: false},
  // {title: 'Privacy', link: `${ROOT_URL}/privacy.html`, icon: 'lock-outline', showInWebview: true},
  // {title: 'Licenses', link: `${ROOT_URL}/licences.html`, icon: 'help-outline', showInWebview: true, separatorAfter: true},
];



export default {
  links,
  terms,
};
