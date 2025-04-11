//import { useEffect, useRef, useState } from '../../../../shared/modules/React';
// import { Dialog } from 'primereact/dialog';
//import ViewCandidate from './ViewCandidate';
// import { Loader } from '../../../shared/Loader/Loader';
import Drawer from "@mui/material/Drawer"
import { IconButton } from "../../../../shared/modules/MaterialImports/Button"
import { Stack } from "../../../../shared/modules/MaterialImports/Stack"
//import { Typography } from "../../../../shared/modules/MaterialImports/Typography"
import CloseRounded from "@mui/icons-material/CloseRounded"
// import KeyboardArrowLeftRounded from "@mui/icons-material/KeyboardArrowLeftRounded"
// import KeyboardArrowRightRounded from "@mui/icons-material/KeyboardArrowRightRounded"
// import { showToaster } from '../../../shared/SnackBar/SnackBar';
// import { trackPromise } from 'react-promise-tracker';
// import ApiService from "../../../../shared/api/api";


 import './ViewVoiceAICandidateModal.scss';


const ViewVoiceAICandidateModal = (
    { open, closePopup, candidateId, candidateViewScreening }:
        { open: boolean, closePopup: () => void, candidateId: string, candidateViewScreening?: any }
) => {
    //const [viewCandidateId, setViewCandidateId] = useState<any>(""); // Candidate Id


    return (
        <Drawer open={open} sx={{ zIndex: 999, height: "100vh", }} onClose={closePopup} anchor='right' id="ViewVoiceAICandidateModal" >
            <Stack width={"70vw"} minHeight={"110vh"} position={"relative"}>
                <Stack className="viewCandidateModalHeader">
                    <Stack alignItems={"center"} justifyContent={"right"} direction={"row"} px={1} width={"82%"}>
                        {/* <Typography variant="h6">Voice AI Candidate</Typography> */}
                        <IconButton size='small' onClick={closePopup}><CloseRounded /></IconButton>
                    </Stack>
                </Stack>
                {/* <Loader /> */}
                <div  className='ScreeningView'>

                <div className='pl-4 pr-4 ' style={{ overflowY: "auto", height: "100%" }}
                                                // onContextMenu={handleContextMenu} 
                                                dangerouslySetInnerHTML={{ __html: candidateViewScreening }}></div>
 
                </div>
            </Stack>
        </Drawer >
    )
}

export default ViewVoiceAICandidateModal;