
import './ChromeExtensionDashboard.scss';

import ChromeExtensioncontacts from './SubComponents/ChromeExtensionContacts';
import ChromeExtensionHeader from './SubComponents/ChromeExtensionHeader';
// import ChromeExtensionStats from './SubComponents/ChromeExtensionStats';
// import ChromeExtensionStatusBar from './SubComponents/ChromeExtensionStatusBar';


const ChromeExtensionDashboard = () => {
    return <div id="ChromeExtensionDashboard">
        {/* <ChromeExtensionStatusBar/> */}
        <ChromeExtensionHeader />
        {/* <ChromeExtensionStats /> */}
        <ChromeExtensioncontacts />
    </div>
}

export default ChromeExtensionDashboard;