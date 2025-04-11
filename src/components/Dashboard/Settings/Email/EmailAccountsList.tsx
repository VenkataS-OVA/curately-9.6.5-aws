import { React, useEffect, useState, useCallback } from '../../../../shared/modules/React'
import { Button, IconButton } from "../../../../shared/modules/MaterialImports/Button";
import { Typography } from "../../../../shared/modules/MaterialImports/Typography";

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
// import { MaterialReactTable, MRT_ColumnDef } from "../../../../shared/modules/MaterialReactTable";
// import { Dialog, DialogContent, DialogTitle } from "../../../../shared/modules/MaterialImports/Dialog";

import { Grid } from '../../../../shared/modules/MaterialImports/Grid2';
// import { Divider } from '../../../../shared/modules/MaterialImports/Divider';
// import { TextField } from '../../../../shared/modules/MaterialImports/FormInputs';
import { useFormik, Yup } from '../../../../shared/modules/Formik';



import { trackPromise } from '../../../../shared/modules/PromiseTrackter';
import ApiService from "../../../../shared/api/api";



// import SwitchLeftIcon from '@mui/icons-material/SwitchLeft';
// import { SvgIconProps } from '@mui/material/SvgIcon';
// import { globalData } from '../../../../shared/services/globalData';
// import ErrorMessage from '../../../shared/Error/ErrorMessage';
import { showToaster } from '../../../shared/SnackBar/SnackBar';
import IsValidUrl from '../../../../shared/utils/IsValidUrl';
import { Tooltip } from '../../../../shared/modules/MaterialImports/ToolTip';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { confirmDialog } from '../../../shared/ConfirmDialog/ConfirmDialog';
import { CuratelyMailDialog } from './CuratelyMailDialog/CuratelyMailDialog';
// import { LinkAccountDialog } from './LinkAccountDialog/LinkAccountDialog';
import { userLocalData } from '../../../../shared/services/userData';
// import CustomPagination from '../../../shared/CustomPagination/CustomPagination';
import PendingActionsOutlinedIcon from '@mui/icons-material/PendingActionsOutlined';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';


import { debounce } from 'lodash';
import { Card, CardContent } from '../../../../shared/modules/MaterialImports/Card';
import { Popover } from '../../../../shared/modules/MaterialImports/Popover';

import './EmailAccountsList.scss';
import CronofyConnect from '../../../../shared/components/CronofyConnect/CronofyConnect';



export interface EmailAccountData {
    email: string;
    name: string;
    state: string;
    type: string;
    account: string

}

const EmailAccountsList = () => {


    // const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [mailDialogOpen, setMailDialogOpen] = useState(false);
    const [accountData, setAccountData] = useState<EmailAccountData>({
        email: "",
        name: "",
        state: "",
        type: "",
        account: "",
    });
    // const [accountUrl, setAccountUrl] = useState('');
    // const [pagination, setPagination] = useState({
    //     pageIndex: 0,
    //     pageSize: 10,
    // });
    // const [rowCount, setRowCount] = useState(0);
    // const [globalFilter, setGlobalFilter] = useState('');

    const EmailAccountCreateSchema = Yup.object({
        account: Yup.string().required('Required'),
        name: Yup.string().required('Required'),
        email: Yup.string().required('Required').email('Invalid email format'),
        redirectUrl: Yup.string(),
    })
    const emailAccountCreateFormik = useFormik({
        initialValues: {
            account: `${userLocalData.getvalue('clientId')}_${userLocalData.getvalue('recrId')}`,
            name: userLocalData.getvalue('recrFullName'),
            email: '',
            redirectUrl: window.location.href,
        },
        validationSchema: EmailAccountCreateSchema,
        onSubmit: () => {
        },
        validateOnMount: true

    });

    const createAccount = () => {
        // https://app.curately.ai/Accuick_API/Curately/EmailEngine/createAccount.jsp?account=accuick5&name=Accuick5&email=accuicktest5@gmail.com
        // setIsFormSubmitted(true);
        // if (emailAccountCreateFormik.isValid) {
        trackPromise(
            ApiService.getByParams(193, '/Curately/EmailEngine/createAccount.jsp', { clientId: userLocalData.getvalue('clientId'), ...emailAccountCreateFormik.values })
                .then((response) => {
                    console.log(response.data);
                    // http://54.187.123.62:3000/accounts/new?data=eyJhY2NvdW50IjoiY3VyYXRlbHlfMTIzIiwibmFtZSI6IlRvZ2FydSBBZGl0eWEgS3VtYXIiLCJlbWFpbCI6ImFkaXR5YS50djk1MEBnbWFpbC5jb20iLCJzeW5jRnJvbSI6IjIwMjQtMDUtMTZUMDc6MDY6MzQuMzM2WiIsIm5vdGlmeUZyb20iOiIyMDI0LTA1LTE2VDA3OjA2OjM0LjMzNloiLCJzdWJjb25uZWN0aW9ucyI6WyJbR21haWxdL1NwYW0iLCJcXFNlbnQiXSwicmVkaXJlY3RVcmwiOiJodHRwOi8vbG9jYWxob3N0OjMwMDIvIy9xYWRlbW8vc2V0dGluZ3MvZW1haWwiLCJuIjoiaFBGVTBEMGxGcS93QVJDWkZRSEw3QT09IiwidCI6MTcxODk3MTUzMDA3OX0&sig=oxvshgBi91_Nt0pk8JSSb95NZzNhOZlwuXbi6s4Y5kw
                    // https://emailengine.curately.ai/accounts/new?data=eyJhY2NvdW50IjoiY3VyYXRlbHkxMjMiLCJuYW1lIjoiVG9nYXJ1IEFkaXR5YSBLdW1hciIsIm4iOiJMZVBvcVBieDVPbkpQQ1lyQ1h4cHd3PT0iLCJ0IjoxNzE4OTczNjAyMzExfQ&sig=cTNh-l-l4UtPOFU3oxZxfeDo31f3dBuX4ABPirQUuHE

                    if (response.data.url) {
                        let tempUrl = response.data.url.replace('http://54.187.123.62:3000', 'https://emailengine.curately.ai');
                        if (IsValidUrl.check(tempUrl)) {
                            // setAccountUrl(tempUrl);
                            window.location.href = tempUrl;
                        }
                    }

                })
        )
        // } else {
        //     showToaster('Please fill all required fields.', 'error');
        // }
    }

    // useEffect(() => {
    //     setPagination(prev => ({
    //         ...prev,
    //         pageIndex: 0
    //     }));
    // }, [globalFilter]);

    const deleteAccount = (accountId: string) => {

        trackPromise(
            // https://app.curately.ai/Accuick_API/Curately/EmailEngine/deleteAccount.jsp?accountId=accuick_5
            ApiService.getByParams(193, '/Curately/EmailEngine/deleteAccount.jsp', { clientId: userLocalData.getvalue('clientId'), accountId })
                .then(
                    (response) => {
                        console.log(response.data);
                        if (response.data.deleted) {
                            localStorage.setItem('emailEngineAccountActive', "0");
                            updateEmailAccountStatus(false);
                            getEmailAccountsList();
                        } else {
                            showToaster('An error occured while deleting account.', 'error');
                        }
                    }
                )
        )
    }


    const [emailAccountData, setEmailAccountData] = useState<EmailAccountData[]>([]);
    const [isDataLoading, setIsDataLoading] = useState(false);


    const getEmailAccountsList = useCallback(debounce(() => {

        trackPromise(
            // ApiService.getCall(216, 'DemoCurately/listadminusers')
            // 
            // ApiService.postWithData('admin', 'getAccounts', { clientId: userLocalData.getvalue('clientId') })
            ApiService.getByParams(193, '/Curately/EmailEngine/getAccounts.jsp', {
                clientId: userLocalData.getvalue('clientId'),
                recrId: userLocalData.getvalue('recrId')
            })
                .then(
                    (response) => {
                        setIsDataLoading(false);
                        if(response.data.account === `${userLocalData.getvalue('clientId')}_${userLocalData.getvalue('recrId')}`){
                            setEmailAccountData([response.data]);
                            if (!Boolean(Number(localStorage.getItem('emailEngineAccountActive')))) {
                                localStorage.setItem('emailEngineAccountActive', "1");
                                updateEmailAccountStatus(true);
                            }
                        } else{
                            setEmailAccountData([]);
                        }

                        // if (response.data?.response?.length) {
                        //     let tempData = JSON.parse(response.data?.response);
                        //     let tempAccounts = tempData?.accounts?.length ? tempData?.accounts : [];
                        //     tempAccounts = tempAccounts.filter((accountData: { account: string }) => accountData.account == `${userLocalData.getvalue('clientId')}_${userLocalData.getvalue('recrId')}`)
                        //     // setRowCount(tempAccounts.length);
                        //     setEmailAccountData(tempAccounts);
                        //     setIsDataLoading(false)
                        //     if (tempAccounts.length && !Boolean(Number(localStorage.getItem('emailEngineAccountActive')))) {
                        //         localStorage.setItem('emailEngineAccountActive', "1");
                        //         updateEmailAccountStatus(true);
                        //     }
                        // }
                    }
                )
        )
    }, 400), []);

    const updateEmailAccountStatus = (status: boolean) => {
        // https://qaadminapi.curately.ai/curatelyAdmin/updateRecrEmailEngineAccountStatus
        ApiService.postWithData('admin', 'updateRecrEmailEngineAccountStatus', {
            clientId: userLocalData.getvalue('clientId'),
            recrId: userLocalData.getvalue('recrId'),
            emailEngineAccountCreated: status
        }).then((response) => {
            console.log(response.data);
        })
    }


    const openEmailAccountView = (accountData: EmailAccountData) => {
        setAccountData(accountData);
        console.log(accountData);
        setMailDialogOpen(true);
        // window.open(globalData.getWindowLocation() + "settings/email/" + accountId);
    }





    // const columns: MRT_ColumnDef<any>[] = useMemo(
    //     () => [

    //         // {
    //         //     accessorKey: "account",
    //         //     header: "ID",
    //         //     enableColumnPinning: true,
    //         //     Cell: ({ row }) => {
    //         //         return (
    //         //             <span className="hightLightTd" onClick={() => openEmailAccountView(row.original)}>
    //         //                 {row.original.account}
    //         //             </span>
    //         //         );
    //         //     },
    //         // },

    //         {
    //             accessorKey: 'name',
    //             header: 'Name',
    //             Cell: ({ row }) => {
    //                 return (
    //                     <span className="hightLightTd" onClick={() => openEmailAccountView(row.original)}>
    //                         {row.original.name}
    //                     </span>
    //                 );
    //             },
    //         },
    //         {
    //             accessorKey: 'email',
    //             header: 'Email'
    //         },
    //         {
    //             accessorKey: 'type',
    //             header: 'Type'
    //         },
    //         {
    //             accessorKey: 'state',
    //             header: 'Status',

    //         },
    //         {
    //             accessorKey: 'action',
    //             header: 'Action',
    //             enableSorting: false,
    //             Cell: ({ row }) => (
    //                 <div>
    //                     <Tooltip title="Delete">
    //                         <DeleteOutlineOutlinedIcon
    //                             sx={{ color: 'red', marginLeft: '5px' }}
    //                             className="fs-16 cursor-pointer c-red"
    //                             onClick={() => {
    //                                 confirmDialog(`Are you sure you want to delete Account -  ${row.original.account} ?`, () => { deleteAccount(row.original.account) }, 'warning'
    //                                 );
    //                             }} />
    //                     </Tooltip>
    //                 </div>
    //             )
    //         },


    //     ], []
    // );
    useEffect(() => {
        getEmailAccountsList();
        setIsDataLoading(true);
    }, []);

    // const [addEmailAccountModalOpen, setAddEmailAccountModalOOpen] = useState(false);

    const openAccount = () => {
        emailAccountCreateFormik.resetForm();
        createAccount();
        // setAddEmailAccountModalOOpen(true);
    }

    const saveAuditLog = (id: number) => {
        ApiService.saveAuditLog(id);
    }

    useEffect(() => {
        saveAuditLog(4298);
    }, []);

    const [actionAnchorEl, setActionAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleActionClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setActionAnchorEl(event.currentTarget);
    };

    const handleActionClose = () => {
        setActionAnchorEl(null);
    };

    const open = Boolean(actionAnchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <div>
            <div className="p-3 " id="EmailAccountsList">
                <Grid
                    direction="row"
                    className="customCard px-4 py-2"
                    justifyContent="space-between"
                    alignItems="center"
                    display="flex"
                    sx={{ minHeight: 'auto !important' }}
                >
                    <Typography variant="h6" className="header">
                        Email Account
                    </Typography>

                    {/* <Grid direction="row" spacing={1}>

                        <Button className='user' variant="outlined" size="small" onClick={() => { openAccount(); saveAuditLog(4299); }}
                            startIcon={<AddCircleOutlineIcon />}
                        >

                            Connect Account
                        </Button>

                    </Grid> */}

                </Grid>
                {!isDataLoading ? <Grid container>
                    {emailAccountData.length !== 0 ? <Card className='emailAccount-card'>
                        <CardContent>
                            <div className='action'>
                                <IconButton onClick={handleActionClick}>
                                    <MoreVertIcon />
                                </IconButton>
                                <Popover
                                    id={id}
                                    open={open}
                                    anchorEl={actionAnchorEl}
                                    onClose={handleActionClose}
                                    className="accountActionPopover"
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    }}
                                >
                                    <Tooltip title="Delete">
                                        <DeleteOutlineOutlinedIcon
                                            sx={{ color: 'red' }}
                                            className="fs-18 cursor-pointer c-red"
                                            onClick={() => {
                                                confirmDialog(`Are you sure you want to delete Account -  ${emailAccountData[0].name} ?`, () => { deleteAccount(emailAccountData[0].account) }, 'warning'
                                                );
                                            }} />
                                    </Tooltip>
                                </Popover>
                            </div>
                            <h4 className="hightLightTd" onClick={() => openEmailAccountView(emailAccountData[0])}>
                                {emailAccountData[0]?.name}
                            </h4>
                            <p>{emailAccountData[0]?.email}</p>
                            <p><span className='textCapital'>{emailAccountData[0]?.type}</span></p>
                            <p>
                                <span className={'status-btn ' + (emailAccountData[0]?.state === "connected" ? "connected" : "pending")}>
                                    {
                                        emailAccountData[0]?.state === "connected" ?
                                            <DoneOutlinedIcon />
                                            :
                                            <PendingActionsOutlinedIcon />
                                    }
                                    <span className='px-2'>{emailAccountData[0]?.state}</span>
                                </span>
                            </p>
                        </CardContent>
                    </Card>
                        :
                        <Button className='user' variant="outlined" size="large" onClick={() => { openAccount(); saveAuditLog(4299); }}
                            startIcon={<AddCircleOutlineIcon />}
                        >

                            Connect Account
                        </Button>
                    }

                </Grid>
                    :
                    null
                }
                {/* <CronofyConnect /> */}
                {/* <Grid container className="MRTableCustom customCard p-0 filterExpand-grid" >
                    <Grid className='w-100'>
                        <MaterialReactTable
                            columns={columns}
                            enableRowSelection
                            data={emailAccountData}

                            initialState={{
                                density: 'compact',
                                showGlobalFilter: true,
                                columnPinning: { left: ['mrt-row-select', 'fullName'] },
                            }}
                            enableGlobalFilterModes
                            getRowId={row => row.recrId}
                            enableStickyHeader
                            icons={{
                                ArrowDownwardIcon: (props: SvgIconProps) => <SwitchLeftIcon {...props} />
                            }}
                            state={{
                                pagination,
                                globalFilter,
                            }}
                            enablePagination={false}
                            renderBottomToolbarCustomActions={() => (
                                <CustomPagination
                                    page={pagination.pageIndex}
                                    rowsPerPage={pagination.pageSize}
                                    rowCount={rowCount}
                                    onChangePage={(page: any) => setPagination({ ...pagination, pageIndex: page, pageSize: 10 })}
                                />
                            )}
                            onGlobalFilterChange={setGlobalFilter}
                        />
                    </Grid>
                </Grid> */}
            </div>
            {/* 
            <Dialog
                maxWidth={'sm'}
                // sx={{ maxWidth: '650px !important' }}
                fullWidth={false} open={addEmailAccountModalOpen} className='AddCandidateModal customInputs'>
                <DialogTitle
                    className='py-2'
                >
                    <Grid
                        container
                        direction="row"
                        justifyContent="space-between"
                        // sx={{ width: '475px' }}
                        alignItems="center"
                    >
                        <span className='addHeader'>Add Email Account</span>
                        <div>
                            <Grid container direction="row" justifyContent="end" alignItems="center">
                                <Button variant="outlined" type='button' color="secondary" className='mr-2' onClick={() => setAddEmailAccountModalOOpen(false)}>Cancel</Button>
                                <Button variant="contained" type='button' color="primary" onClick={createAccount} >Create </Button>
                            </Grid>
                        </div>
                    </Grid>
                </DialogTitle>
                <Divider />
                <DialogContent className='px-5' sx={{ maxWidth: '450px !important' }}>
                    <Grid container spacing={2} className="mb-1">
                        <Grid size={12} className='mt-1'>
                            <label className='inputLabel'>Name </label><span style={{ color: 'red' }}>*</span>
                            <TextField fullWidth className='mt-1'
                                id="name"
                                name="name"
                                variant="outlined"
                                type="text"
                                size="small"
                                value={emailAccountCreateFormik.values.name}
                                onChange={emailAccountCreateFormik.handleChange}
                                error={(emailAccountCreateFormik.errors.name && isFormSubmitted) ? true : false}
                            />
                            <ErrorMessage formikObj={emailAccountCreateFormik} name={'name'} isFormSubmitted={isFormSubmitted}></ErrorMessage>
                        </Grid>
                        <Grid size={12} className='mt-1'>
                            <label className='inputLabel'>Account ID </label><span style={{ color: 'red' }}>*</span>
                            <TextField fullWidth className='mt-1'
                                placeholder={`for example "account_123"`}
                                id="account"
                                name="account"
                                variant="outlined"
                                type="text"
                                size="small"
                                value={emailAccountCreateFormik.values.account}
                                onChange={emailAccountCreateFormik.handleChange}
                                error={(emailAccountCreateFormik.errors.account && isFormSubmitted) ? true : false}
                            />
                            <ErrorMessage formikObj={emailAccountCreateFormik} name={'account'} isFormSubmitted={isFormSubmitted}></ErrorMessage>
                        </Grid>
                        <Grid size={12} className='mt-1'>
                            <label className='inputLabel'>Email </label><span style={{ color: 'red' }}>*</span>
                            <TextField fullWidth className='mt-1'
                                id="email"
                                name="email"
                                variant="outlined"
                                type="text"
                                size="small"
                                value={emailAccountCreateFormik.values.email}
                                onChange={emailAccountCreateFormik.handleChange}
                                error={(emailAccountCreateFormik.errors.email && isFormSubmitted) ? true : false}
                            />
                            <ErrorMessage formikObj={emailAccountCreateFormik} name={'email'} isFormSubmitted={isFormSubmitted}></ErrorMessage>
                        </Grid>
                    </Grid>

                </DialogContent>
            </Dialog> */}

            {mailDialogOpen && <CuratelyMailDialog
                dialogOpen={mailDialogOpen}
                onClose={() => setMailDialogOpen(false)}
                accountData={accountData}
            />}

            {/* {accountUrl && <LinkAccountDialog
                url={accountUrl}
                open={Boolean(accountUrl)}
                onClose={() => setMailDialogOpen(false)}
            />} */}

        </div>
    )
}

export default EmailAccountsList