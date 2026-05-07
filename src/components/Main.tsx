import React from "react";
import Search from "./Search";
import CardList from "./CardList";

type results = {
  name: string,
  url: string,
}

export interface Pokemon {
  id: number,
  name: string,
  height: number,
  weight: number,
  results?: Array<results>,
}

interface State {
  searchInput: string;
  pokemon: Pokemon | null;
  searchError: string;
}

class Main extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      searchInput: localStorage.getItem('searchInput') || '',
      pokemon: null,
      searchError: '',
    };
    
  }

  setPokemon = (item: Pokemon | null) => {
    this.setState({pokemon: item})
  }

  setError = (error: string) => {
    this.setState({searchError: error})
  }

  componentDidMount(): void {

    const searchInputClean = (this.state.searchInput).trim()

    const initialItem = async() => {
      const url = "https://pokeapi.co/api/v2/pokemon/"
      try {
        const pokemonData = await fetch(`${url}${searchInputClean}`)

        if (pokemonData.status === 404) {
          throw new Error(`Покемон "${searchInputClean}" не найден`);
        }

        if (!pokemonData.ok) {
          throw new Error(`Response status: ${pokemonData.status}`);
        }

        const resultData = await pokemonData.json()
        console.log(resultData)
        this.setPokemon(resultData)
        this.setError('')
      } catch (error: unknown) {
        if (error instanceof Error) {
          this.setError(error.message)
        }
      }
      
    }
    
    initialItem()

  }

  search = (name: string) => {

    const searchItem = async(name: string) => {
      const url = "https://pokeapi.co/api/v2/pokemon/"
      try {
        const searchResponse = await fetch(`${url}${name}`)

        if (searchResponse.status === 404) {
          throw new Error(`Покемон "${name}" не найден`);
        }

        if (!searchResponse.ok) {
          throw new Error(`Response status: ${searchResponse.status}`);
        }

        const resultData = await searchResponse.json()
        console.log(resultData)
        this.setPokemon(resultData)
        this.setError('')
      } catch (error: unknown) {
          if (error instanceof Error) {
            this.setError(error.message)
          }
      }
      
    }
    
    searchItem(name)
  }

  
  handleChange = (searchString: string) => {
    this.setState({searchInput: searchString});
  }
  
  handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();

    const cleanSearchInput = (this.state.searchInput).trim()

    if(localStorage.getItem('searchInput') !== cleanSearchInput) {
      this.setPokemon(null)
      // this.state.pokemon = null;
      this.search(cleanSearchInput)
    } else {
      console.log('you also have this on your screen')
    }

    localStorage.setItem("searchInput", cleanSearchInput)

  }

  render() {
    
    return (
      <div>
        <Search 
          searchValue={this.state.searchInput}
          onChange={this.handleChange}
          onSearch={this.handleSubmit}
        />
        <CardList
          item={this.state.pokemon}
          error={this.state.searchError}
        />
      </div>
    );

  }

}

export default Main