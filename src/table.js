import React from 'react';
import './index.css';
import axios from 'axios';


class TableCell extends React.Component {

	constructor(props){
		super(props)
		this.handleClick = this.handleClick.bind(this)
	}

	handleClick = (event) =>{
		this.props.handleCellClick(this.props.cell.row, this.props.cell.column, event.target.value);
	}

	render(){
		let img_src = "data: image/png; base64, " + this.props.cell.image
		let text = this.props.cell.text
		return(
			<td>
				<div><img src={img_src} alt="Couldn't load"/></div>
				<div><input type="text" name="test" defaultValue={text} onChange={this.handleClick}/></div>
			</td>
		)
	}
}


function TableRow(props){
	const row = props.row;
	return(
		<tr key={row.row}>
			{row
				.filter( cell => !(props.hiddenColumns.includes(cell.column)))
				.map( (cell) => <TableCell key={cell.column} cell={cell} handleCellClick={props.handleCellClick}/>)}
		</tr>
	)
}


function TableHeader(props){
	const row = props.row;
	const headers = row.filter( cell => !(props.hiddenColumns.includes(cell.column))).map( 
		(cell) => { return ( <th key={cell.column}>
																	<button onClick={() => props.hideColumn(cell.column)}>Hide</button>
																</th>)});																		
	return(
		<thead>
			<tr key="-1">
				{headers}
			</tr>
		</thead>
	)

}


class Table extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			isLoaded:false,
			message:"Loading data...",
			table_data:[],
			hiddenColumns:[0,3,4,5,6,8,9],
			// hiddenColumns:[],
		}
		this.updateCell = this.updateCell.bind(this);
		this.confirmTableData = this.confirmTableData.bind(this);
		this.hideColumn = this.hideColumn.bind(this);
	}

	updateCell(row, column, value){
		const new_table = this.state.table_data.slice();
		new_table[row][column].text = value;
		this.setState({...this.state, table_data:new_table})
	}

	hideColumn(column){
		const hiddenColumns = this.state.hiddenColumns.slice();
		hiddenColumns.push(column);
		this.setState({...this.state, hiddenColumns:hiddenColumns});
	}

	confirmTableData() {
		this.setState({...this.state, isLoaded:false, message:"Updating data..."});
    axios.post('http://localhost:8000/api/data/verified/table/', this.state.table_data_raw)
    	.then(response => {this.setData(response.data)})
    	.catch( error => {this.setState({...this.state, isLoaded:false, message:"Error updating data"})});
	}

	setData(result){
		const table_data = new Array(result.total_rows)
		for( var index = 0; index < table_data.length; index++){
			table_data[index] = []
		}
		for( index = 0; index < result.verified_cells.length; index++){
			var cell = result.verified_cells[index]
			table_data[cell.row].push(cell)
		}
		this.setState({
			isLoaded:true,
			table_data:table_data,
			table_data_raw:result
		});
	}

	componentDidMount() {
		const table_id = this.props.match.params.tableid;

		fetch("http://127.0.0.1:8000/api/parser/image/table/"+table_id)
		.then(res => res.json())
		.then(
			(result) => {
				this.setData(result);
			},
			(error) => {
				this.setState({
					isLoaded:true,
					error:error
				});
			})
	}

  render() {
  	if (!this.state.isLoaded){
  		return <div>{this.state.message}</div>
  	}
    return (
      <div>
	    <table>
	    	<TableHeader row={this.state.table_data[0]} hiddenColumns={this.state.hiddenColumns} hideColumn={this.hideColumn}/>
      	<tbody>
      		{
      			this.state.table_data.map( (row, index) => 
      				<TableRow 
      					key={index} 
      					row={row} 
      					handleCellClick={this.updateCell}
      					hiddenColumns={this.state.hiddenColumns}
      					/>)
      		}
      	</tbody>
      </table>
      <button onClick={this.confirmTableData}>Confirm Data</button>
      </div>
    );
  }
}



export default Table