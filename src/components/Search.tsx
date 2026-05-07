import React from "react";

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }




  render() {
    
    return (
        <form onSubmit={this.handleSubmit}>
          <input type="text" value={this.state.searchInput} onChange={this.handleChange}/>
          <input type="submit" value={"search"}></input>
        </form>
    );

  }
}

export default Search;