import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


class TableCell extends React.Component {

	constructor(props){
		super(props)
		this.handleClick = this.handleClick.bind(this)
	}

	handleClick = (event) =>{
		console.log(event);
		this.props.handleCellClick(this.props.cell.row, this.props.cell.column, event.target.value);
	}

	render(){
		let proc_img_src = "data: image/png; base64, " + this.props.cell.processed_image
		let img_src = "data: image/png; base64, " + this.props.cell.image
		let text = this.props.cell.text
		return(
			<td>
				<div><input type="text" name="test" defaultValue={text} onChange={this.handleClick}/></div>
				<div><img src={img_src} alt="Couldn't load"/></div>
				<div><img src={proc_img_src} alt="Couldn't load"/></div>
			</td>
		)
	}
}


function TableRow(props){
	const row = props.row;
	return(
		<tr key={row.row}>
			{row.map( (cell,index) => <TableCell key={index} cell={cell} handleCellClick={(row,column,value) => props.handleCellClick(row, column, value)}/>)}
		</tr>
	)
}


class Table extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			isLoaded:false,
			table_data:[]
		}
		this.updateCell = this.updateCell.bind(this)
		this.confirmTableData = this.confirmTableData.bind(this)
	}

	updateCell(row, column, value){
		const new_table = this.state.table_data.slice();
		new_table[row][column].text = value;
		this.setState({...this.state, table_data:new_table})
	}

	confirmTableData() {
    const recipeUrl = 'http://localhost:8000/api/data/verified/table';
    const postBody = {
    	id : this.state.table_id,
    	verified_cells : this.state.table_data.reduce((a,c) => a.concat(c), [])
    };
    const requestMetadata = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postBody)
    };
    console.log(requestMetadata.body);
    fetch(recipeUrl, requestMetadata)
        .then(res => res.json())
        .then(recipes => {
            this.setState({ recipes });
        });
	}

	componentDidMount() {
		fetch("http://127.0.0.1:8000/api/parser/image/table/")
		.then(res => res.json())
		.then(
			(result) => {
				const table_id = result.telegram_media.id
				const media_path = result.telegram_media.media_path
				const table_data_id = result.id
				const table_data = result.table_rows.map( row => {
					return row.table_cells.map( cell => {
						return {row:row.row, column:cell.column, text:cell.text, image:cell.image, processed_image:cell.processed_image}
					})
				})

				this.setState({
					isLoaded:true,
					table_data:table_data,
					table_id:result.id
				});
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
  		return <div>Getting data from API</div>
  	}
    return (
      <div>
	    <table>
      	<tbody>
      		{
      			this.state.table_data.map( (row, index) => <TableRow key={index} row={row} handleCellClick={(row,column,value) => this.updateCell(row, column, value)}/>)
      		}
      	</tbody>
      </table>
      <button onClick={this.confirmTableData}>Confirm Data</button>
      </div>
    );
  }
}


// ========================================

ReactDOM.render(
  <Table />,
  document.getElementById('root')
);

