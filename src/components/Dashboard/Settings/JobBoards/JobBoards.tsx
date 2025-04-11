
import { useEffect, useMemo, useState, useRef, useCallback } from "../../../../shared/modules/React";
// import { userLocalData } from "../../../../shared/services/userData";
import { Typography } from "../../../../shared/modules/MaterialImports/Typography";
import { Grid } from '../../../../shared/modules/MaterialImports/Grid2';
import { MaterialReactTable, type MRT_ColumnDef } from "../../../../shared/modules/MaterialReactTable";
import { Button, IconButton } from '../../../../shared/modules/MaterialImports/Button'
import { trackPromise } from '../../../../shared/modules/PromiseTrackter';
import { Tabs, Tab } from '../../../../shared/modules/MaterialImports/Tabs';
// import { useNavigate } from "react-router-dom";
import { Box } from "../../../../shared/modules/MaterialImports/Box";
// import { useHistory} from "react-router-dom";
// import{ useHistory }from "react-router-dom";
// import{ withRouter }from 'react-router-dom';
import { confirmDialog } from "../../../shared/ConfirmDialog/ConfirmDialog";
import { Stack } from "../../../../shared/modules/MaterialImports/Stack";
import SwitchLeftIcon from "@mui/icons-material/SwitchLeft";
import { showToaster } from '../../../shared/SnackBar/SnackBar';
import SettingsIcon from '@mui/icons-material/Settings';
import './JobBoards.scss'
import ApiService from "../../../../shared/api/api";
import { Tooltip } from "../../../../shared/modules/MaterialImports/ToolTip";
// import Dialog from '@mui/material/Dialog';
// import DialogTitle from '@mui/material/DialogTitle';
// import DialogContent from '@mui/material/DialogContent';
// import DialogActions from '@mui/material/DialogActions';
import JobBoardsApplicationDetails from './JobBoardApplicationDetails';

import JobBoardsPublishList from './JobBoardPublishList';
import SubscribeJobBoard from './SubscribeJobBoard';
import CustomPagination from '../../../shared/CustomPagination/CustomPagination';
import { debounce } from "lodash";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import { InputAdornment } from "../../../../shared/modules/commonImports";
import CloseRounded from "@mui/icons-material/CloseRounded";

export const GetFormattedJobBoardData = (data: any) => {
    if (data && Array.isArray(data)) {
        return data || [];
    } else {
        return (typeof data === 'object' && !Array.isArray(data)) ? [data] : []
    }
}

const JobBoards = () => {

    const [listSubscribe, setListSubscribe] = useState<any[] | never[]>([]);

    // const recrID = userLocalData.getvalue('recrId');

    // let navigate = useNavigate();
    // const routeChange = () => {
    //     let path = './jobBoardsApplicationDetails';
    //     navigate(path);
    // }

    const [openApplicantJobBoardModal, setOpenApplicantJobBoardModal] = useState(false);
    const [openPublishJobBoardModal, setOpenPublishJobBoardModal] = useState(false);

    const [openSubscribeJobBoardModal, setOpenSubscribeJobBoardModal] = useState(false);
    // const [open, setOpen] = useState(false);
    const [subEdit, setSubEdit] = useState(false);

    // const handleOpen = () => {
    //     setOpen(true);
    // };

    // const handleClose = () => {
    //     setOpen(false);
    // };


    const [subscribeJobBoardGetData, setSubscribeJobBoardGetData] = useState<any>([]);
    const [subscribeJobBoardData, setSubscribeJobBoardData] = useState<any>([]);
    const [myOrAll, setMyOrAll] = useState('subscribers');
    const myOrAllRef = useRef('subscribers');
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const [rowCount, setRowCount] = useState(0);
    const [globalFilter, setGlobalFilter] = useState('');
    const [isDataFetching, setIsDataFetching] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        myOrAllRef.current = newValue;
        setMyOrAll(newValue);
        setSearchValue("")
        //   getSubscribeList(newValue);
    };

    const filteredData = useMemo(() => {
        return listSubscribe.filter((each) => {
            let search = searchValue?.toLowerCase()?.trim() || "";
            return each.name?.toLowerCase().includes(search) || each.tags?.toLowerCase().includes(search) || each.url?.toLowerCase().includes(search)
        })
    }, [listSubscribe, searchValue]);

    // const getSubscribeList = (text: string) => {

    //     trackPromise(
    //         ApiService.getByParams(2168095, 'Curately/JobBoard/jobboard.jsp', (text === "JobBoard") ? { recrId: userLocalData.getvalue('recrId') } : {}).then((response: any) => {

    //             if (response.data.Message === "Success") {
    //                 let tempJobBoardsList = response.data.idibu.response.portals.portal.map((item: any, index: number) => ({
    //                     ...item,
    //                     id: index + 1,
    //                     actions: ""
    //                 }));

    //                 setListSubscribe(tempJobBoardsList);



    //             } else {

    //                 let tempSubscriberList = response.data.idibu.response.applicants.portal.map((item: any, index: number) => ({
    //                     ...item,
    //                     id: index + 1,
    //                     actions: ""
    //                 }));

    //                 setListSubscribe(tempSubscriberList);

    //             }
    //             // setDataLoading(false);
    //         })
    //     );
    // }

    const handleUnSubscrieJobBoard = (boardId: any) => {
        //   To Un-Subscribe  // http://35.155.202.216:8095/idibu/inActivateJobBoard

        trackPromise(
            ApiService.postWithData('admin', 'inActivateJobBoard', { "portalId": boardId }).then((response) => {

                // console.log(response.data);
                if (response.data.Status === 200) {
                    showToaster('This Brand was UnSubscribed From the Portal Successfully.', 'success');
                    SubscribedJobBoardsData();
                    setSearchValue("");
                    setPagination((prev) => ({
                        ...prev, pageIndex: 0
                    }))
                } else {
                    showToaster((response.data.Message) ? response.data.Message : 'An error occured', 'error')
                }
            })
        )
    }


    useEffect(() => {
        setPagination(prev => ({
            ...prev,
            pageIndex: 0
        }));
    }, [globalFilter]);


    const handleSubscribeJobBoardClose = () => {
        setOpenApplicantJobBoardModal(false);
        setOpenSubscribeJobBoardModal(false);
        setOpenPublishJobBoardModal(false);
        // subEdit ? SubscribedJobBoardsData() : UnSubscribedJobBoardsData();
        setSearchValue("");
        myOrAll === "subscribers" ? SubscribedJobBoardsData() : UnSubscribedJobBoardsData();
        setSubEdit(false);
        setSubscribeJobBoardData([]);
        setSubscribeJobBoardGetData([]);
    };

    const handleJobBoardClose = (refetch?: boolean) => {
        setOpenApplicantJobBoardModal(false);
        setOpenSubscribeJobBoardModal(false);
        setOpenPublishJobBoardModal(false);
        if (refetch) {
            setSearchValue("");
            myOrAll === "subscribers" ? SubscribedJobBoardsData() : UnSubscribedJobBoardsData();
        }
        setSubEdit(false);
        setSubscribeJobBoardData([]);
        setSubscribeJobBoardGetData([]);
    }

    const handleSettingGetJobBoard = (boardId: any, boardName: any) => {

        //http://35.155.202.216:8095/idibu/getBoardFieldsForUpdate

        trackPromise(
            //  ApiService.postWithData('admin', 'getBoardFieldsForUpdate', { "boardId": boardId }).then((response) => {
            ApiService.postWithData('admin', 'getBoardFieldsForUpdate', { "boardId": boardId }).then((response) => {

                console.log("response.data");

                console.log(response.data);
                if (response.data.Status === 200) {
                    let tempGetFiledsList = [
                        {
                            portalId: (boardId) ? boardId : "",
                            portalName: (boardName) ? boardName : "",
                            field: GetFormattedJobBoardData(response.data?.idibu?.response?.fields?.field)
                        }
                    ];

                    setSubscribeJobBoardGetData(tempGetFiledsList);
                    setOpenSubscribeJobBoardModal(true);
                } else {
                    showToaster((response.data.Message) ? response.data.Message : 'An error occured', 'error')
                }
            })
        )
    }
    const handleSettingJobBoard = (boardId: any, boardName: any) => {
        //   To Un-Subscribe 

        trackPromise(
            ApiService.postWithData('admin', 'getFieldsFromUnSubscribedJobBoard', { "portalId": boardId }).then((response) => {
                if (response.data.Status === 200) {

                    let tempFiledsList = [
                        {
                            portalId: (boardId) ? boardId : "",
                            portalName: (boardName) ? boardName : "",
                            // field: response.data?.idibu?.response?.fields?.field
                            field: GetFormattedJobBoardData(response.data?.idibu?.response?.fields?.field)?.map((item: any) => ({
                                ...item,
                                values: {
                                    value: GetFormattedJobBoardData(item?.values?.value)
                                }
                            }))
                        }
                    ];
                    handleSettingGetJobBoard(boardId, boardName);
                    setSubscribeJobBoardData(tempFiledsList);
                    setSubEdit(true);
                } else {
                    showToaster((response.data.Message) ? response.data.Message : 'An error occured', 'error')
                }
            })
        )

    }
    const handleSubscrieJobBoard = (boardId: any, boardName: any) => {
        //   To Un-Subscribe 
        // http://35.155.202.216:8095/idibu/inActivateJobBoard

        trackPromise(
            ApiService.postWithData('admin', 'getFieldsFromUnSubscribedJobBoard', { "portalId": boardId }).then((response) => {
                if (response.data.Status === 200) {
                    let tempFiledsList = [
                        {
                            portalId: (boardId) ? boardId : "",
                            portalName: (boardName) ? boardName : "",
                            // field: response.data?.idibu?.response?.fields?.field
                            field: GetFormattedJobBoardData(response.data?.idibu?.response?.fields?.field)?.map((item: any) => ({
                                ...item,
                                values: {
                                    value: GetFormattedJobBoardData(item?.values?.value)
                                }
                            }))
                        }
                    ];
                    setSubscribeJobBoardData(tempFiledsList);
                    setOpenSubscribeJobBoardModal(true);
                } else {
                    showToaster((response.data.Message) ? response.data.Message : 'An error occured', 'error')
                }
            })
        )
    }
    const SubscribedJobBoardsData = useCallback(debounce(async () => {
        setIsDataFetching(true);
        try {
            setPagination(prev => ({
                ...prev,
                pageIndex: 0
            }));
            ApiService.getCall('admin', 'listAllSubscribedJobBoards').then((response) => {
                setListSubscribe(() => GetFormattedJobBoardData(response.data?.idibu?.response?.portals?.portal));
                setRowCount(response.data.idibu.response.total);
                setIsDataFetching(false);
            }).catch((err: any) => {
                setRowCount(0);
                setListSubscribe([]);
                setIsDataFetching(false);
            })
            // )

        } catch (error) {
            console.error("Error fetching subscribed job boards:", error);
            setIsDataFetching(false);
        }
    }, 0), []);

    // useEffect(() => {
    //     SubscribedJobBoardsData();

    //     if (!openSubscribeJobBoardModal) {
    //         setSubscribeJobBoardData({});
    //     }
    // }, [SubscribedJobBoardsData, openSubscribeJobBoardModal]);



    const UnSubscribedJobBoardsData = () => {
        setIsDataFetching(true);
        setPagination(prev => ({
            ...prev,
            pageIndex: 0
        }));
        ApiService.getCall('admin', 'listAllUnSubscribedJobBoards').then((response) => {
            setListSubscribe(() => GetFormattedJobBoardData(response.data?.idibu?.response?.portals?.portal));
            setRowCount(response.data.idibu.response.total);
            setIsDataFetching(false);
        }).catch((err: any) => {
            setIsDataFetching(false);

        })
        // )
    }


    const columns: MRT_ColumnDef<any>[] = useMemo(
        () => [
            // {
            //     accessorKey: 'id',
            //     header: 'Job Board Id',
            //     size: 60,
            //     muiTableHeadCellProps: {
            //         align: 'left',
            //     },
            //     muiTableBodyCellProps: {
            //         align: 'left',
            //     },
            // },
            {
                accessorKey: 'name',
                header: 'Job Board Name',
                Cell: ({ row }) => (
                    (row.original.name) ? <span className="tt-lower">{row.original.name.toLowerCase()} </span> : null
                )
            },
            {
                accessorKey: 'tags',
                header: 'Tags',
                muiTableHeadCellProps: {
                    align: 'left',
                },
                muiTableBodyCellProps: {
                    align: 'left',
                },
                Cell: ({ row }) => (
                    (row.original.tags) ? <span className="tt-lower">{row.original.tags.toLowerCase()} </span> : null
                )
            },
            {
                accessorKey: 'url',
                header: 'Url',
                muiTableHeadCellProps: {
                    align: 'left',
                },
                muiTableBodyCellProps: {
                    align: 'left',
                },
                Cell: ({ row }) => (
                    (row.original.url) ? <span className="tt-lower">{row.original.url.toLowerCase()} </span> : null
                )
            },
            {
                accessorKey: "Actions",
                header: "Actions",
                enableSorting: false,
                Cell: ({ row }) => (
                    <Stack key={row.original.id}>
                        {(myOrAll === 'subscribers') ?
                            <Box sx={{ display: 'flex' }} >
                                <Tooltip title="Settings" placement="top" color="primary"
                                    sx={{
                                        maxWidth: "30px", mr: 1, mt: -1, mb: -1
                                    }}
                                >
                                    <IconButton onClick={() => {
                                        handleSettingJobBoard(row.original.id, row.original.name); // Replace 1 with the actual jobId you want to delete
                                    }} >
                                        <SettingsIcon />
                                    </IconButton>
                                </Tooltip>
                                <Button
                                    className="customButtonForHover"
                                    variant="outlined"
                                    color="secondary"
                                    sx={{
                                        maxWidth: "120px", mr: 1
                                    }}
                                    id={`Delete-btn-${row.original.id}`}
                                    onClick={() => {
                                        confirmDialog(`Are you sure you want to Un-Subscribe this Job Board? - ${row.original.name}`, () => {
                                            handleUnSubscrieJobBoard(row.original.id); // Replace 1 with the actual jobId you want to delete
                                        }, "warning");
                                    }}
                                >
                                    Un-Subscribe
                                </Button>

                            </Box>
                            :
                            <Button
                                className="customButtonForHover"
                                variant="contained"
                                color="primary"
                                sx={{
                                    maxWidth: "120px"
                                }}
                                id={`Subscribe-btn-${row.original.id}`}
                                onClick={() => {
                                    handleSubscrieJobBoard(row.original.id, row.original.name); // Replace 1 with the actual jobId you want to delete
                                }}
                            >
                                Subscribe
                            </Button>
                        }

                    </Stack>
                )
            },
        ], [myOrAll]
    );

    const saveAuditLog = (id: number) => {
        ApiService.saveAuditLog(id);
    }

    useEffect(() => {
        saveAuditLog(4247);
        SubscribedJobBoardsData();
    }, []);

    return (
        <div className="JobBoards pl-4 pr-3">
            <div className='pt-3'>
                <div >
                    <Grid
                        container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        className="customCard px-4 py-2 mb-2"
                        sx={{ minHeight: "auto !important" }}
                    >
                        <Typography variant="h6" className="header"> Job Board</Typography>
                        <div className="d-flex">
                            <div>
                                <Button variant="contained" color="primary" className='mr-3' onClick={() => { saveAuditLog(4249); setOpenApplicantJobBoardModal(true) }}>
                                    Application Details
                                </Button>

                            </div>

                            <div>
                                <Button variant="contained" color="primary" className='mr-3' onClick={() => { saveAuditLog(4250); setOpenPublishJobBoardModal(true) }}>
                                    Published Jobs
                                </Button>
                                {/* <Dialog fullScreen
                                    open={open}
                                    onClose={handleClose}
                                >
                                    <DialogTitle>Published Jobs</DialogTitle>
                                    <DialogContent>
                                        <JobBoardsApplicationPublishedJobs />
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleClose} color="primary">
                                            Close
                                        </Button>
                                    </DialogActions>
                                </Dialog> */}

                            </div>

                        </div>
                    </Grid>
                    <Grid>
                        <Tabs
                            value={myOrAll}
                            onChange={handleChange}
                            className="tableTabs"
                        >
                            <Tab onClick={() => { saveAuditLog(4251); SubscribedJobBoardsData() }} value={"subscribers"} label={"Subscribers"} />
                            <Tab onClick={() => { saveAuditLog(4248); UnSubscribedJobBoardsData() }} value={"unsusbscribers"} label={"UnSubscribers"} />

                        </Tabs>
                    </Grid>

                    <div className="MRTableCustom pl-0">

                        <MaterialReactTable
                            columns={columns}
                            data={filteredData}
                            enablePinning
                            initialState={{
                                columnPinning: { left: ["mrt-row-select"] },
                                density: "compact",
                                showGlobalFilter: true
                            }}
                            state={{
                                pagination,
                                globalFilter,
                                isLoading: isDataFetching,
                            }}
                            muiPaginationProps={{
                                rowsPerPageOptions: [10],
                                showFirstButton: false,
                                showLastButton: false,
                                SelectProps: {
                                    style: { display: 'none' }, // Hide the rows per page dropdown
                                },
                            }}
                            enablePagination={true}
                            renderBottomToolbarCustomActions={() => (
                                <CustomPagination
                                    page={pagination.pageIndex}
                                    rowsPerPage={10}
                                    rowCount={rowCount}
                                    onChangePage={(page: any) => setPagination({ ...pagination, pageIndex: page, pageSize: 10 })}
                                    showCount={false}
                                />
                            )}
                            onGlobalFilterChange={setGlobalFilter}
                            enableDensityToggle={false}
                            enableFullScreenToggle={false}

                            enableGlobalFilterModes
                            columnResizeMode="onChange"
                            getRowId={row => row.id}

                            enableStickyHeader
                            icons={{
                                ArrowDownwardIcon: (props: any) => (
                                    <SwitchLeftIcon {...props} />
                                ),
                            }}
                            muiSearchTextFieldProps={{
                                value: searchValue,
                                onChange: (e: any) => {
                                    setPagination((prev) => ({
                                        ...prev, pageIndex: 0
                                    }))
                                    setSearchValue(e.target.value);
                                },
                                InputProps: {
                                    startAdornment: <InputAdornment position="start"><SearchOutlined fontSize='small' htmlColor='#757575' /></InputAdornment>,
                                    endAdornment: <InputAdornment position="end" disablePointerEvents={searchValue ? false : true}>
                                        <CloseRounded fontSize='small' htmlColor={searchValue ? "#757575" : "#ebebeb"} sx={{ cursor: "pointer" }} onClick={() => {
                                            setPagination((prev) => ({
                                                ...prev, pageIndex: 0
                                            }));
                                            setSearchValue("");
                                        }} />
                                    </InputAdornment>
                                }

                            }}
                        />
                    </div>

                </div>

                {openSubscribeJobBoardModal ? (
                    <SubscribeJobBoard
                        open={openSubscribeJobBoardModal}
                        closePopup={handleJobBoardClose}
                        subscribeJobBoardData={subscribeJobBoardData}
                        add={subEdit}
                        subscribeJobBoardGetData={subscribeJobBoardGetData}
                    />
                ) : null}



                {openPublishJobBoardModal ? (
                    <JobBoardsPublishList
                        open={openPublishJobBoardModal}
                        closePopup={handleSubscribeJobBoardClose}
                    />
                ) : null}


                {openApplicantJobBoardModal ? (
                    <JobBoardsApplicationDetails
                        open={openApplicantJobBoardModal}
                        closePopup={handleSubscribeJobBoardClose}
                    />
                ) : null}

            </div >
        </div >
    )
}

export default JobBoards;