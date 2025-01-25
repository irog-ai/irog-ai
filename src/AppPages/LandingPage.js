import React, { useState, useEffect } from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import Loading from "./ReusableComponents/Loading";
import HomePageTable from "./ReusableComponents/HomePageTable";
import FilterBar from "./ReusableComponents/FilterBar";
import * as myConstClass from "../Util/Constants";
import RefreshIcon from "@mui/icons-material/Refresh";
import ShowExceptionDialog from "./ReusableComponents/UIComponents/ErrorComponent";
import { fetchWithAuth } from "../Util/fetchWithAuth";


function LandingPage({ signOut }) {
  const initialState = {
    rows: [],
    columns: [],
    tableData: [],
    filteredTabledata: [],
    isLoading: false,
    selectedFilter: "",
    showExceptionDialog: false,
  };

  const [state, setState] = useState(initialState);

  useEffect(() => {
    setState((prevState) => ({ ...prevState, isLoading: true }));
    fetchData();
  }, []);

  
  const fetchData = async () => {
    try {
      let apiFunctionPath = "cases/getCases";
      const response = await fetchWithAuth(apiFunctionPath);
      console.log(response);
      response.forEach((element) => {
        if (element.Status.includes(",")) {
          element.CancelQueue = element.Status;
          element.Status = myConstClass.STATUS_CANCEL;
        }
      });
      setState((prevState) => ({
        ...prevState,
        tableData: response,
        isLoading: false,
        filteredTabledata: response,
      }));
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        tableData: [],
        isLoading: false,
        filteredTabledata: [],
        showExceptionDialog: true,
      }));      
    }
  };

  const filterTableData = (filterType) => {
    const filteredTabledata = state.tableData.filter((x) => {
      switch (filterType) {
        case myConstClass.STATUS_NEW:
          return x.Status === myConstClass.STATUS_NEW;
        case myConstClass.STATUS_ATTESTED:
          return x.Status === myConstClass.STATUS_ATTESTED;
        case myConstClass.STATUS_AWAITING:
          return x.Status === myConstClass.STATUS_AWAITING;
        case myConstClass.STAUS_COMPLETE:
          return x.Status === myConstClass.STAUS_COMPLETE;
        case myConstClass.STATUS_ALL:
          return x.Status !== null;
        case myConstClass.STATUS_CANCEL:
          return x.Status === myConstClass.STATUS_CANCEL;
        default:
          return false;
      }
    });

    setState((prevState) => ({
      ...prevState,
      filteredTabledata,
      selectedFilter: filterType,
    }));
  };

  return (
    <Box component="main" sx={{ flexGrow: 1 }}>
      {state.showExceptionDialog && <ShowExceptionDialog></ShowExceptionDialog>}
      {state.isLoading && <Loading />}
      <React.Fragment>
        <FilterBar
          tableData={state.tableData}
          filterTableData={filterTableData}
          selectedFilter={state.selectedFilter}
        />
        <Grid container alignItems="center">
          <Grid item xs={6}>
            <Typography
              variant="h6"
              gutterBottom
              style={{ marginTop: "20px", marginBottom: "20px" }}
            >
              Case History
            </Typography>
          </Grid>
          {!(
            state.selectedFilter === "" ||
            state.selectedFilter === myConstClass.STATUS_ALL
          ) && (
            <Grid
              item
              xs={6}
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Button
                onClick={() => filterTableData(myConstClass.STATUS_ALL)}
                variant="text"
                startIcon={<RefreshIcon />}
              >
                {"Reset Filters"}
              </Button>
            </Grid>
          )}
        </Grid>

        <HomePageTable rows={state.filteredTabledata} />
      </React.Fragment>
    </Box>
  );
}

export default LandingPage;
