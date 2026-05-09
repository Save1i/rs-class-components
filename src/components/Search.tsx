import React from "react";
import '../styles/style.css'

interface Props {
  onSearch: (event: React.SyntheticEvent) => void,
  onChange: (value: string) => void,
  searchValue: string,

}

class Search extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
    this.state = {
    };
  }


    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      this.props.onChange(e.target.value);
    };



  render() {
    
    return (
        <form onSubmit={this.props.onSearch}>
          <div className="">
            <input type="text" value={this.props.searchValue} onChange={this.handleChange}/>
            <input type="submit" value={"search"}></input>
          </div>
          <span>Поиск осуществляется по полному имени покемона</span>
        </form>
    );

  }
}

export default Search;