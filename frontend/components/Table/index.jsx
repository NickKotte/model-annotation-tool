import React from "react";
import styled from "styled-components";
import { getModels } from "../../utilities/object.api";
import Row from "./Row";

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
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

const TableBody = styled.tbody`
  background-color: #fff;
`;

// A table for the data of 3D models
export default _ => {
	const [models, setModels] = React.useState([]);
	const fetchTableData = () => {
		getModels().then((res) => {
			console.log(res);
			setModels(res);
		});
	}
	React.useEffect(() => {
		fetchTableData();
	}, []);

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
				<TableBody>
					{models.map((row, index) => (
						<Row key={index} model={row} />
					))}
				</TableBody>
			</Table>
		</TableContainer>
)}