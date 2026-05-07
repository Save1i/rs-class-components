import React from "react";
import type { Pokemon } from "./Main";

interface Props {
  item: Pokemon | null,
  error: string,
}

class CardList extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
    this.state = {  

    };
  }





  render() {
    const { item: pokemon, error: searchError } = this.props;

    if (searchError) {
      return <p className="error">Ошибка: {searchError}</p>;
    }

    if (!pokemon) {
      return <p>Loading...</p>;
    }
    
    return (
      <>
        {pokemon.results && pokemon.results.length >= 1 ? (
          <ul>
            {pokemon.results.map((el) => (
              <li key={el.name}>{el.name}</li>
            ))}
          </ul>
        ) : (
          <div>
            <p>Name: {pokemon.name}</p>
            <p>Height: {pokemon.height}</p>
            <p>Weight: {pokemon.weight}</p>
          </div>
        )}
      </>
    );

  }
}

export default CardList;