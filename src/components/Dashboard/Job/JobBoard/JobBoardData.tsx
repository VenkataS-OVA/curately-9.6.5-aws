import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
// import TextField from '@mui/material/TextField'; 
import FormControl from '@mui/material/FormControl';
import React, { useMemo, useState, Fragment, useContext, useRef, useEffect } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import RadioGroup from '@mui/material/RadioGroup';
import Box from "@mui/material/Box";
// import MenuItem from '@mui/material/MenuItem';
import { Card, CardContent, duration, InputLabel, OutlinedInput } from '@mui/material';
import * as Yup from "yup";
import ApiService from "../../../../shared/api/api";

import { useFormik } from "formik";


const JobBoardData = (
    { boardId, boardData, sendData, jobBoardsExistingData }: {
        boardId: any;
        boardData: any;
        sendData: any;
        jobBoardsExistingData:any;
    }
) => {
    const [listJobBoards, setListJobBoards] = useState<any>([]);
    const [boardIdData, setBoardIdData] = useState<any>({
        "boardId": boardId,
        "extrafield": [{
            "name": "",
            "value": "",
            "description": "",
            "required": "",
        }],
        "duration": {
            "name": "",
            "value": "",
        }
    });

    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const initialDataBoardDetails = {
        "boardId": "",
        "boardDurationDays": "",
        "extrafield": [{
            "name": "",
            "value": "",
            "required": "",
        }],
        "duration": {
            "name": "",
            "value": "",
        }
    }
    const dataBoardSchema = Yup.object().shape({
        boardId: Yup.string(),
        boardDurationDays: Yup.string(),
        extrafield: Yup.array().of(
            Yup.object().shape({
                name: Yup.string(),
                value: Yup.string(),
                required: Yup.string(),
            })
        ),
        duration: Yup.object().shape({
            name: Yup.string(),
            value: Yup.string(),
        })

    });


    const DataJobBoardFormik = useFormik({
        initialValues: initialDataBoardDetails,
        validationSchema: dataBoardSchema,
        onSubmit: () => {
            setIsFormSubmitted(true);
            //  console.log(SubscribeJobBoardFormik.values);
        },
        validateOnMount: true
    });


    useEffect(() => {
        getAllJobBoardList(boardId);
        // setBoardIdData({
        //     ...boardIdData,
        //     boardId: boardId, 
        // });
    }, []);

    const getAllJobBoardList = (boardID: any) => {

        let subData = {
            "boardId": (boardID ? boardID : "")
        }

        ApiService.postWithData('admin', `getBoardSpecificFields`, subData)
            .then((response) => {
                //   console.log("Board" + boardID);
                //   console.log(response.data.idibu.boards.board);
                setListJobBoards(response.data.idibu.boards.board);
                let tempData = response.data.idibu.boards.board;
                //    console.log(tempData?.id);
                //    console.log(tempData?.name);

                // DataJobBoardFormik.setFieldValue(`boardId`, tempData?.id, true);
                //subscribeJobBoardData &&  subscribeJobBoardData[0]?.field?.map((setting: any, si: number) => (
                let tempApplicantsList = [];
                for (let ap = 0; ap < tempData?.extrafields?.extrafield?.length; ap++) {
                    tempApplicantsList.push(
                        { name: tempData?.extrafields?.extrafield[ap].name, value: "", description: tempData?.extrafields?.extrafield[ap].description, required: tempData?.extrafields?.extrafield[ap].required ? tempData?.extrafields?.extrafield[ap].required : false }
                    )
                }

                setBoardIdData({
                    ...boardIdData,
                    boardId: tempData?.id,
                    duration: { name: "duration", value: "" },
                    extrafield: tempApplicantsList,
                });
                sendData({
                    ...boardIdData,
                    boardId: tempData?.id,
                    duration: { name: "duration", value: "" },
                    extrafield: tempApplicantsList,
                })

                //   console.log("DataJobBoardFormik.values");
                // console.log(tempApplicantsList);
                // console.log(boardIdData);
            })
    }

    const handleTextChange = (boardId: number, filter: any, fieldName: string, newValue: string | any[]) => {
        // console.log(" === " + boardId + " -- " + fieldName + " -- " + newValue);

        const tempIndex = boardIdData?.extrafield?.findIndex((item: { name: string }) => item.name === fieldName);
        if (tempIndex !== -1) {

            let newObj = boardIdData?.extrafield.map((item: any, index: number) => {
                if (item.name === fieldName) {
                    return { ...item, value: newValue };
                }
                return {
                    ...item
                };
            });

            console.log(newObj);

            setBoardIdData({
                ...boardIdData,
                extrafield: newObj
            });
            sendData({
                ...boardIdData,
                extrafield: newObj
            });

            let tempListJobBoards = listJobBoards;
            tempListJobBoards.extrafields.extrafield = tempListJobBoards.extrafields.extrafield.map((each: any) => ({
                ...each,
                value: fieldName === each.name ? newValue : (each.value || "")
            }))
            setListJobBoards(tempListJobBoards);
        }
        // const tempIndex = boardIdData?.findIndex((item: { boardId: any }) => Number(item.boardId) === Number(boardId));
        // if (tempIndex !== -1) {
        //    // tempSubMasterModule[tempIndex].checked = checked;
        // }

        //     console.log("tempIndex" + tempIndex);
        //     // setFilterValues(prev => ({ ...prev, [id]: newValue }));
        //     const boardIndex = addBoardDynamicList[0].boardDetails[tempIndex]?.extraFileds.findIndex((item: { name: string }) => (item.name) === (fieldName));

        //     console.log("boardIndex" + boardIndex);

        // addBoardDynamicList[0].boardDetails[tempIndex]?.extraFileds[boardIndex].push( [...addBoardDynamicList[0].boardDetails[tempIndex]?.extraFileds[boardIndex], {name:fieldName, value:newValue, description:addBoardDynamicList[0].boardDetails[tempIndex]?.extraFileds[boardIndex].description, required:addBoardDynamicList[0].boardDetails[tempIndex]?.extraFileds[boardIndex].required}]); 

        //     // setFilters(filters.map(filter => filter.id === id ? { ...filter, value: newValue } : filter));
        //     // setAddBoardDynamicList(addBoardDynamicList[0].boardDetails[tempIndex]?.extraFileds?.map((filter :any) => filter.name === fieldName ? { ...filter, value: newValue } : filter));
        //        console.log("addBoardDynamicList");
        //          console.log(addBoardDynamicList[0]);
        //    // const temp1 = [...addBoardDynamicList];
        // addBoardDynamicList[0].boardDetails?.map((row: any, idx: number) => {
        //     if (row.id === boardId) {
        // addBoardDynamicList[0].boardDetails[tempIndex]?.extraFileds?.map((rowextra: any, inx: number) => {
        //         if (rowextra.name === fieldName) {
        //             return {...rowextra, 'value': newValue }
        //         }
        //     });
        //     };
        //     return row;
        // });

        //    setAddBoardDynamicList(...addBoardDynamicList);

        // const temp1 = [...addBoardDynamicList];
        // const updatedData = addBoardDynamicList?.boardDetails?.map((row: any, index:number) => {
        //     console.log(boardId);
        //     console.log(row.name);
        //     // if (row.id === boardId) {
        //     //     console.log(boardId);
        //     //     if (row.extraFileds[index].name === fieldName) {
        //     //         console.log(row.extraFileds[index].name);

        //     //         return {
        //     //             ...row.extraFileds[index],
        //     //             value: newValue,
        //     //         }
        //     //     }
        //     // }

        //     // return row;
        // });
        // temp1[0].boardDetails = updatedData;
        // setAddBoardDynamicList(temp1);
        console.log("updatedData");

        console.log(boardIdData);

        //    console.log(addBoardDynamicList);
    };

    const renderFilter = (filter: any, bid: number, index: number) => {
        //   console.log(bid + " -- "+ filter.name);
        switch (filter.type) {

            case 'select':
                if (filter?.multi) {
                    return <FormControl fullWidth size='small'>
                        <InputLabel id={filter.name}><>
                            {filter.description}
                            {filter.required ? <span style={{ color: 'red' }}>*</span> : null}
                        </>
                        </InputLabel>
                        <Select
                            labelId={filter.name}
                            size='small'
                            name={filter.name}
                            fullWidth
                            multiple
                            value={(filter?.value) ? (filter.value) : []}
                            onChange={(event) => {
                                const value = event.target.value;
                                handleTextChange(bid, filter, filter.name, value)
                            }}
                            input={<OutlinedInput label={
                                <>
                                    {filter.description}
                                    {filter.required ? <span style={{ color: 'red' }}>*</span> : null}
                                </>
                            } />}
                        >
                            {filter?.data?.option?.map((sector: any, index: number) => (
                                typeof sector === "string" ? <MenuItem value={sector} disabled>{sector}</MenuItem> :
                                    //sector.length
                                    (<MenuItem key={index} value={sector.id}>{sector.content}</MenuItem>)
                            ))}

                        </Select>
                    </FormControl >

                } else return (<>
                    <TextField
                        value={filter.value}
                        onChange={(event) => handleTextChange(bid, filter, filter.name, event.target.value)}
                        select
                        name={filter.name}
                        fullWidth
                        size="small"
                        label={
                            <>
                                {filter.description}
                                {filter.required ? <span style={{ color: 'red' }}>*</span> : null}
                            </>
                        }
                        type={filter.type}
                    >
                        {filter?.data?.option?.map((sector: any, index: number) => (
                            //sector.length
                            (<MenuItem key={index} value={sector.id}>{sector.content}</MenuItem>)
                        ))}
                    </TextField>
                </>);
            case 'text':
                return (
                    <>

                        <TextField
                            value={filter.value}
                            fullWidth
                            name={filter.name}
                            onChange={(event) => handleTextChange(bid, filter, filter.name, event.target.value)}
                            label={
                                <>
                                    {filter.description}
                                    {filter.required ? <span style={{ color: 'red' }}>*</span> : null}
                                </>
                            }
                            type={filter.type}
                            size="small"
                        />
                    </>

                );
            case 'hidden':
                return (
                    <>
                        <TextField
                            value={filter.value}
                            fullWidth
                            name={filter.name}
                            onChange={(event) => handleTextChange(bid, filter, filter.name, event.target.value)}
                            label={
                                <>
                                    {filter.description}
                                    {filter.required ? <span style={{ color: 'red' }}>*</span> : null}
                                </>
                            }
                            type={filter.type}
                            size="small"
                        />
                    </>

                );

            default:
                return null;
        }
    };


    return (
        (<Grid container direction="row"
            justifyContent="flex-start"
            alignItems="flex-start"
            sx={{ width: "100%" }}
        >
            <Grid className='mr-2' size={12}>
                <h4>{listJobBoards && listJobBoards.name}</h4>
            </Grid>
            <Grid className='mt-2 mr-2' size={4}>
                <TextField
                    //  onChange={(event) => handleTextChange(listJobBoards.id, listJobBoards, 'duration', event.target.value)}
                    onChange={(event) => {
                        const description = event.target.value; //.split('\n');
                        setBoardIdData({
                            ...boardIdData,
                            duration: { name: "duration", value: description },

                        });
                        sendData({
                            ...boardIdData,
                            duration: { name: "duration", value: description },
                        })
                        //  console.log(description);
                        // getAllSubLocationList('');
                    }}
                    select
                    name="duration"
                    fullWidth
                    size="small"
                    label={
                        <>
                            Duration
                            <span style={{ color: 'red' }}>*</span>
                        </>
                    }
                >
                    {listJobBoards?.durations?.duration?.length > 1 && listJobBoards?.durations?.duration?.map((subitem: any, index: any) => (
                        <MenuItem key={index} value={subitem.value}>{subitem.content}</MenuItem>
                    ))}

                    {listJobBoards?.durations?.duration?.value !== "" && <MenuItem value={listJobBoards?.durations?.duration?.value}>{listJobBoards?.durations?.duration?.content}</MenuItem>}
                </TextField>
            </Grid>
            {
                listJobBoards?.extrafields?.extrafield?.map((subitem: any, ssi: any) => (
                    <Grid
                        className={` ${subitem.type === "hidden" ? "d-none" : ""}  mt-2 mr-2`}
                        key={subitem.id}
                        size={4}>
                        {renderFilter(subitem, listJobBoards.id, ssi)}
                    </Grid>
                ))
            }
        </Grid>)
    );
}
export default JobBoardData;
