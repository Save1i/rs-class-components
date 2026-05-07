import React from "react";

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
          <input type="text" value={this.props.searchValue} onChange={this.handleChange}/>
          <input type="submit" value={"search"}></input>
        </form>
    );

  }
}

export default Search;