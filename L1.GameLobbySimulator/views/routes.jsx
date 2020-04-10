import SignInPage from "./pages/signin.jsx";
import MemberPage from "./pages/member.jsx";
import SettingPage from "./pages/setting.jsx";
import OWLoginPage from "./pages/ow-login.jsx";

export default [
    {
        path: '/signin',
        component: SignInPage,
        name: "Sign-In Flow"
    },
    {
        path: '/ow',
        component: OWLoginPage,
        name: "Login With OW"
    },
    {
        path: '/member',
        component: MemberPage,
        name: "Member"
    },
    {
        path: '/setting',
        component: SettingPage,
        name: "Setting"
    }
]