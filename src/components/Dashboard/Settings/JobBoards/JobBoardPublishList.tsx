// import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { useEffect, useMemo, useState, useCallback } from "../../../../shared/modules/React";
// import { userLocalData } from "../../../../shared/services/userData";
// import { Typography } from "../../../../shared/modules/MaterialImports/Typography";
import { Grid } from '../../../../shared/modules/MaterialImports/Grid2';
import { MaterialReactTable, type MRT_ColumnDef } from "../../../../shared/modules/MaterialReactTable";
import { trackPromise } from '../../../../shared/modules/PromiseTrackter';
import SwitchLeftIcon from "@mui/icons-material/SwitchLeft";
import ApiService from "../../../../shared/api/api";
import { Stack } from "../../../../shared/modules/MaterialImports/Stack";
// import { Button, IconButton } from '../../../../shared/modules/MaterialImports/Button';
import { IconButton } from '../../../../shared/modules/MaterialImports/Button';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Tooltip } from '../../../../shared/modules/MaterialImports/ToolTip';
import CloseIcon from '@mui/icons-material/Close';
import { Divider } from '../../../../shared/modules/MaterialImports/Divider';
import { Loader } from "../../../shared/Loader/Loader";
import { Dialog, DialogTitle, DialogContent } from '../../../../shared/modules/MaterialImports/Dialog';
import { confirmDialog } from "../../../shared/ConfirmDialog/ConfirmDialog";
import { showToaster } from '../../../shared/SnackBar/SnackBar';
// import DialogActions from "@mui/material/DialogActions";
import TableViewIcon from '@mui/icons-material/TableView';
import JobBoardList from './JobBoardList';
import AddJobPortal from "../../Job/JobBoard/AddJobPortal";
import { debounce } from "lodash";
import { GetFormattedJobBoardData } from "./JobBoards";


const JobBoardsPublishList = (
    { open, closePopup }: {
        open: boolean;
        closePopup: () => void;
    }
) => {
    const [listPublishDetails, setListPublishDetails] = useState<any[]>([]);
    const [openJobBoardModal, SetOpenJobBoardModal] = useState(false);

    const [jobBoardId, setJobBoardId] = useState({ "jobId": "", "jobreference": "" });
    // const recrID = userLocalData.getvalue('recrId');

    const viewJobBoardModal = (jobId: any, jobReference: any) => {
        setJobBoardId({ "jobId": jobId, "jobreference": jobReference });
        SetOpenJobBoardModal(true);
    }


    const closeJobBoardModal = () => {
        SetOpenJobBoardModal(false);
    }

    const [openAddJobBoardModal, setOpenAddJobBoardModal] = useState(false);
    const openBoardModal = (JobId: any) => {

        // const jobBoardId = jobData.find((i: { jobId: string }) => { return i.jobId === Object.keys(rowSelection)[0] });
        // let jobId = jobBoardId && jobBoardId.jobId;

        // fetchJobDetails(jobId)
        //     .then(() => {
        //         setIsEditMode(false);
        setOpenAddJobBoardModal(true); // Open the modal only after state is updated
        //     })
        //     .catch(error => {
        //         showToaster("Unable to fetch Job Data", error)
        //     });
    };


    const PublishDetailsData = useCallback(debounce(() => {
        // http://35.155.202.216:8095/idibu/listAllPublishedJobs
        trackPromise(
            ApiService.getCall('admin', 'listAllPublishedJobs').then((response) => {
                //    console.log(response.data.idibu?.response?.jobs?.job);
                setListPublishDetails(() => GetFormattedJobBoardData(response.data.idibu?.response?.jobs?.job || []));
            })
        )
    }, 400), [])



    const deletePublishJobId = (PublishJobId: string) => {

        const tempIdx = listPublishDetails.findIndex((item: { id: any }) => parseInt(item.id) == parseInt(PublishJobId));
        let tempBoardIds: any = [];

        listPublishDetails && listPublishDetails[tempIdx]?.portals?.portal?.map((item: any, idx: number) => (
            tempBoardIds.push(
                { boardid: item.id }
            )
        ));

        let delBoards = {
            "jobId": PublishJobId,
            "boardDetails": tempBoardIds,
        }

        trackPromise(
            // http://35.155.202.216:8080/QADemoCurately/deletePublishJob
            // ApiService.deleteById(216, `QADemoCurately/deletePublishJobs/${PublishJobId}`, clientId)
            ApiService.postWithData('admin', `deletePostedJob`, delBoards)
                .then(
                    (response: any) => {

                        if (response.data.Success) {
                            showToaster('Publish Job has been deleted successfully.', 'success');
                            PublishDetailsData();
                        } else {
                            showToaster(response.data.Message ? response.data.Message : "An error occured while deleting", 'error');
                        }

                    }
                ).catch(
                    (response: any) => {
                        showToaster(response.response?.data?.Message ? response.response?.data?.Message : "An error occured while deleting", 'error');
                    }

                )
        )
    }
    const handleDeletePublishJob = (PublishJobId: string, PublishName: string) => {
        confirmDialog(`Are you sure you want to delete this Publish Job - ${PublishName}?`, () => {
            deletePublishJobId(PublishJobId);
            // loadPublishJobList();
        });
    };

    useEffect(() => {
        PublishDetailsData();
    }, [])


    const columns: MRT_ColumnDef<any>[] = useMemo(
        () => [
            {
                accessorKey: 'id',
                header: 'Job ID',
                size: 60,
            },
            {

                accessorKey: 'title',
                header: 'Title',
            },
            {

                accessorKey: 'sector.content',
                header: 'Category',
            },
            {
                accessorKey: 'sender.email',
                header: 'Sender Email',
                muiTableHeadCellProps: {
                    align: 'left',

                },
                muiTableBodyCellProps: {
                    align: 'left',
                },
                Cell: ({ row }) => (
                    <span className="tt-lower">{row.original.sender?.email?.toLowerCase()} </span>
                )
            },
            {
                accessorKey: 'reference',
                header: 'Job Reference',
                muiTableHeadCellProps: {
                    align: 'left',
                },
                muiTableBodyCellProps: {
                    align: 'left',
                },
            },
            {
                accessorKey: 'sub_location.content',
                header: 'Sub Location',
                muiTableHeadCellProps: {
                    align: 'left',
                },
                muiTableBodyCellProps: {
                    align: 'left',
                },
                Cell: ({ row }) => (
                    row.original.sub_location?.content && <span className="tt-lower">{row.original.sub_location.content} </span>
                )
            },
            {
                accessorKey: 'working_hours',
                header: 'Working Hours',
                muiTableHeadCellProps: {
                    align: 'left',
                },
                muiTableBodyCellProps: {
                    align: 'left',
                },

            },
            {
                accessorKey: "Actions",
                header: "Actions",
                Cell: ({ row }) => (
                    <Stack key={row.original.id}>
                        <Stack direction={"row"}>

                            <Tooltip title="Job Board List" placement="top" color="primary">
                                <IconButton onClick={() => viewJobBoardModal(row.original.id, row.original.reference)}>
                                    <TableViewIcon />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Edit" placement="top" color="primary">
                                <IconButton onClick={() => openBoardModal(row.original.id)}>
                                    <EditIcon />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Delete" placement="top" color="primary">
                                <IconButton onClick={() => handleDeletePublishJob(row.original.id, row.original.title)}>
                                    <DeleteOutlineIcon />
                                </IconButton>
                            </Tooltip>
                        </Stack>

                    </Stack>
                )
            },
        ], []


    );

    return (
        <Dialog
            maxWidth={'xl'}
            fullWidth={true} open={open} id='AddApplicantJobBoardModal'
        >      <Loader />
            <DialogTitle
                className='py-2'
            >
                <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <span className='addHeader'>
                        Job Board - Published Details
                    </span>
                    <div>
                        <Grid
                            container
                            direction="row"
                            justifyContent="end"
                            alignItems="center"
                        >

                            <CloseIcon onClick={() => closePopup()} />
                        </Grid>
                    </div>
                </Grid>
            </DialogTitle>
            <Divider />
            <DialogContent className='py-0 pt-0'>
                <div className="MRTableCustom pl-0">

                    <MaterialReactTable
                        columns={columns}

                        data={listPublishDetails}
                        enablePinning
                        initialState={{
                            columnPinning: { left: ["mrt-row-select"] },
                            density: "compact",
                            showGlobalFilter: true
                        }}
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

                    />
                </div>


                {openJobBoardModal ? (
                    <JobBoardList
                        open={openJobBoardModal}
                        closePopup={closeJobBoardModal}
                        boardData={jobBoardId}
                    />
                ) : null}


                {(openAddJobBoardModal) ?
                    <AddJobPortal
                        open={openAddJobBoardModal}
                        closePopup={() => { setOpenAddJobBoardModal(false) }}
                        add={false}
                        jobData={[]}
                    />
                    :
                    null
                }


            </DialogContent>
        </Dialog >
    )
}

export default JobBoardsPublishList;