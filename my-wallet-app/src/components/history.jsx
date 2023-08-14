import React from "react";
import Web3 from "web3";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const web3 = new Web3(window.ethereum);

export const HistoryAccordion = (props) => {
  return (
    <Accordion sx={{ maxWidth: "80vw" }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>{props.transaction.date}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <TableContainer component={Paper}>
          <Table sx={{ maxWidth: "80vw" }}>
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="row">
                  From:
                </TableCell>
                <TableCell align="right">
                  {props.transaction.from.substring(0, 4)}..........
                  {props.transaction.from.substring(35)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Amount:
                </TableCell>
                <TableCell align="right">
                  {web3.utils.fromWei(props.transaction.amount, "ether")}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  To:
                </TableCell>
                <TableCell align="right">
                  {props.transaction.to.substring(0, 4)}..........
                  {props.transaction.to.substring(35)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </AccordionDetails>
    </Accordion>
  );
};
