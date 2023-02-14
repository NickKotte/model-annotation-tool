import Card from "@mui/material/Card";
import { useEffect, useContext } from "react";
import styled from "styled-components";
import GlobalStateContext from "../../utilities/context";
import Row from "./Row";

const TableContainer = styled.div`
  width: 100%;
`;

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  font-family: Arial, sans-serif;
  font-size: 14px;
  color: #333;
`;

const TableHead = styled.thead`
  background-color: #f5f5f5;
`;

const TableHeadRow = styled.tr`
  border-bottom: 1px solid #ddd;
`;

const TableHeadCell = styled.th`
  padding: 10px 15px;
  text-align: left;
`;

const TableBody = styled.div`
  background-color: #fff;
  width: 100%;
  height: 100%;
`;

// A table for the data of 3D models
export default _ => {
	const { globalState, API } = useContext(GlobalStateContext);
	console.log(globalState)
	const { models } = globalState;
	useEffect(() => {
		API.fetchModels();
	}, []);

	useEffect(() => {
		console.log(models);
	}, [models]);

	return (
		<TableContainer>
			<Table>
				<TableHead>
					<TableHeadRow>
						<TableHeadCell>Column 1</TableHeadCell>
						<TableHeadCell>Column 2</TableHeadCell>
						<TableHeadCell>Column 3</TableHeadCell>
					</TableHeadRow>
				</TableHead>
			</Table>
			<TableBody>
				{models?.map((row, index) => (
					<Row key={index} model={row} />
				))}
			</TableBody>
		</TableContainer>
)}