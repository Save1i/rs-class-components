import React from "react";
import Search from "./Search";
import CardList from "./CardList";
import '../index.css';

type results = {
  name: string,
  url: string,
}

export interface Pokemon {
  id: number,
  name: string,
  height: number,
  weight: number,
  image: string,
}

interface State {
  searchInput: string;
  pokemon: Pokemon[] | null;
  searchError: string;
  hasTestError: boolean;
}

class Main extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      searchInput: localStorage.getItem('searchInput') || '',
      pokemon: null,
      searchError: '',
      hasTestError: false,
    };
    
  }

  setPokemon = (item: Pokemon[] | null) => {
    this.setState({pokemon: item})
  }

  setError = (error: string) => {
    this.setState({searchError: error})
  }

  triggerTestError = () => {
    this.setState({
      hasTestError: true,
    })
  }

  componentDidMount(): void {

    const searchInputClean = (this.state.searchInput).trim()

    const initialItem = async() => {
      const url = "https://pokeapi.co/api/v2/pokemon/"
      try {
        const isValidName = /^[a-z]+$/i.test(searchInputClean)

        if (!isValidName && searchInputClean) {
          throw new Error('Incorrect Pokemon name')
        }
        const pokemonData = await fetch(`${url}${searchInputClean}`)

        if (pokemonData.status === 404) {
          throw new Error(`Pokemon "${searchInputClean}" not found`);
        }

        if (!pokemonData.ok) {
          throw new Error(`Response status: ${pokemonData.status}`);
        }

        const resultData = await pokemonData.json()

        if(resultData.results) {
          const pokemonList = await Promise.all(
            resultData.results.map(async (pokemon: results) => {
              const detailsResponse = await fetch(pokemon.url)

              if (!detailsResponse.ok) {
                throw new Error('Pokemon loading error')
              }

              const details = await detailsResponse.json()

              return {
                id: details.id,
                name: details.name,
                height: details.height,
                weight: details.weight,
                image: details.sprites.front_default,
              }
            })
        )

        this.setPokemon(pokemonList)
        this.setError('')
      } else {
        this.setPokemon([
          {
            id: resultData.id,
            name: resultData.name,
            height: resultData.height,
            weight: resultData.weight,
            image: resultData.sprites.front_default,
          }
        ])
        this.setError('')
      }

      } catch (error: unknown) {
        if (error instanceof Error) {
          this.setError(error.message)
        }
      }
      
    }
    
    initialItem()

  }

  search = async(name: string) => {

      const url = "https://pokeapi.co/api/v2/pokemon/"
      try {
        const isValidName = /^[a-z]+$/i.test(name)

        if (!isValidName && name) {
          throw new Error('Incorrect Pokemon name')
        }

        const searchResponse = await fetch(`${url}${name}`)

        if (searchResponse.status === 404) {
          throw new Error(`Pokemon "${searchResponse}" not found`);
        }

        if (!searchResponse.ok) {
          throw new Error(`Response status: ${searchResponse.status}`);
        }

        const resultData = await searchResponse.json()

        if(resultData.results) {
          const pokemonList = await Promise.all(
            resultData.results.map(async (pokemon: results) => {
              const detailsResponse = await fetch(pokemon.url)

              if (!detailsResponse.ok) {
                throw new Error('Pokemon loading error')
              }

              const details = await detailsResponse.json()

              return {
                id: details.id,
                name: details.name,
                height: details.height,
                weight: details.weight,
                image: details.sprites.front_default,
              }
            })
          )

          this.setPokemon(pokemonList)
          this.setError('')
        } else {
          this.setPokemon([
            {
                id: resultData.id,
                name: resultData.name,
                height: resultData.height,
                weight: resultData.weight,
                image: resultData.sprites.front_default,
              }
          ])
          this.setError('')
        }
      } catch (error: unknown) {
          if (error instanceof Error) {
            this.setError(error.message)
          }
      }
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
    if (this.state.hasTestError) {
      throw new Error('Test application error')
    }
    
    return (
    <main className="app">
      <div className="container">

        <h1 className="title">Pokemon Search</h1>

        <Search 
          searchValue={this.state.searchInput}
          onChange={this.handleChange}
          onSearch={this.handleSubmit}
        />
        
        <button
          className="search-button"
          onClick={this.triggerTestError}
        >
          Test Error
        </button>

        <CardList
          item={this.state.pokemon}
          error={this.state.searchError}
        />

      </div>
    </main>
    );

  }

}

export default Main