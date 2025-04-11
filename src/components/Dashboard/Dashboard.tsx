
import { Helmet } from 'react-helmet';
// import { useIdleTimer } from 'react-idle-timer';
import { matchPath, Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { React, Suspense, useEffect, useState } from '../../shared/modules/React';

import { userLocalData } from '../../shared/services/userData';




import { Badge } from './../../shared/modules/MaterialImports/Badge';
import { Button, IconButton } from './../../shared/modules/MaterialImports/Button';
import { CircularProgress } from './../../shared/modules/MaterialImports/CircularProgress';
// import { Dialog, DialogActions, DialogContent } from './../../shared/modules/MaterialImports/Dialog';
import { Grid } from './../../shared/modules/MaterialImports/Grid';
// import { TextField } from './../../shared/modules/MaterialImports/TextField';
// import { InputAdornment } from './../../shared/modules/MaterialImports/InputAdornment';


import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import UpgradeOutlinedIcon from '@mui/icons-material/UpgradeOutlined';
// import BoltIcon from '@mui/icons-material/Bolt';
// import SearchIcon from '@mui/icons-material/Search';



import Pusher from 'pusher-js';


import Notification from '../../shared/components/Notification/Notification';
import SmsComponent from './SmsComponent/SmsComponent';
const Reports = React.lazy(() => import('./Reports/Reports'));
const CreateReport = React.lazy(() => import('./Reports/CreateReport/CreateReport'));
const Sidenav = React.lazy(() => import('../shared/SideNav/Sidenav'));
const Charts = React.lazy(() => import('./Reports/Charts/Charts'));
const Refer = React.lazy(() => import('./Settings/Refer/Refer'));

const Candidate = React.lazy(() => import('./Candidate/Candidate'));
const Contacts = React.lazy(() => import('./Contacts/Contacts'));
const Company = React.lazy(() => import('./Company/Company'));
const Job = React.lazy(() => import('./Job/Job'));
const ReferralProgram = React.lazy(() => import('./Referral/ReferralProgram'))
const TalentPool = React.lazy(() => import('./Pool/TalentPool'));
const Letters = React.lazy(() => import('./Letters/Letters'));
const Resume = React.lazy(() => import('./Resume/Resume'));
const UniversalSearch = React.lazy(() => import('./UniversalSearch/UniversalSearch'));
const DashboardCard = React.lazy(() => import('./Home/DashboardCard/DashboardCard'));
const Settings = React.lazy(() => import('./Settings/Settings'));

const UnAuthorized = React.lazy(() => import('../UnAuthorized/UnAuthorized'));
const ChromeExtensionDashboard = React.lazy(() => import('./Home/ChromeExtensionDashboard/ChromeExtensionDashboard'));
const ChromeExtensionStatusBar = React.lazy(() => import('./Home/ChromeExtensionDashboard/SubComponents/ChromeExtensionStatusBar'));
const TeamMembers = React.lazy(() => import('./Settings/TeamMembers/TeamMembers'));
const Bullhorn = React.lazy(() => import('./Bullhorn/Bullhorn'));
const Outreach = React.lazy(() => import('./Reports/Charts/Outreach/Outreach'));
const OutreachKPI = React.lazy(() => import('./Reports/Charts/OutreachKPI/OutreachKPI'));
const Billing = React.lazy(() => import('./Billing/Billing'));
const Upgrade = React.lazy(() => import('./Upgrade/Upgrade'));
const CandidateStatic = React.lazy(() => import('./Bullhorn/Static/Candidate/Candidate'));
const JobStatic = React.lazy(() => import('./Bullhorn/Static/Job/Job'));
// import JobStatic from './Bullhorn/Static/Job/Job';

const LinkedInUsage = React.lazy(() => import('./Reports/LinkedInUsage/LinkedInUsage'));

const DynamicTalentPool = React.lazy(() => import('./Pool/DynamicTalentPool'));
const Activitylog = React.lazy(() => import('./Reports/Activitylog/Activitylog'));
const SendingLimit = React.lazy(() => import('./Settings/SendingLimit/SendingLimit'));
const CreditLimit = React.lazy(() => import('./Settings/CreditLimit/CreditLimit'));
const JobDiva = React.lazy(() => import('./JobDiva/JobDiva'))

const Explo = React.lazy(() => import('./Reports/ExploCharts/Explo'));

import ProfileMenu from './DashboardSubComponents/ProfileMenu';



import { CuratelyLogo } from '../../shared/images/CuratelyLogo';





import './Dashboard.scss';
import ApiService from '../../shared/api/api';
import { DateTime } from 'luxon';
import { ID_ADDON_PEOPLE_CANDIDATE, ID_ADDON_PEOPLE_CONTACT, ID_ROLE_CONTACT_MODULE, ID_ROLE_PEOPLE } from '../../shared/services/Permissions/IDs';



// import Grid from '@mui/material/Grid';
// import Button from '@mui/material/Button';
// import Tooltip from '@mui/material/Tooltip';
// import { Link } from 'react-router-dom';
// import logoImage from '../../assets/images/curatelyLogo.png';
// import PermIdentityIcon from '@mui/icons-material/PermIdentity';
// import Header from '../shared/Header/Header';
// import Footer from '../shared/Footer/Footer';
// import Tasks from '../shared/Tasks/Tasks';
// import HomeCards from './HomeCards/HomeCards';
// import MessageIcon from '@mui/icons-material/Message';
// import ApiService from '../../shared/api/api';
// import { trackPromise } from 'react-promise-tracker';
// import { CustomThemeStore } from '../../App';
// import Demo from './Reports/ChartsDemo/Demo';
// import PhoneChat from '../../shared/components/PhoneChat/PhoneChat';
// const Home = React.lazy(() => import('./Home/Home'));
// const Users = React.lazy(() => import('./Settings/Users/Users'));
// const DynamicShortlist = React.lazy(() => import('./DynamicShortlist/DynamicShortlist'));
// const SmsComponent = React.lazy(() => import('./SmsComponent/SmsComponent'));
// const CreateReport = React.lazy(() => import('./Reports/CreateReport/CreateReport'));
// import Parsable from '../../shared/utils/Parsable';
// import { Padding } from '@mui/icons-material';



const Dashboard = () => {
    const clientId = userLocalData.getvalue("clientId");
    window.name = 'CuratelyHome';

    const [sideNavOpen, setSideNavOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);

    const isCRMEnabled = !userLocalData.adminSettings(30003) && !userLocalData.isChromeExtensionEnabled();

    const [chatOpen, setChatOpen] = useState(false);
    const [smsCount, setSmsCount] = useState(0);
    const [notificationCount, setNotificationCount] = useState(0);

    // const [universalSearch, setUniversalSearch] = useState("");
    // const location = useLocation();
    const { pathname } = useLocation();
    const isSettingsPath = matchPath(`${userLocalData.getvalue('clientName')}/settings/*`, pathname);
    const [isSettingsRoute, setIsSettingsRoute] = useState(false);

    const isJourneysPath = matchPath(`${userLocalData.getvalue('clientName')}/letter/journeys`, pathname);

    // const [searchText, setSearchText] = useState("");

    // const [showSms, setShowSms] = useState(false);

    const toggleOpen = () => {
        setSideNavOpen(!sideNavOpen)
    }

    // const idelTimeout = 600_000_000;
    // const promptBeforeIdle = 10_000

    // const [showTimeOutModal, setShowTimeOutModal] = useState<boolean>(false)
    // const [remaining, setRemaining] = useState<number>(idelTimeout)

    // const onIdleTimeOut = () => {
    //     signOut();
    //     // in profile Menu Component, removing this for Performance issue as of now
    // }

    // const onActive = () => {
    //     setShowTimeOutModal(false);

    // }
    // const handleStillHere = () => {
    //     setShowTimeOutModal(false);
    //     activate();

    // }

    // const showPrompt = () => {
    //     setShowTimeOutModal(true);
    // }


    // const {
    //     getRemainingTime,
    //     // getTabId,
    //     // isLeader,
    //     // isLastActiveTab,
    //     // message
    //     activate
    // } = useIdleTimer({
    //     onIdle: onIdleTimeOut,
    //     onPrompt: showPrompt,
    //     onActive,
    //     promptBeforeIdle,
    //     timeout: idelTimeout,
    //     crossTab: true,
    //     leaderElection: true,
    //     syncTimers: 200
    // });

    // useEffect(() => {
    //     const idleTimeOutInterval = setInterval(() => {
    //         setRemaining(Math.ceil(getRemainingTime() / 1000))
    //     }, 500)

    //     return () => {
    //         clearInterval(idleTimeOutInterval)
    //     }
    // });

    // const [colorObj, setcolorObj] = useContext(CustomThemeStore);

    useEffect(() => {
        setIsSettingsRoute(isSettingsPath ? true : false)
        // setShowSms(Number(userLocalData.getvalue('phone')) > 99999);
        var pusher = new Pusher("7bee4d362f076c25d7d6", {
            cluster: "ap2",
        });

        if (isSMSEnabled) {


            var smsChannel = pusher.subscribe(`clientid_${userLocalData.getvalue('clientId')}_recrId_${userLocalData.getvalue('recrId')}`);

            smsChannel.bind('smsCount', (data: string) => {
                let response = JSON.parse(data);
                if ((response.recrId == userLocalData.getvalue('recrId')) && response.count && response.count != "0" && Number(response.count)) {
                    setSmsCount(Number(response.count));
                }
            });
        }
        if (isCRMEnabled) {

            var notificationPusherChannel = pusher.subscribe(`clientid_${userLocalData.getvalue('clientId')}`);

            notificationPusherChannel.bind('NotificationCount', (data: string) => {
                let response = JSON.parse(data);
                if (response) {
                    setNotificationCount(1);
                }
            });
        }
        if (userLocalData.isChromeExtensionEnabled() || userLocalData.adminSettings(ID_ADDON_PEOPLE_CONTACT) || userLocalData.adminSettings(ID_ADDON_PEOPLE_CANDIDATE)) {


            //   const getCredits = () => {
            ApiService.getById('admin', `getCredits/${userLocalData.getvalue('clientId')}`, userLocalData.getvalue('recrId')).then((response) => {
                // console.log(response.data);
                if (response.data.Success) {
                    localStorage.setItem(`credits_${userLocalData.getvalue('recrId')}`, JSON.stringify({
                        consumedEmailCredits: response.data.consumedEmailCredits,
                        consumedProfileCredits: response.data.consumedProfileCredits,
                        consumedSmsCredits: ((response.data.paymentType === 1) || (response.data.paymentType === 2)) ? 0 : response.data.consumedSmsCredits,
                        daysLeft: response.data.daysLeft,
                        totalEmailCredits: response.data.totalEmailCredits,
                        totalProfileCredits: response.data.totalProfileCredits,
                        totalSmsCredits: ((response.data.paymentType === 1) || (response.data.paymentType === 2)) ? 0 : response.data.totalSmsCredits,
                        profilePercentage: ((response.data.consumedProfileCredits / response.data.totalProfileCredits) * 100),
                        isPackageEmailValidity: Number(response.data.totalEmailCredits) ? (Number(response.data.totalEmailCredits) > Number(response.data.consumedEmailCredits)) ? true : false : false,
                        isPackagePhoneValidity: ((response.data.paymentType !== 1) && (response.data.paymentType !== 2) && Number(response.data.totalSmsCredits)) ? (Number(response.data.totalSmsCredits) - Number(response.data.consumedSmsCredits)) ? true : false : false,
                        startDate: response.data.startDate ? DateTime.fromFormat(response.data.startDate.substring(0, 19), 'yyyy-MM-dd hh:mm:ss').toFormat('MM/dd/yyyy ') : "",
                        expireDate: response.data.expireDate ? DateTime.fromFormat(response.data.expireDate.substring(0, 19), 'yyyy-MM-dd hh:mm:ss').toFormat('MM/dd/yyyy ') : ""
                    }));




                    // getDomainRecruitersList(response.data.invitedRecruiterDetails);
                }
            })
            //   }
        }
        // if (userLocalData.getvalue('clientId')) {
        //     getBrandingColors();
        // }
    }, []);

    // const getBrandingColors = () => {
    //     // http://35.155.202.216:8080/QADemoCurately/getbranding/3
    //     // trackPromise(
    //     //     ApiService.getCall(214, `getbrandingColors/${userLocalData.getvalue('clientId')}`).then(
    //     //         (response) => {
    //     //             // console.log(response.data);
    //     //             if (response.data?.Success && response.data?.brandColor && response.data?.buttonColor) {
    //     //                 localStorage.setItem('colorSchema', JSON.stringify({
    //     //                     primary: response.data?.brandColor, // 'var(--c-primary-color)',
    //     //                     secondary: response.data?.buttonColor // '#474747'
    //     //                 }));
    //     //                 setcolorObj({
    //     //                     primary: response.data?.brandColor,
    //     //                     secondary: response.data?.buttonColor
    //     //                 });
    //     //             }
    //     //         }
    //     //     )
    //     // )
    //     let localBrandingData = (localStorage.getItem('brandingData') && Parsable.isJSON(localStorage.getItem('brandingData') || "")) ? JSON.parse(localStorage.getItem('brandingData') || "{}") : {};
    //     if (localBrandingData && (localBrandingData?.brandColor && localBrandingData?.buttonColor)) {
    //         setcolorObj({
    //             primary: localBrandingData?.brandColor,
    //             secondary: localBrandingData?.buttonColor
    //         });
    //     } else {
    //         trackPromise(
    //             ApiService.getCall(214, `getBranding/${userLocalData.getvalue('clientId')}`).then(
    //                 (response) => {
    //                     const tempRespData = response.data;
    //                     if (tempRespData?.Success && tempRespData?.brandColor && tempRespData?.buttonColor) {
    //                         setcolorObj({
    //                             primary: tempRespData?.brandColor,
    //                             secondary: tempRespData?.buttonColor
    //                         });
    //                         localStorage.setItem('brandingData', JSON.stringify({
    //                             "brandId": (tempRespData.brandId) ? tempRespData.brandId : "",
    //                             "logoPath": (tempRespData.logoPath) ? tempRespData.logoPath : "",
    //                             "faviconPath": (tempRespData.faviconPath) ? tempRespData.faviconPath : "",
    //                             "bannerPath": (tempRespData.bannerPath) ? tempRespData.bannerPath : "",
    //                             "buttonColor": (tempRespData.buttonColor) ? tempRespData.buttonColor : colorObj.secondary,
    //                             "brandColor": (tempRespData.brandColor) ? tempRespData.brandColor : colorObj.primary,
    //                             "logoName": (tempRespData.logoName) ? tempRespData.logoName : "",
    //                             "bannerName": (tempRespData.bannerName) ? tempRespData.bannerName : "",
    //                             "chatLogoPath": (tempRespData.chatLogoPath) ? tempRespData.chatLogoPath : "",
    //                             "chatName": (tempRespData.chatName) ? tempRespData.chatName : "",
    //                             "socialPostImagePath": (tempRespData.socialPostImagePath) ? tempRespData.socialPostImagePath : "",
    //                             "socialPostName": (tempRespData.socialPostName) ? tempRespData.socialPostName : "",
    //                             "secondaryLogoPath": (tempRespData.secondaryLogoPath) ? tempRespData.secondaryLogoPath : "",
    //                             "miscellaneousColor": (tempRespData.miscellaneousColor) ? tempRespData.miscellaneousColor : colorObj.miscellaneous,
    //                             "logoUrl": (tempRespData.logoUrl) ? tempRespData.logoUrl : "",
    //                             "secondaryLogoUrl": (tempRespData.secondaryLogoUrl) ? tempRespData.secondaryLogoUrl : "",
    //                             "iconTitle": (tempRespData.iconTitle) ? tempRespData.iconTitle : "",
    //                             "content": (tempRespData.content) ? tempRespData.content : "",
    //                             "logo": "",
    //                             "favicon": "",
    //                             "banner": "",
    //                             "secondaryLogo": "",
    //                             "chatLogo": "",
    //                             "socialPostImage": "",
    //                             "shortName": (tempRespData.shortName) ? tempRespData.shortName : "",
    //                             "clientName": (tempRespData.clientName) ? tempRespData.clientName : "",

    //                         }));
    //                     }


    //                 }
    //             )
    //         )

    //     }
    // }


    const isSMSEnabled = userLocalData.adminSettings(20009) && Number(userLocalData.getvalue('phone')) && !userLocalData.isChromeExtensionEnabled();

    const openSmsWindow = () => {
        setChatOpen(!chatOpen);
        //  window.open(`https://search.accuick.com/Twilio/chat.jsp?userid=${userLocalData.getvalue('recrId')}&phone=${Number(userLocalData.getvalue('phone'))}&userName=${userLocalData.getvalue('userName')}`);
    }

    // useEffect(() => {
    //     if (!location.pathname.startsWith("/universalSearch")) {
    //         setUniversalSearch("");
    //     }
    //     // console.log(location.pathname);
    // }, [location]);


    let navigate = useNavigate();

    const goToHome = () => {
        setIsSettingsRoute(false);
        navigate("/" + userLocalData.getvalue('clientName') + "/home");
    }
    // const goToRefer = () => {
    //     navigate("/" + userLocalData.getvalue('clientName') + "/refer");
    // }
    const goToUpgrade = () => {
        setIsSettingsRoute(false);
        navigate("/" + userLocalData.getvalue('clientName') + "/upgrade");
    }


    const hubSpotCSS = `#hubspot-messages-iframe-container iframe, #hubspot-messages-iframe-container{
                        display: none !important
                    }`;


    useEffect(() => {

        const handler = (ev: MessageEvent<{
            curatelyExtensionForLinkedin: string;
        }>) => {

            if (ev?.data?.curatelyExtensionForLinkedin) {
                localStorage.setItem('curatelyExtensionForLinkedin', "true")
            }

        }

        window.addEventListener('message', handler)

        return () => window.removeEventListener('message', handler)
    }, []);


    const { settingIds, integrationIds,
        adminIds
    } = localStorage.getItem("masterRequireAuthSettings") ? JSON.parse(localStorage.getItem("masterRequireAuthSettings") as string) : {
        settingIds: {},
        integrationIds: {},
        adminIds: {}
    };



    return (
        <>
            {
                isJourneysPath && <style>{hubSpotCSS}</style>
            }
            {clientId === 2 && <Helmet>
                <script type="text/javascript" id="hs-script-loader" async defer src="//js-na1.hs-scripts.com/45279392.js"></script>
            </Helmet>}
            <Grid sx={{ display: 'flex' }}>
                {/* <nav>
                <Link to="/login">Logout</Link>
            </nav> */}
                <Grid sx={{ flexGrow: 1 }}>
                    <Grid container direction="row" justifyContent="space-between" alignItems="center" className='topBar px-4'>
                        <Grid>
                            <Grid
                                container
                                direction="row"
                                justifyContent="flex-start"
                                alignItems="center"
                            >
                                <img src={CuratelyLogo} alt="" className="dashLogoImg" onClick={goToHome}></img>
                                {/* <img src={logoImage} alt="" className="dashLogoImg" onClick={goToHome}></img> */}
                                {
                                    (isSettingsRoute) ?
                                        <></>
                                        :
                                        <IconButton aria-label="Open/Close Menu" onClick={toggleOpen} className='ml-3'>
                                            <MenuOutlinedIcon />
                                        </IconButton>
                                }
                            </Grid>
                        </Grid>
                        <div>
                            <Grid container direction="row" justifyContent="end" alignItems="center" >
                                {/* {
                                showSms ?
                                    <Grid className='mr-5'>
                                        <Tooltip title='Send SMS'>
                                            <IconButton aria-label="Send SMS" onClick={openSmsWindow}>
                                                <MessageIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                    :
                                    null
                            } */}
                                {/* <Grid>
                                <Tooltip title='Sign Out'>
                                    
                                        Sign Out
                                </Tooltip>
                            </Grid> */}
                                <Grid className='mr-5'>
                                    {/* <TextField
                                        id="universalSearch"
                                        name="universalSearch"
                                        // label="Universal Search"
                                        placeholder="Universal Search"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <SearchIcon
                                                        className='searchIcon'
                                                        onClick={
                                                            () => {
                                                                if (universalSearch) {
                                                                    setTimeout(() => {
                                                                        navigate("/" + userLocalData.getvalue('clientName') + "/universalSearch/" + universalSearch);
                                                                    }, 100);
                                                                }
                                                            }
                                                        }
                                                    />
                                                </InputAdornment>
                                            ),
                                            sx: {
                                                // fontSize: 14,
                                                // paddingTop: '0px !important',
                                                // paddingBottom: '0px !important'
                                            }
                                        }}
                                        onKeyDown={(ev) => {
                                            // console.log(`Pressed keyCode ${ev.key}`);
                                            if (ev.key === 'Enter') {
                                                // Do code here
                                                ev.preventDefault();
                                                // setSearchText(universalSearch);
                                                if (universalSearch) {
                                                    setTimeout(() => {
                                                        navigate("/" + userLocalData.getvalue('clientName') + "/universalSearch/" + universalSearch);
                                                    }, 100);
                                                }
                                            }
                                        }}
                                        variant="outlined"
                                        size='small'
                                        value={universalSearch}
                                        onChange={(e) => setUniversalSearch(e.target.value)}
                                    /> */}
                                </Grid>
                                <Grid className='mr-5'>

                                    {/* <Button startIcon={<PermIdentityIcon />}>{fullName}</Button> */}
                                    {/* <Button></Button> */}
                                    <Grid container direction="row" justifyContent="end" alignItems="center">

                                        {
                                            userLocalData.isClient7() && (userLocalData.getvalue('paymentType') !== 4) ?
                                                <Button variant='contained' color='primary' size='small' className='mr-3' onClick={() => {
                                                    goToUpgrade();
                                                }}
                                                    startIcon={<UpgradeOutlinedIcon fontSize="small" />}
                                                >Upgrade</Button>
                                                :
                                                null
                                        }
                                        {
                                            isSMSEnabled ?
                                                smsCount ?
                                                    <Badge badgeContent={smsCount ? smsCount : ''} color="error" onClick={openSmsWindow}>
                                                        <ChatOutlinedIcon className={`cursor-pointer  ${chatOpen ? 'c-skyblue' : ''}`} />
                                                    </Badge>
                                                    :
                                                    <ChatOutlinedIcon className={`cursor-pointer  ${chatOpen ? 'c-skyblue' : ''}`} onClick={openSmsWindow} />
                                                :
                                                null
                                        }
                                        {
                                            isCRMEnabled ?
                                                notificationCount ?
                                                    <NotificationsIcon className={`cursor-pointer ml-4 mr-3 fs-24 c-red`} onClick={() => { setNotificationOpen(!notificationOpen); setNotificationCount(0) }} />
                                                    :
                                                    <NotificationsNoneOutlinedIcon className={`cursor-pointer ml-4 mr-3 fs-24 ${notificationOpen ? 'c-skyblue' : ''}`} onClick={() => setNotificationOpen(!notificationOpen)} />

                                                :
                                                null
                                        }

                                        {
                                            userLocalData.isChromeExtensionEnabled() || ((userLocalData.checkIntegration(ID_ROLE_CONTACT_MODULE) || userLocalData.checkIntegration(ID_ROLE_PEOPLE))) ?
                                                <ChromeExtensionStatusBar />
                                                :
                                                null
                                        }
                                        <ProfileMenu />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </div>
                    </Grid>
                    {/* <Header></Header> */}
                    <Grid sx={{ display: 'flex' }}>
                        <Grid>
                            <Sidenav open={sideNavOpen} isSettingsRoute={isSettingsRoute} handleSettingsRoute={(value: boolean) => setIsSettingsRoute(value)} />
                        </Grid>
                        <Grid sx={{ flexGrow: 1, minWidth: (sideNavOpen || isSettingsRoute) ? 800 : 1000, maxWidth: (sideNavOpen || isSettingsRoute) ? 'calc(100vw - 220px)' : 'calc(100vw - 55px)' }}>
                            <div className={`routerHeight ${isSettingsPath ? 'pt-0' : ''}`}>
                                <Routes>
                                    <Route index element={
                                        <Navigate to="home" />} />
                                    {/* <Route path="home" element={
                                    <Home />} /> */}
                                    <Route path="home" element={
                                        <Suspense fallback={<CircularProgress className="centered" />}>
                                            {
                                                userLocalData.isChromeExtensionEnabled() ?
                                                    <ChromeExtensionDashboard />
                                                    :
                                                    <DashboardCard />
                                            }
                                        </Suspense>
                                    } />

                                    <Route path="/unAuthorized" element={<UnAuthorized />} />
                                    <Route path="sms" element={
                                        <Suspense fallback={<CircularProgress className="centered" />}>
                                            {/* <SmsComponent /> */}
                                        </Suspense>
                                    } />
                                    <Route path="universalSearch/:searchString" element={
                                        <UniversalSearch />} />
                                    <Route path="candidate/*" element={
                                        <Suspense fallback={<CircularProgress className="centered" />}>
                                            {
                                                integrationIds[40002] ? <Candidate /> : <UnAuthorized />
                                            }
                                            {/* <RequireAuth integrationId={40002}></RequireAuth> */}
                                        </Suspense>
                                    }
                                    />
                                    <Route path="contact/*" element={
                                        <Suspense fallback={<CircularProgress className="centered" />}>
                                            {
                                                integrationIds[40003] ? <Contacts /> : <UnAuthorized />
                                            }
                                            {/* <RequireAuth integrationId={40003}><Contacts /></RequireAuth> */}
                                        </Suspense>
                                    }
                                    />
                                    <Route path="company/*" element={
                                        <Suspense fallback={<CircularProgress className="centered" />}>
                                            {
                                                settingIds[10002] ? <Company /> : <UnAuthorized />
                                            }
                                            {/* <RequireAuth settingId={10002}><Company /></RequireAuth> */}
                                        </Suspense>
                                    }
                                    />
                                    <Route path="Job/*" element={
                                        <Suspense fallback={<CircularProgress className="centered" />}>
                                            {
                                                integrationIds[40001] ? <Job /> : <UnAuthorized />
                                            }
                                            {/* <RequireAuth integrationId={40001}><Job /></RequireAuth> */}
                                        </Suspense>
                                    } />
                                    <Route path="Letter/*" element={
                                        <Suspense fallback={<CircularProgress className="centered" />}>
                                            <Letters />
                                        </Suspense>
                                    } />
                                    <Route path="resume/*" element={
                                        <Suspense fallback={<CircularProgress className="centered" />}>
                                            <Resume />
                                            {/* <RequireAuth integrationId={40007}><Resume /></RequireAuth> */}
                                        </Suspense>
                                    } />
                                    <Route path="Bullhorn/*" element={
                                        <Suspense fallback={<CircularProgress className="centered" />}>
                                            {
                                                adminIds[20043] ? <Bullhorn /> : <UnAuthorized />
                                            }
                                        </Suspense>
                                    } />
                                    <Route path="JobDiva/*" element={
                                        <Suspense fallback={<CircularProgress className="centered" />}>
                                            <JobDiva />
                                            {/* {
                                                adminIds[20047] ? <JobDiva /> : <UnAuthorized />
                                            } */}
                                        </Suspense>
                                    } />
                                    <Route path="settings/*" element={
                                        <Suspense fallback={<CircularProgress className="centered" />}>
                                            {
                                                settingIds[10001] ? <Settings /> : <UnAuthorized />
                                            }
                                            {/* <RequireAuth settingId={10001}><Settings /></RequireAuth> */}
                                        </Suspense>
                                    } />

                                    <Route path="settings/sendingLimit" element={
                                        <Suspense fallback={<CircularProgress className="centered" />}>
                                            {adminIds[20024] ? <SendingLimit /> : <UnAuthorized />}
                                        </Suspense>
                                    } />

                                    <Route path="settings/credit-limit" element={
                                        <Suspense fallback={<CircularProgress className="centered" />}>
                                            <CreditLimit />
                                        </Suspense>
                                    } />

                                    {/* <Route path="settings/users" element={
                                        <Suspense fallback={<CircularProgress className="centered" />}>
                                        {
                                        settingIds[100001] ? <Users />}    : <UnAuthorized />
                                        // <RequireAuth settingId={100001}><Users /></RequireAuth>
                                        </Suspense>
                                    } /> */}

                                    <Route path="talentPool/*" element={
                                        <Suspense fallback={<CircularProgress className="centered" />}>
                                            {integrationIds[400006] || integrationIds[400007] && adminIds[20020] ? <TalentPool /> : <UnAuthorized />}
                                            {/* <RequireAuth integrationId={400007}><TalentPool /></RequireAuth> */}
                                        </Suspense>
                                    } />
                                    <Route path="dynamictalentPool/*" element={
                                        <Suspense fallback={<CircularProgress className="centered" />}>
                                            {
                                                integrationIds[400006] || integrationIds[400007] && adminIds[20020] && (userLocalData.getvalue('paymentType') !== 1) && !userLocalData.isChromeExtensionEnabled() ? <DynamicTalentPool /> : <UnAuthorized />
                                            }
                                        </Suspense>
                                    } />
                                    <Route path="referralProgram" element={
                                        <Suspense fallback={<CircularProgress className="centered" />}>
                                            <ReferralProgram />
                                        </Suspense>
                                    } />
                                    <Route path="reports/usage" element={
                                        <Suspense fallback={<CircularProgress className="centered" />}>
                                            <Activitylog type='' closeInvitePopup={() => { }} />
                                        </Suspense>
                                    } />
                                    <Route path="reports/outreachactivity" element={
                                        <Suspense fallback={<CircularProgress className="centered" />}>
                                            {adminIds[20049] ? <Outreach /> : <UnAuthorized />}
                                        </Suspense>
                                    } />
                                    <Route path="reports/outreachkpi" element={
                                        <Suspense fallback={<CircularProgress className="centered" />}>
                                            {adminIds[20050] ? <OutreachKPI /> : <UnAuthorized />}
                                        </Suspense>
                                    } />

                                    <Route path="reports/LinkedInViewedProfiles" element={
                                        <Suspense fallback={<CircularProgress className="centered" />}>
                                            {adminIds[20051] ? <LinkedInUsage /> : <UnAuthorized />}
                                        </Suspense>
                                    } />


                                    <Route path="reports/:reportName" element={
                                        <Suspense fallback={<CircularProgress className="centered" />}>
                                            <Reports />
                                        </Suspense>
                                    } />
                                    <Route path="reports/custom/*" element={
                                        <Suspense fallback={<CircularProgress className="centered" />}>
                                            {integrationIds[400037] && adminIds[20037] && !adminIds[30003] ? <CreateReport /> : <UnAuthorized />}
                                            {/* <RequireAuth integrationId={400037}><CreateReport /></RequireAuth> */}
                                        </Suspense>
                                    } />
                                    <Route path="reports/charts/*" element={
                                        <Suspense fallback={<CircularProgress className="centered" />}>
                                            <Charts />
                                        </Suspense>
                                    } />

                                    {/* <Route path="/dynamicShortlist" element={

                                    <Suspense fallback={<CircularProgress className="centered" />}>
                                        <DynamicShortlist />
                                    </Suspense>
                                }
                                ></Route> */}
                                    <Route path="reports/explocharts/*" element={<Suspense fallback={<CircularProgress className="centered" />}><Explo /></Suspense>} />

                                    <Route path="billing" element={<Suspense fallback={<CircularProgress className="centered" />}><Billing /></Suspense>} />
                                    <Route path="upgrade" element={<Suspense fallback={<CircularProgress className="centered" />}>
                                        {userLocalData.isChromeExtensionEnabled() || userLocalData.isClient7() ? <Upgrade /> : <UnAuthorized />}</Suspense>} />
                                    <Route path="refer" element={<Suspense fallback={<CircularProgress className="centered" />}>
                                        {userLocalData.isChromeExtensionEnabled() && userLocalData.isClient7() ? <Refer /> : <UnAuthorized />}</Suspense>} />
                                    <Route path="team" element={<Suspense fallback={<CircularProgress className="centered" />}>
                                        {userLocalData.isChromeExtensionEnabled() && (userLocalData.getvalue('paymentType') !== 1) && userLocalData.isClient7() ? <TeamMembers /> : <UnAuthorized />}
                                    </Suspense>} />
                                    <Route path="static/candidate" element={<Suspense fallback={<CircularProgress className="centered" />}><CandidateStatic reRoute={false} /></Suspense>} />
                                    <Route path="static/job" element={<Suspense fallback={<CircularProgress className="centered" />}><JobStatic reRoute={false} /></Suspense>} />


                                    <Route path="*" element={
                                        <main style={{ padding: "1rem" }}> <p>There's nothing here!</p> </main>} />

                                    {/* <Route path="*" element={
                                    <Navigate to="home" />} /> */}
                                </Routes>
                                <Outlet></Outlet>
                            </div>
                        </Grid>
                    </Grid>
                    {/* <Footer></Footer> */}
                </Grid>
                {
                    notificationOpen ?
                        <Notification
                            open={notificationOpen}
                            closePopup={() => setNotificationOpen(false)}
                        /> : null
                }
                {
                    chatOpen ?
                        // <PhoneChat
                        //     open={chatOpen}
                        //     closePopup={() => setChatOpen(false)}
                        // /> : null
                        <SmsComponent dialogOpen={chatOpen} onClose={() => setChatOpen(false)} /> : null
                }
            </Grid>
            {/* <Dialog open={showTimeOutModal} onClose={() => setShowTimeOutModal(false)} maxWidth="sm" fullWidth>
                <DialogContent>
                    <h3>Are you still here?</h3>
                    <p>Logging out in {remaining} seconds</p>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" variant="contained" onClick={() => { handleStillHere(); }} size='small' >
                        I'm still here
                    </Button>
                </DialogActions>
            </Dialog> */}
        </>
    );
}

export default Dashboard;
