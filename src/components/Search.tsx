import React from "react";
import '../index.css';

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
      <div className="search-form">
        <form className="search-form-content" onSubmit={this.props.onSearch}>
          
          <input
            className="search-input"
            type="text"
            value={this.props.searchValue}
            onChange={this.handleChange}
            placeholder="Enter pokemon name..."
          />

          <input
            className="search-button"
            type="submit"
            value="search"
          />

        </form>

        <p className="text-info">
          The search is performed by the full name of the Pokemon
        </p>
      </div>
    );

  }
}

export default Search;