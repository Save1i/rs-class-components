import React from "react";
import type { Pokemon } from "./Main";
import '../styles/style.css'

interface Props {
  item: Pokemon[] | null,
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
        <ul>
          {pokemon.map((el) => (
            <li key={el.id}>
              <img src={el.image} alt={el.name} />
              <p>Name: {el.name}</p>
              <p>Height: {el.height}</p>
              <p>Weight: {el.weight}</p>
            </li>
          ))}
        </ul>
      </>
    );

  }
}

export default CardList;