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
  image: string,
}

interface State {
  searchInput: string;
  pokemon: Pokemon[] | null;
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

  setPokemon = (item: Pokemon[] | null) => {
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
        const isValidName = /^[a-z]+$/i.test(searchInputClean)

        if (!isValidName && searchInputClean) {
          throw new Error('Некорректное имя покемона')
        }
        const pokemonData = await fetch(`${url}${searchInputClean}`)

        if (pokemonData.status === 404) {
          throw new Error(`Покемон "${searchInputClean}" не найден`);
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
                throw new Error('Ошибка загрузки покемона')
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
          throw new Error('Некорректное имя покемона')
        }

        const searchResponse = await fetch(`${url}${name}`)

        if (searchResponse.status === 404) {
          throw new Error(`Покемон "${name}" не найден`);
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
                throw new Error('Ошибка загрузки покемона')
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